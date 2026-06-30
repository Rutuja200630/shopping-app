import BuyerQuestion from '../models/BuyerQuestion.js';
import BuyerPhoto from '../models/BuyerPhoto.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

// Helper: check if user is a verified buyer of a product ID
const checkVerification = async (userId, productId) => {
  const isVerified = await Order.exists({
    user: userId,
    status: 'Delivered',
    'items.product': productId
  });
  return !!isVerified;
};

// Helper: update user community score
const adjustUserScore = async (userId, points) => {
  await User.findByIdAndUpdate(userId, { $inc: { communityScore: points } });
};

// ── GET QUESTIONS ─────────────────────────────────────────────────────────────
// GET /api/buyer-connect/:slug/questions
export const getQuestions = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const product = await Product.findOne({ slug });
  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }

  const questions = await BuyerQuestion.find({ product: product._id })
    .populate('user', 'name avatar role communityScore')
    .populate('answeredBy', 'name avatar role communityScore')
    .sort({ createdAt: -1 })
    .lean();

  // Dynamically attach verified buyer state for the answers
  const questionsWithVerification = await Promise.all(
    questions.map(async (q) => {
      let isVerified = false;
      if (q.isAnswered && q.answeredBy) {
        isVerified = await checkVerification(q.answeredBy._id, product._id);
      }
      return {
        ...q,
        isAnswererVerified: isVerified
      };
    })
  );

  res.status(200).json(questionsWithVerification);
});

// ── ASK QUESTION ──────────────────────────────────────────────────────────────
// POST /api/buyer-connect/:slug/questions
export const askQuestion = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { question } = req.body;

  if (!question || question.trim().length < 5 || question.trim().length > 500) {
    res.status(400);
    throw new Error('Question must be between 5 and 500 characters.');
  }

  const product = await Product.findOne({ slug });
  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }

  const newQuestion = await BuyerQuestion.create({
    product: product._id,
    user: req.user._id,
    question: question.trim()
  });

  // Reward 1 point
  await adjustUserScore(req.user._id, 1);

  const populated = await BuyerQuestion.findById(newQuestion._id)
    .populate('user', 'name avatar role communityScore')
    .lean();

  res.status(201).json(populated);
});

// ── ANSWER QUESTION ───────────────────────────────────────────────────────────
// POST /api/buyer-connect/questions/:id/answer
export const answerQuestion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { answer } = req.body;

  if (!answer || answer.trim().length < 5 || answer.trim().length > 1000) {
    res.status(400);
    throw new Error('Answer must be between 5 and 1000 characters.');
  }

  const question = await BuyerQuestion.findById(id);
  if (!question) {
    res.status(404);
    throw new Error('Question not found.');
  }

  // Check if current user has delivered order with this product
  const isVerified = await checkVerification(req.user._id, question.product);
  if (!isVerified) {
    res.status(403);
    throw new Error('Only verified buyers of this product are allowed to answer questions.');
  }

  question.answer = answer.trim();
  question.answeredBy = req.user._id;
  question.isAnswered = true;
  question.answeredAt = new Date();
  await question.save();

  // Reward 5 points
  await adjustUserScore(req.user._id, 5);

  const populated = await BuyerQuestion.findById(question._id)
    .populate('user', 'name avatar role communityScore')
    .populate('answeredBy', 'name avatar role communityScore')
    .lean();

  res.status(200).json({
    ...populated,
    isAnswererVerified: true
  });
});

// ── VOTE QUESTION HELPFUL ─────────────────────────────────────────────────────
// POST /api/buyer-connect/questions/:id/helpful
export const voteQuestionHelpful = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const question = await BuyerQuestion.findById(id);
  if (!question) {
    res.status(404);
    throw new Error('Question not found.');
  }

  const hasVoted = question.helpfulVoters.some(voterId => voterId.toString() === userId.toString());
  if (hasVoted) {
    res.status(400);
    throw new Error('You have already marked this question as helpful.');
  }

  question.helpfulVoters.push(userId);
  question.helpfulVotes += 1;
  await question.save();

  // Reward question owner with +2 points (if owner is a user and different from voter)
  if (question.user && question.user.toString() !== userId.toString()) {
    await adjustUserScore(question.user, 2);
  }

  res.status(200).json({
    message: 'Vote registered.',
    helpfulVotes: question.helpfulVotes
  });
});

