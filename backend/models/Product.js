import mongoose from 'mongoose';
import cloudinary from '../config/cloudinary.js';


const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required.'],
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required.'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    description: {
      type: String,
      required: [true, 'Product description is required.']
    },
    brand: {
      type: String,
      required: [true, 'Product brand is required.'],
      default: 'StyleAI',
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Product category is required.'],
      trim: true,
      index: true
    },
    subCategory: {
      type: String,
      required: [true, 'Product subCategory is required.'],
      trim: true
    },
    material: {
      type: String,
      required: [true, 'Product material is required.'],
      trim: true
    },
    fit: {
      type: String,
      required: [true, 'Product fit is required.'],
      trim: true
    },
    gender: {
      type: String,
      required: [true, 'Product gender is required.'],
      enum: {
        values: ['Men', 'Women', 'Unisex'],
        message: 'Gender must be Men, Women, or Unisex.'
      }
    },
    price: {
      type: Number,
      required: [true, 'Product price is required.'],
      min: [0, 'Price must be non-negative.']
    },
    originalPrice: {
      type: Number,
      required: [true, 'Original price is required.'],
      min: [0, 'Original price must be non-negative.']
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount must be at least 0%.'],
      max: [100, 'Discount cannot exceed 100%.']
    },
    images: {
      type: [String],
      required: [true, 'Product images are required.']
    },
    imagePublicIds: {
      type: [String],
      default: []
    },
    sizes: {
      type: [String],
      required: [true, 'Product sizes are required.']
    },
    colors: {
      type: [String],
      default: []
    },
    inventory: {
      type: Number,
      default: 0,
      min: [0, 'Inventory must be non-negative.']
    },
    occasionTags: {
      type: [String],
      required: [true, 'Product occasion tags are required.'],
      index: true
    },
    featured: {
      type: Boolean,
      default: false,
      index: true
    },
    aiRecommended: {
      type: Boolean,
      default: false,
      index: true
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    ratings: {
      type: Number,
      default: 0,
      min: [0, 'Ratings must be at least 0.'],
      max: [5, 'Ratings cannot exceed 5.']
    },
    reviewsCount: {
      type: Number,
      default: 0,
      min: [0, 'Reviews count must be non-negative.']
    }
  },
  {
    timestamps: true
  }
);

// Auto-generate slug from name on validation
productSchema.pre('validate', function (next) {
  if (this.name && (!this.slug || this.isModified('name'))) {
    this.slug = this.name
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')        // Remove all non-word characters except -
      .replace(/\-\-+/g, '-');         // Replace multiple - with single -
  }
  next();
});

// Configure Text Index for Search
productSchema.index({
  name: 'text',
  brand: 'text',
  category: 'text'
}, {
  weights: {
    name: 5,
    brand: 3,
    category: 2
  },
  name: 'ProductSearchIndex'
});

// Pre-delete hook for permanent product deletion to clean up Cloudinary assets
productSchema.pre('findOneAndDelete', async function (next) {
  try {
    const docToQuery = await this.model.findOne(this.getQuery());
    if (docToQuery && docToQuery.imagePublicIds && docToQuery.imagePublicIds.length > 0) {
      for (const publicId of docToQuery.imagePublicIds) {
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }
    }
  } catch (err) {
    console.error('Error cleaning up Cloudinary assets on product delete:', err);
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
