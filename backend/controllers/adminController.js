import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import BuyerQuestion from '../models/BuyerQuestion.js';
import BuyerPhoto from '../models/BuyerPhoto.js';
import Wishlist from '../models/Wishlist.js';
import Cart from '../models/Cart.js';
import SavedLook from '../models/SavedLook.js';
import cloudinary from '../config/cloudinary.js';
import asyncHandler from '../utils/asyncHandler.js';

// ── Chronological Status Transition Verification ──────────────────────────────
const ALLOWED_TRANSITIONS = {
  'Pending': ['Confirmed', 'Cancelled'],
  'Confirmed': ['Packed', 'Cancelled'],
  'Packed': ['Shipped'],
  'Shipped': ['Delivered'],
  'Delivered': [],
  'Cancelled': []
};

// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/admin/dashboard — Dashboard stats summary
// ═══════════════════════════════════════════════════════════════════════════════
export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ status: 'Pending' });
  const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
  const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });
  const activeProducts = await Product.countDocuments({ isActive: true });
  const lowStockProducts = await Product.countDocuments({ inventory: { $lt: 10 } });

  // Telemetry collection counts
  const totalWishlistActivity = await Wishlist.countDocuments();
  const totalCartActivity = await Cart.countDocuments();
  const totalSavedLooks = await SavedLook.countDocuments();
  
  // Count users with structured stylist memory data
  const aiStylistUsage = await User.countDocuments({
    $or: [
      { "fashionMemory.favoriteBrands.0": { $exists: true } },
      { "fashionMemory.favoriteColors.0": { $exists: true } },
      { "fashionMemory.preferredOccasions.0": { $exists: true } }
    ]
  });

  // Calculate Conversion Rate: ordering users / total users (percentage)
  const uniqueOrderingUsers = await Order.distinct('user');
  const conversionRate = totalUsers > 0 
    ? Math.round((uniqueOrderingUsers.length / totalUsers) * 100)
    : 0;

  // Exclude Cancelled orders from revenue summation
  const revenueResult = await Order.aggregate([
    { $match: { status: { $ne: 'Cancelled' } } },
    { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
  ]);
  const totalRevenue = revenueResult[0]?.totalRevenue || 0;

  // Recent Activities
  const latestOrders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(5);

  const latestUsers = await User.find()
    .select('name email role createdAt')
    .sort({ createdAt: -1 })
    .limit(5);

  const latestProducts = await Product.find()
    .sort({ createdAt: -1 })
    .limit(5);

  // Best Selling Products (top products sorted by ratings and reviewsCount)
  const bestSellingProducts = await Product.find()
    .sort({ ratings: -1, reviewsCount: -1 })
    .limit(5)
    .lean();

  // Most Wishlisted Products (aggregated)
  const wishlistedAgg = await Wishlist.aggregate([
    { $group: { _id: '$product', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);
  const mostWishlistedProducts = await Product.populate(wishlistedAgg, {
    path: '_id',
    select: 'name brand price'
  });

  // Most Carted Products (aggregated)
  const cartedAgg = await Cart.aggregate([
    { $group: { _id: '$product', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);
  const mostCartedProducts = await Product.populate(cartedAgg, {
    path: '_id',
    select: 'name brand price'
  });

  // Popular Categories
  const popularCategories = await Product.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);

  // Generate 30-day chronological analytics dates
  const dates = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }

  // 30-day analytics aggregation for orders and revenue
  const orderAgg = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        status: { $ne: 'Cancelled' }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
        revenue: { $sum: "$total" }
      }
    }
  ]);

  // 30-day analytics aggregation for users
  const userAgg = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 }
      }
    }
  ]);

  const ordersMap = new Map(orderAgg.map(item => [item._id, item]));
  const usersMap = new Map(userAgg.map(item => [item._id, item.count]));

  const ordersPerDay = dates.map(date => ({
    date,
    count: ordersMap.get(date)?.count || 0
  }));

  const revenuePerDay = dates.map(date => ({
    date,
    revenue: ordersMap.get(date)?.revenue || 0
  }));

  const usersPerDay = dates.map(date => ({
    date,
    count: usersMap.get(date) || 0
  }));

  res.status(200).json({
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue,
    pendingOrders,
    deliveredOrders,
    cancelledOrders,
    activeProducts,
    lowStockProducts,
    totalWishlistActivity,
    totalCartActivity,
    totalSavedLooks,
    aiStylistUsage,
    conversionRate,
    bestSellingProducts,
    mostWishlistedProducts,
    mostCartedProducts,
    popularCategories,
    latestOrders,
    latestUsers,
    latestProducts,
    ordersPerDay,
    revenuePerDay,
    usersPerDay
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/admin/products — List all products (active & inactive)
// ═══════════════════════════════════════════════════════════════════════════════
export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.status(200).json(products);
});

