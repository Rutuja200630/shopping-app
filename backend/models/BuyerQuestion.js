import mongoose from 'mongoose';

const buyerQuestionSchema = new mongoose.Schema({
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
  question: {
    type: String,
    required: [true, 'Question text is required.'],
    trim: true,
    minlength: [5, 'Question must be at least 5 characters.'],
    maxlength: [500, 'Question cannot exceed 500 characters.']
  },
  answer: {
    type: String,
    trim: true,
    minlength: [5, 'Answer must be at least 5 characters.'],
    maxlength: [1000, 'Answer cannot exceed 1000 characters.']
  },
  answeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isAnswered: {
    type: Boolean,
    default: false
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
  ],
  answeredAt: {
    type: Date
  }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

// Compound index for performance
buyerQuestionSchema.index({ product: 1, createdAt: -1 });

const BuyerQuestion = mongoose.model('BuyerQuestion', buyerQuestionSchema);
export default BuyerQuestion;
