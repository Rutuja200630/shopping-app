import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required.'],
      index: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required.']
    },
    size: {
      type: String,
      required: [true, 'Size is required.'],
      trim: true
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required.'],
      min: [1, 'Quantity must be at least 1.'],
      default: 1
    }
  },
  {
    timestamps: true
  }
);

// Compound unique index: one cart row per user + product + size combination
cartSchema.index({ user: 1, product: 1, size: 1 }, { unique: true });

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
