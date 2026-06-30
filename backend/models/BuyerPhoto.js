import mongoose from 'mongoose';
import cloudinary from '../config/cloudinary.js';


const buyerPhotoSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product reference is required.'],
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required.']
  },
  imageUrl: {
    type: String,
    required: [true, 'Photo image URL is required.'],
    trim: true
  },
  publicId: {
    type: String,
    required: [true, 'Cloudinary public ID is required.'],
    trim: true
  },
  caption: {
    type: String,
    trim: true,
    maxlength: [300, 'Caption cannot exceed 300 characters.']
  },
  helpfulVotes: {
    type: Number,
    default: 0
  },
  helpfulVoters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

// Compound index for performance
buyerPhotoSchema.index({ product: 1, createdAt: -1 });

// Pre-delete hook to automatically delete Cloudinary asset
buyerPhotoSchema.pre('findOneAndDelete', async function (next) {
  try {
    const docToQuery = await this.model.findOne(this.getQuery());
    if (docToQuery && docToQuery.publicId) {
      await cloudinary.uploader.destroy(docToQuery.publicId);
    }
  } catch (err) {
    console.error('Error cleaning up Cloudinary asset on buyer photo delete:', err);
  }
  next();
});

const BuyerPhoto = mongoose.model('BuyerPhoto', buyerPhotoSchema);
export default BuyerPhoto;
