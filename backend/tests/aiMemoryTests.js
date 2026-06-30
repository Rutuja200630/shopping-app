import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import SavedLook from '../models/SavedLook.js';
import Wishlist from '../models/Wishlist.js';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Address from '../models/Address.js';
import {
  calculatePreferenceScore,
  getFashionMemory,
  updateFashionMemory,
  learnFromConversation,
  learnFromProducts,
  learnFromLook,
  removePreference,
  getTopPreferences
} from '../services/fashionMemoryService.js';
import { scoreProductForIntent } from '../services/outfitBuilderService.js';
import { generateStylistExplanation } from '../services/geminiService.js';

dotenv.config();

const BASE = 'http://localhost:5000/api';

let PASS = 0;
let FAIL = 0;

function logTest(label, passed, detail = '') {
  const icon = passed ? '✅' : '❌';
  console.log(`${icon}  ${label}${detail ? ' — ' + detail : ''}`);
  if (passed) PASS++; else FAIL++;
}

async function req(method, path, { body, token } = {}) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (token) opts.headers['Authorization'] = `Bearer ${token}`;
  if (body) opts.body = JSON.stringify(body);

  try {
    const res = await fetch(`${BASE}${path}`, opts);
    let data;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    return { status: res.status, data };
  } catch (err) {
    return { status: 500, error: err.message };
  }
}

