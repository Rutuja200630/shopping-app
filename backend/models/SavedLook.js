import mongoose from 'mongoose';

const minimalProductSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: [true, 'Product ID is required.']
  },
  name: {
    type: String,
    required: [true, 'Product name is required.']
  },
  slug: {
    type: String,
    required: [true, 'Product slug is required.']
  },
  image: {
    type: String
  },
  price: {
    type: Number,
    required: [true, 'Product price is required.']
  },
  brand: {
    type: String
  }
}, { _id: false });

const savedLookSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required.'],
      index: true
    },
    title: {
      type: String,
      required: [true, 'Look title is required.']
    },
    stylistNote: {
      type: String
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required.']
    },
    items: {
      main: {
        type: minimalProductSchema,
        required: [true, 'Main outfit item is required.']
      },
      footwear: {
        type: minimalProductSchema
      },
      accessory: {
        type: minimalProductSchema
      },
      layer: {
        type: minimalProductSchema
      }
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

// Compound index to prevent duplicate saves of the exact same look by same user
savedLookSchema.index({ user: 1, title: 1, 'items.main.productId': 1 }, { unique: true });

const SavedLook = mongoose.model('SavedLook', savedLookSchema);
export default SavedLook;
