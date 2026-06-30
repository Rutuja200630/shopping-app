import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Address from '../models/Address.js';
import asyncHandler from '../utils/asyncHandler.js';
import { learnFromProducts } from '../services/fashionMemoryService.js';

// ── Statuses that allow cancellation ─────────────────────────────────────────
const CANCELLABLE_STATUSES = ['Pending', 'Confirmed'];

// ── Shipping fee threshold ────────────────────────────────────────────────────
const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_FEE = 99;

// ═══════════════════════════════════════════════════════════════════════════════
// POST /api/orders  — Create order from cart (atomic transaction)
// ═══════════════════════════════════════════════════════════════════════════════
export const createOrder = asyncHandler(async (req, res) => {
  const { addressId, paymentMethod } = req.body;
  const userId = req.user._id;

  // ── 1. Verify address ownership ─────────────────────────────────────────────
  const address = await Address.findOne({ _id: addressId, user: userId }).lean();
  if (!address) {
    res.status(404);
    throw new Error('Delivery address not found or does not belong to you.');
  }

  // ── 2. Load the user's cart with product details ────────────────────────────
  const cartItems = await Cart.find({ user: userId })
    .populate('product', 'name images price isActive inventory sizes')
    .lean();

  if (!cartItems || cartItems.length === 0) {
    res.status(400);
    throw new Error('Your cart is empty. Add items before placing an order.');
  }

  // ── 3. Validate all cart items: active + inventory ───────────────────────────
  const inventoryErrors = [];
  for (const item of cartItems) {
    const product = item.product;

    // Guard: product document missing (deleted from DB)
    if (!product) {
      inventoryErrors.push(`A product in your cart no longer exists.`);
      continue;
    }

    // Guard: product deactivated
    if (!product.isActive) {
      inventoryErrors.push(`"${product.name}" is no longer available.`);
      continue;
    }

    // Guard: size not in product sizes
    if (!product.sizes.includes(item.size)) {
      inventoryErrors.push(`Size "${item.size}" is no longer available for "${product.name}".`);
      continue;
    }

    // Guard: inventory check
    if (product.inventory < item.quantity) {
      inventoryErrors.push(
        `Insufficient stock for "${product.name}" (Size: ${item.size}). ` +
        `Requested: ${item.quantity}, Available: ${product.inventory}.`
      );
    }
  }

  if (inventoryErrors.length > 0) {
    res.status(400);
    throw new Error(inventoryErrors.join(' | '));
  }

  // ── 4. Build order items with price snapshots ────────────────────────────────
  const orderItems = cartItems.map((item) => ({
    product:      item.product._id,
    productName:  item.product.name,
    productImage: item.product.images?.[0] || '',
    size:         item.size,
    quantity:     item.quantity,
    priceSnapshot: item.product.price
  }));

  // ── 5. Calculate pricing ─────────────────────────────────────────────────────
  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.priceSnapshot * item.quantity,
    0
  );
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const discount = 0; // Phase 4.7+ (coupon engine)
  const total = subtotal + shipping - discount;

  // ── 6. Build address snapshot from the Address document ──────────────────────
  const addressSnapshot = {
    label:   address.label   || 'Home',
    street:  address.street,
    city:    address.city,
    state:   address.state,
    zipCode: address.zipCode,
    phone:   address.phone,
    country: 'India'
  };

  // ── 7. Execute atomically inside a MongoDB transaction ───────────────────────
  const session = await mongoose.startSession();
  let newOrder;

  try {
    await session.withTransaction(async () => {

      // a) Reduce product inventory for every cart item
      for (const item of cartItems) {
        const result = await Product.findOneAndUpdate(
          {
            _id: item.product._id,
            isActive: true,
            inventory: { $gte: item.quantity }   // re-check inside transaction
          },
          { $inc: { inventory: -item.quantity } },
          { session, new: true }
        );

        if (!result) {
          throw new Error(
            `Stock changed for "${item.product.name}" (Size: ${item.size}) while processing. Please refresh your cart.`
          );
        }
      }

      // b) Create the order document
      const [created] = await Order.create(
        [
          {
            user:            userId,
            items:           orderItems,
            addressSnapshot,
            subtotal,
            discount,
            shipping,
            total,
            paymentMethod,
            paymentStatus:   paymentMethod === 'COD' ? 'Pending' : 'Pending',
            status:          'Pending'
          }
        ],
        { session }
      );
      newOrder = created;

      // c) Clear the cart
      await Cart.deleteMany({ user: userId }, { session });
    });
  } finally {
    await session.endSession();
  }

  // Learn from the purchased products (weight +10)
  try {
    const purchasedProductIds = orderItems.map(item => item.product.toString());
    await learnFromProducts(req.user._id, purchasedProductIds, 10);
  } catch (err) {
    console.error('Failed to learn from order purchase:', err);
  }

  res.status(201).json({
    message: 'Order placed successfully.',
    orderId: newOrder._id,
    status:  newOrder.status,
    total:   newOrder.total
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/orders  — Order history for the logged-in user
// ═══════════════════════════════════════════════════════════════════════════════
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .select('items addressSnapshot subtotal shipping discount total status paymentMethod paymentStatus createdAt updatedAt')
    .lean();

  res.status(200).json(orders);
});

// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/orders/:id  — Single order details (owner only)
// ═══════════════════════════════════════════════════════════════════════════════
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
    .populate('items.product', 'name slug images category')
    .lean();

  if (!order) {
    res.status(404);
    throw new Error('Order not found or does not belong to you.');
  }

  res.status(200).json(order);
});

// ═══════════════════════════════════════════════════════════════════════════════
// PATCH /api/orders/:id/cancel  — Cancel an order (owner only)
// ═══════════════════════════════════════════════════════════════════════════════
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });

  if (!order) {
    res.status(404);
    throw new Error('Order not found or does not belong to you.');
  }

  // ── Status guard ─────────────────────────────────────────────────────────────
  if (!CANCELLABLE_STATUSES.includes(order.status)) {
    res.status(400);
    throw new Error(
      `Order cannot be cancelled. Current status is "${order.status}". ` +
      `Cancellation is only allowed for orders in: ${CANCELLABLE_STATUSES.join(', ')}.`
    );
  }

  // ── Restore inventory inside a transaction ───────────────────────────────────
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      // Restore inventory for each item
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { inventory: item.quantity } },
          { session }
        );
      }

      // Update order status
      order.status = 'Cancelled';
      if (order.paymentStatus === 'Paid') {
        order.paymentStatus = 'Refunded';
      }
      await order.save({ session });
    });
  } finally {
    await session.endSession();
  }

  res.status(200).json({
    message: 'Order cancelled successfully. Inventory has been restored.',
    orderId: order._id,
    status:  order.status
  });
});