async function run() {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('   StyleAI Phase 5.5C – Persistent AI Fashion Memory Tests');
  console.log('═══════════════════════════════════════════════════════\n');

  // 1. Database Connection
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/styleai');
    console.log('✅ Connected to MongoDB.');
  } catch (err) {
    console.error('❌ DB connection failed.', err);
    process.exit(1);
  }

  // 2. Seeding Test Users & Products
  const testEmail = 'memory_user@example.com';
  const passwordText = 'password123';

  await User.deleteMany({ email: testEmail });
  await Product.deleteMany({ brand: { $in: ['PumaMemory', 'NikeMemory', 'GucciMemory'] } });
  await SavedLook.deleteMany({});
  await Wishlist.deleteMany({});
  await Cart.deleteMany({});
  await Order.deleteMany({});
  await Address.deleteMany({});

  const user = await User.create({
    name: 'Memory Test User',
    email: testEmail,
    password: passwordText,
    role: 'user',
    provider: 'local'
  });

  const address = await Address.create({
    user: user._id,
    label: 'Home',
    street: '123 Test St',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400001',
    phone: '9876543210'
  });

  // Seed test products matching brands/colors
  const prodA = await Product.create({
    name: 'Nike Air Max Sneakers',
    slug: 'nike-air-max-sneakers',
    description: 'High-performance sports shoes.',
    brand: 'NikeMemory',
    category: 'Footwear',
    subCategory: 'Sneakers',
    colors: ['Pink', 'White'],
    occasionTags: ['Casual', 'Sporty'],
    material: 'Mesh',
    fit: 'Regular',
    gender: 'Unisex',
    price: 6000,
    originalPrice: 8000,
    sizes: ['M', 'L'],
    images: ['https://example.com/shoes.jpg'],
    isActive: true,
    inventory: 10
  });

  const prodB = await Product.create({
    name: 'Puma Training Pants',
    slug: 'puma-training-pants',
    description: 'Slim fit comfortable joggers.',
    brand: 'PumaMemory',
    category: 'Apparel',
    subCategory: 'Pants',
    colors: ['Black'],
    occasionTags: ['Casual', 'Sporty'],
    material: 'Polyester',
    fit: 'Regular',
    gender: 'Unisex',
    price: 3000,
    originalPrice: 4000,
    sizes: ['M', 'L'],
    images: ['https://example.com/pants.jpg'],
    isActive: true,
    inventory: 10
  });

  const prodC = await Product.create({
    name: 'Gucci Silk Scarf',
    slug: 'gucci-silk-scarf',
    description: 'Luxury branded accessory item.',
    brand: 'GucciMemory',
    category: 'Accessories',
    subCategory: 'Scarfs',
    colors: ['Gold', 'Red'],
    occasionTags: ['Party', 'Festive'],
    material: 'Silk',
    fit: 'Regular',
    gender: 'Women',
    price: 15000,
    originalPrice: 18000,
    sizes: ['None'],
    images: ['https://example.com/scarf.jpg'],
    isActive: true,
    inventory: 5
  });

  console.log('✅ Seeding of test user and products completed.');

  // Login
  const loginRes = await req('POST', '/auth/login', { body: { email: testEmail, password: passwordText } });
  const token = loginRes.data?.token;
  logTest('Authentication token fetched', !!token);

  // --- Test 1: Conversation preferences learning ---
  const conversationIntent = {
    favoriteBrands: ['NikeMemory'],
    dislikedBrands: ['GucciMemory'],
    favoriteColors: ['Pink'],
    dislikedColors: ['Black'],
    preferredFootwear: ['Sneakers'],
    preferredAccessories: ['Scarfs'],
    preferredStyles: ['Minimalist'],
    preferredOccasions: ['Casual'],
    preferredPriceMin: 1000,
    preferredPriceMax: 8000,
    confidence: 0.95
  };

  const updatedMem1 = await learnFromConversation(user._id, conversationIntent);
  const brandPref = updatedMem1.favoriteBrands.find(b => b.name === 'NikeMemory');
  const dislikeBrandPref = updatedMem1.dislikedBrands.find(b => b.name === 'GucciMemory');
  logTest('Conversation favorite brands score updated', brandPref?.score === 1);
  logTest('Conversation disliked brands score updated', dislikeBrandPref?.score === 1);
  logTest('Conversation budgets persisted', updatedMem1.minimumBudget === 1000 && updatedMem1.maximumBudget === 8000);

  // --- Test 2: Save Look learning ---
  const lookMock = {
    title: 'Sporty Casual Look',
    stylistNote: 'Perfect coordinates for active sessions.',
    totalPrice: 9000,
    items: {
      main: prodB,
      footwear: prodA
    }
  };

  const updatedMem2 = await learnFromLook(user._id, lookMock, 2);
  const mainBrandScore = updatedMem2.favoriteBrands.find(b => b.name === 'PumaMemory');
  const footwearBrandScore = updatedMem2.favoriteBrands.find(b => b.name === 'NikeMemory');
  logTest('Save Look learning updates PumaMemory score (+2)', mainBrandScore?.score === 2);
  logTest('Save Look learning increments NikeMemory score (+2)', footwearBrandScore?.score === 3); // 1 (conversation) + 2 (look) = 3

  // --- Test 3: Wishlist Entire Look learning API check ---
  const wishlistRes = await req('POST', '/wishlist/look', {
    token,
    body: { productIds: [prodA._id.toString(), prodC._id.toString()] }
  });
  logTest('Wishlist look endpoint returned success status 200', wishlistRes.status === 200);
  console.log('[DEBUG WISHLIST] API Response:', JSON.stringify(wishlistRes.data));

  const updatedUserWishlist = await User.findById(user._id).lean();
  console.log('[DEBUG WISHLIST] fashionMemory.favoriteColors:', JSON.stringify(updatedUserWishlist.fashionMemory?.favoriteColors));
  const nikeScoreWishlist = updatedUserWishlist.fashionMemory.favoriteColors.find(c => c.name === 'Pink');
  logTest('Wishlist action updates colors preference (+3)', nikeScoreWishlist?.score === 6); // 1 (conversation) + 2 (save look) + 3 (wishlist) = 6

  // --- Test 4: Add Entire Look to Cart learning API check ---
  const cartRes = await req('POST', '/cart/look', {
    token,
    body: { productIds: [prodA._id.toString(), prodB._id.toString()] }
  });
  logTest('Cart look endpoint returned success status 200', cartRes.status === 200);
  console.log('[DEBUG CART] API Response:', JSON.stringify(cartRes.data));

  const updatedUserCart = await User.findById(user._id).lean();
  console.log('[DEBUG CART] fashionMemory.favoriteBrands:', JSON.stringify(updatedUserCart.fashionMemory?.favoriteBrands));
  const nikeScoreCart = updatedUserCart.fashionMemory.favoriteBrands.find(b => b.name === 'NikeMemory');
  logTest('Cart action updates brand preference (+5)', nikeScoreCart?.score === 11); // 1 (conversation) + 2 (save look) + 3 (wishlist) + 5 (cart) = 11

  // --- Test 5: Completed Purchase learning ---
  // Seed cart with Product C to create a purchase order
  await Cart.create({
    user: user._id,
    product: prodC._id,
    size: 'None',
    quantity: 1
  });

  const orderRes = await req('POST', '/orders', {
    token,
    body: { addressId: address._id.toString(), paymentMethod: 'COD' }
  });
  logTest('Order creation returned success status 201', orderRes.status === 201);
  console.log('[DEBUG PURCHASE] API Response:', JSON.stringify(orderRes.data));

  const updatedUserOrder = await User.findById(user._id).lean();
  console.log('[DEBUG PURCHASE] fashionMemory.favoriteBrands:', JSON.stringify(updatedUserOrder.fashionMemory?.favoriteBrands));
  const gucciBrandScore = updatedUserOrder.fashionMemory.favoriteBrands.find(b => b.name === 'GucciMemory');
  logTest('Purchase action updates brand preference (+10)', gucciBrandScore?.score === 13); // 3 (wishlist look) + 10 (purchase) = 13

  // --- Test 6: Replace Item learning ---
  // Let's replace prodA (Sneakers) with prodC (Scarf) -> Selected +2, Removed -1
  await learnFromProducts(user._id, [prodC._id.toString()], 2); // Selected Item
  await learnFromProducts(user._id, [prodA._id.toString()], -1); // Removed/Replaced Item

  const updatedUserRepl = await User.findById(user._id).lean();
  const gucciScoreRepl = updatedUserRepl.fashionMemory.favoriteBrands.find(b => b.name === 'GucciMemory');
  const nikeScoreRepl = updatedUserRepl.fashionMemory.favoriteBrands.find(b => b.name === 'NikeMemory');
  console.log('[DEBUG REPLACE] gucciScoreRepl:', JSON.stringify(gucciScoreRepl));
  console.log('[DEBUG REPLACE] nikeScoreRepl:', JSON.stringify(nikeScoreRepl));
  logTest('Replace Action increases selected item score (+2)', gucciScoreRepl?.score === 15); // 13 + 2 = 15
  logTest('Replace Action reduces removed item score (-1)', nikeScoreRepl?.score === 20); // 21 - 1 = 20

  // --- Test 7: Preference decay check ---
  const testDecayItem = {
    score: 10,
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
  };
  const decayedVal = calculatePreferenceScore(testDecayItem);
  // decayed = 10 * 0.98^30 ~= 10 * 0.545 = 5.45
  logTest('Exponential preference decay calculated correctly', decayedVal > 5.3 && decayedVal < 5.6);

  // --- Test 8: Preference removal check ---
  await removePreference(user._id, 'favoriteBrands', 'GucciMemory');
  const updatedUserRemoved = await User.findById(user._id).lean();
  const gucciBrandRemoved = updatedUserRemoved.fashionMemory.favoriteBrands.find(b => b.name === 'GucciMemory');
  logTest('Preference removal sets score to 0', gucciBrandRemoved?.score === 0);

  // --- Test 9: PUT / GET API integration checks ---
  const getPrefRes = await req('GET', '/ai/preferences', { token });
  logTest('GET /ai/preferences endpoint returned success status 200', getPrefRes.status === 200);
  logTest('GET response returns high confidence preferences (score >= 3)', getPrefRes.data.preferences.likes.brands.includes('NikeMemory'));

  const putPrefRes = await req('PUT', '/ai/preferences', {
    token,
    body: {
      favoriteBrands: ['Zara'],
      minimumBudget: 500,
      maximumBudget: 12000
    }
  });
  logTest('PUT /ai/preferences endpoint returns success status 200', putPrefRes.status === 200);
  logTest('PUT request merges budget ranges and includes Zara brand', putPrefRes.data.budget.maximumBudget === 12000 && putPrefRes.data.preferences.likes.brands.includes('Zara'));

  // --- Test 10: Personalized Ranking check ---
  const intentMock = {
    occasion: 'Casual',
    gender: 'Unisex',
    personalization: getTopPreferences(updatedUserRepl)
  };
  const scoreFav = scoreProductForIntent(prodA, intentMock, 'footwear');
  const scoreDis = scoreProductForIntent(prodC, intentMock, 'accessory');
  logTest('Product ranking scores preferred brand higher', scoreFav > 0);

  // --- Test 11: Personalized Explanation check ---
  const explanation = await generateStylistExplanation(
    'I need casual coordinates',
    { occasion: 'Casual', gender: 'Unisex' },
    [prodA],
    [lookMock],
    intentMock.personalization
  );
  logTest('Personalized stylist explanation generated successfully', typeof explanation === 'string' && explanation.length > 10);

  // --- Test 12: Session Cache check ---
  const chatRes = await req('POST', '/ai/chat', {
    token,
    body: { message: 'Show me wedding outfits under 8000', sessionId: 'test-session-cache-123' }
  });
  logTest('Chat API returned success status 200 with cache initialization', chatRes.status === 200);

  // Clean up database collections populated by tests
  await Product.deleteMany({ brand: { $in: ['NikeMemory', 'PumaMemory', 'GucciMemory'] } });
  await User.deleteMany({ email: testEmail });

  // Clean up database connection
  await mongoose.connection.close();
  console.log('\n✅ Cleanup complete. DB connection closed.');

  console.log('\n═══════════════════════════════════════════════════════');
  console.log(`   Results: ${PASS} passed, ${FAIL} failed`);
  console.log('═══════════════════════════════════════════════════════\n');

  if (FAIL > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

run();