// ── GET BUYER PHOTOS ──────────────────────────────────────────────────────────
// GET /api/buyer-connect/:slug/photos
export const getPhotos = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const product = await Product.findOne({ slug });
  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }

  const photos = await BuyerPhoto.find({ product: product._id })
    .populate('user', 'name avatar role communityScore')
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json(photos);
});

// ── UPLOAD BUYER PHOTO ────────────────────────────────────────────────────────
// POST /api/buyer-connect/:slug/photos
export const uploadPhoto = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { caption } = req.body;
  
  let imageUrl = req.body.imageUrl;
  let publicId = req.body.publicId || 'mock-id';

  if (req.file) {
    imageUrl = req.file.path; // Cloudinary secure_url
    publicId = req.file.filename; // Cloudinary public_id
  }

  if (!imageUrl) {
    res.status(400);
    throw new Error('Photo file upload or image URL is required.');
  }

  if (caption && caption.length > 300) {
    res.status(400);
    throw new Error('Caption cannot exceed 300 characters.');
  }

  const product = await Product.findOne({ slug });
  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }

  // Check if current user is verified buyer
  const isVerified = await checkVerification(req.user._id, product._id);
  if (!isVerified) {
    res.status(403);
    throw new Error('Only verified buyers of this product are allowed to upload wear photos.');
  }

  const photo = await BuyerPhoto.create({
    product: product._id,
    user: req.user._id,
    imageUrl,
    publicId,
    caption: caption ? caption.trim() : ''
  });

  // Reward 10 points
  await adjustUserScore(req.user._id, 10);

  const populated = await BuyerPhoto.findById(photo._id)
    .populate('user', 'name avatar role communityScore')
    .lean();

  res.status(201).json(populated);
});

// ── VOTE PHOTO HELPFUL ────────────────────────────────────────────────────────
// POST /api/buyer-connect/photos/:id/helpful
export const votePhotoHelpful = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const photo = await BuyerPhoto.findById(id);
  if (!photo) {
    res.status(404);
    throw new Error('Buyer photo not found.');
  }

  const hasVoted = photo.helpfulVoters.some(voterId => voterId.toString() === userId.toString());
  if (hasVoted) {
    res.status(400);
    throw new Error('You have already marked this photo as helpful.');
  }

  photo.helpfulVoters.push(userId);
  photo.helpfulVotes += 1;
  await photo.save();

  // Reward photo owner with +2 points
  if (photo.user && photo.user.toString() !== userId.toString()) {
    await adjustUserScore(photo.user, 2);
  }

  res.status(200).json({
    message: 'Vote registered.',
    helpfulVotes: photo.helpfulVotes
  });
});

// ── GET USER CONTRIBUTIONS ────────────────────────────────────────────────────
// GET /api/buyer-connect/contributions
export const getMyContributions = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const questions = await BuyerQuestion.find({ user: userId })
    .populate('product', 'name slug images')
    .sort({ createdAt: -1 })
    .lean();

  const answers = await BuyerQuestion.find({ answeredBy: userId })
    .populate('product', 'name slug images')
    .sort({ answeredAt: -1 })
    .lean();

  const photos = await BuyerPhoto.find({ user: userId })
    .populate('product', 'name slug images')
    .sort({ createdAt: -1 })
    .lean();

  const user = await User.findById(userId).select('communityScore').lean();
  const communityScore = user?.communityScore || 0;

  // Calculate unique products purchased in Delivered orders
  const uniqueProducts = await Order.distinct('items.product', {
    user: userId,
    status: 'Delivered'
  });
  const verifiedPurchases = uniqueProducts.length;

  res.status(200).json({
    questions,
    answers,
    photos,
    communityScore,
    verifiedPurchases
  });
});

// ── GET STATS ─────────────────────────────────────────────────────────────────
// GET /api/buyer-connect/:slug/stats
export const getStats = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const product = await Product.findOne({ slug });
  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }

  const questionsCount = await BuyerQuestion.countDocuments({ product: product._id });
  const verifiedAnswersCount = await BuyerQuestion.countDocuments({ product: product._id, isAnswered: true });
  const photosCount = await BuyerPhoto.countDocuments({ product: product._id });

  res.status(200).json({
    questionsCount,
    verifiedAnswersCount,
    photosCount
  });
});
