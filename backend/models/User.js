import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const preferenceItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  score: { type: Number, default: 1 },
  updatedAt: { type: Date, default: Date.now }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    required: function() {
      return this.provider === 'local';
    }
  },
  avatar: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' }
  },
  provider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  googleId: {
    type: String,
    index: true
  },
  role: {
    type: String,
    enum: ['user', 'influencer', 'admin'],
    default: 'user'
  },
  communityScore: {
    type: Number,
    default: 0
  },
  preferences: {
    gender: {
      type: String,
      enum: ['Men', 'Women', 'Unisex', 'None'],
      default: 'None'
    },
    favoriteOccasions: [{ type: String }],
    favoriteColors: [{ type: String }],
    favoriteStyles: [{ type: String }]
  },
  fashionMemory: {
    favoriteBrands: [preferenceItemSchema],
    dislikedBrands: [preferenceItemSchema],
    favoriteColors: [preferenceItemSchema],
    dislikedColors: [preferenceItemSchema],
    preferredOccasions: [preferenceItemSchema],
    preferredStyles: [preferenceItemSchema],
    preferredFootwear: [preferenceItemSchema],
    preferredAccessories: [preferenceItemSchema],
    minimumBudget: { type: Number, default: 0 },
    maximumBudget: { type: Number, default: 1000000 }
  }
}, { timestamps: true });

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  if (!this.password || !this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