// ═══════════════════════════════════════════════════════════════════════════════
// POST /api/admin/products — Create a new product
// ═══════════════════════════════════════════════════════════════════════════════
export const createProduct = asyncHandler(async (req, res) => {
  // If multipart form data is used, fields like sizes, colors, occasionTags might be strings.
  if (typeof req.body.sizes === 'string') {
    try { req.body.sizes = JSON.parse(req.body.sizes); } catch { req.body.sizes = req.body.sizes.split(',').map(s => s.trim()).filter(Boolean); }
  }
  if (typeof req.body.colors === 'string') {
    try { req.body.colors = JSON.parse(req.body.colors); } catch { req.body.colors = req.body.colors.split(',').map(s => s.trim()).filter(Boolean); }
  }
  if (typeof req.body.occasionTags === 'string') {
    try { req.body.occasionTags = JSON.parse(req.body.occasionTags); } catch { req.body.occasionTags = req.body.occasionTags.split(',').map(s => s.trim()).filter(Boolean); }
  }
  if (typeof req.body.images === 'string') {
    try { req.body.images = JSON.parse(req.body.images); } catch { req.body.images = req.body.images.split(',').map(s => s.trim()).filter(Boolean); }
  }
  if (typeof req.body.imagePublicIds === 'string') {
    try { req.body.imagePublicIds = JSON.parse(req.body.imagePublicIds); } catch { req.body.imagePublicIds = req.body.imagePublicIds.split(',').map(s => s.trim()).filter(Boolean); }
  }

  if (req.files && req.files.length > 0) {
    const urls = req.files.map(f => f.path);
    const publicIds = req.files.map(f => f.filename);
    req.body.images = urls;
    req.body.imagePublicIds = publicIds;
  }

  const product = await Product.create(req.body);
  res.status(201).json({
    message: 'Product created successfully.',
    product
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// PUT /api/admin/products/:id — Update existing product
// ═══════════════════════════════════════════════════════════════════════════════
export const updateProduct = asyncHandler(async (req, res) => {
  if (typeof req.body.sizes === 'string') {
    try { req.body.sizes = JSON.parse(req.body.sizes); } catch { req.body.sizes = req.body.sizes.split(',').map(s => s.trim()).filter(Boolean); }
  }
  if (typeof req.body.colors === 'string') {
    try { req.body.colors = JSON.parse(req.body.colors); } catch { req.body.colors = req.body.colors.split(',').map(s => s.trim()).filter(Boolean); }
  }
  if (typeof req.body.occasionTags === 'string') {
    try { req.body.occasionTags = JSON.parse(req.body.occasionTags); } catch { req.body.occasionTags = req.body.occasionTags.split(',').map(s => s.trim()).filter(Boolean); }
  }
  if (typeof req.body.images === 'string') {
    try { req.body.images = JSON.parse(req.body.images); } catch { req.body.images = req.body.images.split(',').map(s => s.trim()).filter(Boolean); }
  }
  if (typeof req.body.imagePublicIds === 'string') {
    try { req.body.imagePublicIds = JSON.parse(req.body.imagePublicIds); } catch { req.body.imagePublicIds = req.body.imagePublicIds.split(',').map(s => s.trim()).filter(Boolean); }
  }

  const existingProduct = await Product.findById(req.params.id);
  if (!existingProduct) {
    res.status(404);
    throw new Error('Product not found.');
  }

  if (req.files && req.files.length > 0) {
    const urls = req.files.map(f => f.path);
    const publicIds = req.files.map(f => f.filename);
    req.body.images = urls;
    req.body.imagePublicIds = publicIds;
  }

  // Delete previous Cloudinary assets that are replaced in update
  if (existingProduct.imagePublicIds && existingProduct.imagePublicIds.length > 0) {
    const newPublicIds = req.body.imagePublicIds || [];
    const removedPublicIds = existingProduct.imagePublicIds.filter(id => id && !newPublicIds.includes(id));
    
    for (const pubId of removedPublicIds) {
      try {
        await cloudinary.uploader.destroy(pubId);
      } catch (err) {
        console.error(`Failed to delete replaced Cloudinary asset ${pubId}:`, err);
      }
    }
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    message: 'Product updated successfully.',
    product
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// DELETE /api/admin/products/:id — Soft delete product
// ═══════════════════════════════════════════════════════════════════════════════
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }

  res.status(200).json({
    message: 'Product soft deleted successfully.',
    product
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/admin/orders — List all orders in the system
// ═══════════════════════════════════════════════════════════════════════════════
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.status(200).json(orders);
});

// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/admin/orders/:id — Get a single order details
// ═══════════════════════════════════════════════════════════════════════════════
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found.');
  }

  res.status(200).json(order);
});

// ═══════════════════════════════════════════════════════════════════════════════
// PATCH /api/admin/orders/:id/status — Update order status (with transitions)
// ═══════════════════════════════════════════════════════════════════════════════
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status: nextStatus } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found.');
  }

  const currentStatus = order.status;

  // Validate status transition
  const validTransitions = ALLOWED_TRANSITIONS[currentStatus] || [];
  if (currentStatus !== nextStatus && !validTransitions.includes(nextStatus)) {
    res.status(400);
    throw new Error(
      `Invalid status transition from "${currentStatus}" to "${nextStatus}". ` +
      `Allowed transitions: ${validTransitions.length ? validTransitions.join(', ') : 'None'}`
    );
  }

  // If status is unchanged, just return early
  if (currentStatus === nextStatus) {
    return res.status(200).json({
      message: 'Order status remains unchanged.',
      order
    });
  }

  // Handle Inventory Restoration & DB Updates if transitioning to Cancelled
  if (nextStatus === 'Cancelled') {
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

        // Apply state updates
        order.status = 'Cancelled';
        if (order.paymentStatus === 'Paid') {
          order.paymentStatus = 'Refunded';
        }
        await order.save({ session });
      });
    } finally {
      await session.endSession();
    }
  } else {
    // Standard status update
    order.status = nextStatus;
    
    // Automatically update paymentStatus to 'Paid' when order is delivered
    if (nextStatus === 'Delivered') {
      order.paymentStatus = 'Paid';
    }

    await order.save();
  }

  res.status(200).json({
    message: `Order status updated to ${nextStatus} successfully.`,
    order
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/admin/users — List all users (read-only)
// ═══════════════════════════════════════════════════════════════════════════════
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('name email role createdAt').sort({ createdAt: -1 });
  res.status(200).json(users);
});

