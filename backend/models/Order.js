import mongoose from 'mongoose';

// ── Item Snapshot Sub-Schema ───────────────────────────────────────────────────
// Prices and product details are snapshotted at checkout time so that
// future product edits do NOT alter historical order records.
const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    productName: {
      type: String,
      required: true,
      trim: true
    },
    productImage: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1.']
    },
    priceSnapshot: {
      type: Number,
      required: true,
      min: [0, 'Price snapshot must be non-negative.']
    }
  },
  { _id: true }
);

// ── Address Snapshot Sub-Schema ───────────────────────────────────────────────
// Snapshotted so address edits after placement don't affect the order.
// Field names match the Address model (street / zipCode).
const addressSnapshotSchema = new mongoose.Schema(
  {
    label:    { type: String, default: 'Home' },
    street:   { type: String, required: true },
    city:     { type: String, required: true },
    state:    { type: String, required: true },
    zipCode:  { type: String, required: true },
    phone:    { type: String, required: true },
    country:  { type: String, default: 'India' }
  },
  { _id: false }
);

// ── Order Schema ──────────────────────────────────────────────────────────────
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required.'],
      index: true
    },

    items: {
      type: [orderItemSchema],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'Order must contain at least one item.'
      }
    },

    addressSnapshot: {
      type: addressSnapshotSchema,
      required: [true, 'Delivery address snapshot is required.']
    },

    // ── Pricing ───────────────────────────────────────────────────────────────
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal must be non-negative.']
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount must be non-negative.']
    },
    shipping: {
      type: Number,
      default: 0,
      min: [0, 'Shipping fee must be non-negative.']
    },
    total: {
      type: Number,
      required: true,
      min: [0, 'Total must be non-negative.']
    },

    // ── Status ────────────────────────────────────────────────────────────────
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'],
        message: 'Invalid order status: {VALUE}.'
      },
      default: 'Pending',
      index: true
    },

    // ── Payment ───────────────────────────────────────────────────────────────
    paymentMethod: {
      type: String,
      enum: {
        values: ['COD', 'UPI', 'Card', 'NetBanking', 'Wallet'],
        message: 'Invalid payment method: {VALUE}.'
      },
      required: [true, 'Payment method is required.']
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['Pending', 'Paid', 'Failed', 'Refunded'],
        message: 'Invalid payment status: {VALUE}.'
      },
      default: 'Pending'
    }
  },
  {
    timestamps: true
  }
);

// ── Compound index for common query pattern: user's orders sorted by date ─────
orderSchema.index({ user: 1, createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;