// ═══════════════════════════════════════════════════════════════════════════════
// POST /api/admin/upload — Placeholder upload endpoint
// ═══════════════════════════════════════════════════════════════════════════════
export const uploadPlaceholder = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload an image file.');
  }

  res.status(200).json({
    success: true,
    message: 'Image uploaded successfully.',
    url: req.file.path,
    imageUrl: req.file.path,
    publicId: req.file.filename
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// PATCH /api/admin/users/:id/role — Promote/demote user role
// ═══════════════════════════════════════════════════════════════════════════════
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const targetUserId = req.params.id;

  // Validate role
  if (!['user', 'influencer', 'admin'].includes(role)) {
    res.status(400);
    throw new Error('Invalid role. Role must be user, influencer, or admin.');
  }

  // Prevent self-demotion
  if (targetUserId === req.user._id.toString()) {
    res.status(400);
    throw new Error('Action rejected. You cannot demote yourself.');
  }

  const user = await User.findByIdAndUpdate(
    targetUserId,
    { role },
    { new: true, runValidators: true }
  ).select('name email role createdAt');

  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }

  res.status(200).json({
    message: `User role updated to ${role} successfully.`,
    user
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/admin/search — Global admin console search
// ═══════════════════════════════════════════════════════════════════════════════
export const globalSearch = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(200).json({ products: [], orders: [], users: [] });
  }

  const queryReg = new RegExp(q, 'i');

  // Search Products
  const products = await Product.find({
    $or: [
      { name: queryReg },
      { brand: queryReg },
      { category: queryReg }
    ]
  }).limit(10);

  // Search Users
  const users = await User.find({
    $or: [
      { name: queryReg },
      { email: queryReg }
    ]
  }).select('name email role createdAt').limit(10);

  // Search Orders
  let orders = [];
  if (mongoose.Types.ObjectId.isValid(q)) {
    orders = await Order.find({ _id: q })
      .populate('user', 'name email')
      .limit(10);
  } else {
    // Find users matching query first to match by customer name
    const matchingUsers = await User.find({ name: queryReg });
    const userIds = matchingUsers.map(u => u._id);
    orders = await Order.find({
      $or: [
        { user: { $in: userIds } },
        { status: queryReg },
        { "items.productName": queryReg }
      ]
    })
      .populate('user', 'name email')
      .limit(10);
  }

  res.status(200).json({
    products,
    orders,
    users
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// PATCH /api/admin/products/:id/inventory — Isolated inventory update
// ═══════════════════════════════════════════════════════════════════════════════
export const updateProductInventory = asyncHandler(async (req, res) => {
  const { inventory } = req.body;
  const productId = req.params.id;

  // Validate inventory
  if (inventory === undefined || typeof inventory !== 'number' || inventory < 0) {
    res.status(400);
    throw new Error('Inventory count must be a non-negative number.');
  }

  const product = await Product.findByIdAndUpdate(
    productId,
    { inventory },
    { new: true, runValidators: true }
  );

  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }

  res.status(200).json({
    message: `Inventory updated to ${inventory} successfully.`,
    product
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/admin/buyer-connect/content — List all buyer connect content for moderation
// ═══════════════════════════════════════════════════════════════════════════════
export const getAllBuyerConnectContent = asyncHandler(async (req, res) => {
  const questions = await BuyerQuestion.find()
    .populate('product', 'name slug')
    .populate('user', 'name email')
    .populate('answeredBy', 'name email')
    .sort({ createdAt: -1 });

  const photos = await BuyerPhoto.find()
    .populate('product', 'name slug')
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({ questions, photos });
});

// ═══════════════════════════════════════════════════════════════════════════════
// DELETE /api/admin/buyer-connect/questions/:id — Permanently delete question
// ═══════════════════════════════════════════════════════════════════════════════
export const deleteAbusiveQuestion = asyncHandler(async (req, res) => {
  const question = await BuyerQuestion.findByIdAndDelete(req.params.id);
  if (!question) {
    res.status(404);
    throw new Error('Question not found.');
  }
  res.status(200).json({ message: 'Question permanently deleted.' });
});

// ═══════════════════════════════════════════════════════════════════════════════
// DELETE /api/admin/buyer-connect/questions/:id/answer — Permanently clear answer
// ═══════════════════════════════════════════════════════════════════════════════
export const deleteAbusiveAnswer = asyncHandler(async (req, res) => {
  const question = await BuyerQuestion.findById(req.params.id);
  if (!question) {
    res.status(404);
    throw new Error('Question not found.');
  }
  question.answer = undefined;
  question.answeredBy = undefined;
  question.isAnswered = false;
  question.answeredAt = undefined;
  await question.save();

  res.status(200).json({ message: 'Answer permanently cleared.', question });
});

// ═══════════════════════════════════════════════════════════════════════════════
// DELETE /api/admin/buyer-connect/photos/:id — Permanently delete buyer photo
// ═══════════════════════════════════════════════════════════════════════════════
export const deleteAbusivePhoto = asyncHandler(async (req, res) => {
  const photo = await BuyerPhoto.findByIdAndDelete(req.params.id);
  if (!photo) {
    res.status(404);
    throw new Error('Buyer photo not found.');
  }
  res.status(200).json({ message: 'Buyer photo permanently deleted.' });
});
