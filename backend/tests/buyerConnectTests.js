import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import BuyerQuestion from '../models/BuyerQuestion.js';
import BuyerPhoto from '../models/BuyerPhoto.js';

dotenv.config();

const BASE = 'http://localhost:5000/api';

async function run() {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('   StyleAI Phase 4.9 – Buyer Connect API Test Suite');
  console.log('═══════════════════════════════════════════════════════\n');

  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/styleai');
    console.log('✅ Connected to MongoDB directly for seeding.');
  } catch (err) {
    console.error('❌ DB connection failed.', err);
    process.exit(1);
  }

  // ── Seed users ──
  const adminEmail = 'admin_bc@test.com';
  const buyerEmail = 'buyer_bc@test.com';
  const otherUserEmail = 'other_bc@test.com';
  const password = 'testpassword123';

  await User.deleteMany({ email: { $in: [adminEmail, buyerEmail, otherUserEmail] } });

  const adminUser = await User.create({
    name: 'Admin Moderator',
    email: adminEmail,
    password,
    role: 'admin',
    provider: 'local',
    communityScore: 0
  });

  const buyerUser = await User.create({
    name: 'Verified Buyer',
    email: buyerEmail,
    password,
    role: 'user',
    provider: 'local',
    communityScore: 0
  });

  const otherUser = await User.create({
    name: 'Regular User',
    email: otherUserEmail,
    password,
    role: 'user',
    provider: 'local',
    communityScore: 0
  });

  // Seed test product
  const uniqueName = 'Buyer Connect Shirt ' + Date.now();
  const product = await Product.create({
    name: uniqueName,
    description: 'A shirt specifically created to test Buyer Connect.',
    brand: 'StyleAI',
    category: 'Apparel',
    subCategory: 'Shirts',
    material: 'Organic Cotton',
    fit: 'Slim Fit',
    gender: 'Men',
    price: 499,
    originalPrice: 999,
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500'],
    sizes: ['M', 'L'],
    colors: ['Black'],
    inventory: 100,
    occasionTags: ['Casual'],
    slug: 'buyer-connect-test-shirt-' + Date.now()
  });

  // Cleanup past test documents
  await BuyerQuestion.deleteMany({ product: product._id });
  await BuyerPhoto.deleteMany({ product: product._id });
  await Order.deleteMany({ user: { $in: [buyerUser._id, otherUser._id] } });

  // Get Auth Tokens
  async function getToken(email) {
    const loginRes = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const loginData = await loginRes.json();
    return loginData.token;
  }

  const adminToken = await getToken(adminEmail);
  const buyerToken = await getToken(buyerEmail);
  const otherToken = await getToken(otherUserEmail);

  if (!adminToken || !buyerToken || !otherToken) {
    console.error('❌ Failed to authenticate one or more users.');
    process.exit(1);
  }

  console.log('✅ Seeding complete. Users authenticated.');

  let passed = 0;
  let failed = 0;

  function logTest(label, isTrue, detail = '') {
    if (isTrue) {
      console.log(`✅  ${label} — ${detail}`);
      passed++;
    } else {
      console.error(`❌  ${label} — ${detail}`);
      failed++;
    }
  }

  // ── Test 1: Ask a question (Regular user, +1 point) ──
  let res = await fetch(`${BASE}/buyer-connect/${product.slug}/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${otherToken}`
    },
    body: JSON.stringify({ question: 'Is this shirt shrink-resistant after a wash?' })
  });
  let questionData = await res.json();
  logTest('Regular user asks question (201)', res.status === 201, `status: ${res.status}, id: ${questionData._id}`);

  // Verify regular user score is now 1
  let updatedOtherUser = await User.findById(otherUser._id);
  logTest('Regular user received +1 community point', updatedOtherUser.communityScore === 1, `communityScore: ${updatedOtherUser.communityScore}`);

  // ── Test 2: Try answering as non-buyer (should fail with 403) ──
  res = await fetch(`${BASE}/buyer-connect/questions/${questionData._id}/answer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${buyerToken}`
    },
    body: JSON.stringify({ answer: 'Yes, it is pre-shrunk cotton!' })
  });
  let answerErr = await res.json();
  logTest('Answering as non-buyer fails (403)', res.status === 403, `status: ${res.status}, error: ${answerErr.error}`);

  // ── Test 3: Seed Shipped/Pending order for buyer (should still fail with 403) ──
  const shippedOrder = await Order.create({
    user: buyerUser._id,
    items: [{
      product: product._id,
      productName: product.name,
      productImage: product.images[0],
      size: 'M',
      quantity: 1,
      priceSnapshot: product.price
    }],
    subtotal: product.price,
    discount: 0,
    shipping: 0,
    total: product.price,
    addressSnapshot: { street: '123 St', city: 'Mumbai', state: 'MH', zipCode: '400001', phone: '9876543210' },
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    status: 'Shipped' // NOT Delivered
  });

  res = await fetch(`${BASE}/buyer-connect/questions/${questionData._id}/answer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${buyerToken}`
    },
    body: JSON.stringify({ answer: 'Yes, it is pre-shrunk cotton!' })
  });
  answerErr = await res.json();
  logTest('Answering with Shipped status order fails (403)', res.status === 403, `status: ${res.status}, error: ${answerErr.error}`);

  // Change status to Delivered
  shippedOrder.status = 'Delivered';
  await shippedOrder.save();
  console.log('✅ Promoted order status to Delivered.');

  // ── Test 4: Answer as Verified Buyer (should succeed with 200, +5 points) ──
  res = await fetch(`${BASE}/buyer-connect/questions/${questionData._id}/answer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${buyerToken}`
    },
    body: JSON.stringify({ answer: 'Yes, it is pre-shrunk cotton and fits great!' })
  });
  let answerData = await res.json();
  logTest('Verified buyer answers question (200)', res.status === 200, `status: ${res.status}, answererVerified: ${answerData.isAnswererVerified}`);

  let updatedBuyerUser = await User.findById(buyerUser._id);
  logTest('Buyer user received +5 community points', updatedBuyerUser.communityScore === 5, `communityScore: ${updatedBuyerUser.communityScore}`);

  // ── Test 5: Helpful vote (Buyer votes helpful on Regular user\'s question, +2 points to Regular user) ──
  res = await fetch(`${BASE}/buyer-connect/questions/${questionData._id}/helpful`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${buyerToken}`
    }
  });
  let voteData = await res.json();
  logTest('Buyer votes helpful on question (200)', res.status === 200, `status: ${res.status}, votes: ${voteData.helpfulVotes}`);

  updatedOtherUser = await User.findById(otherUser._id);
  logTest('Regular user received +2 points (score = 3)', updatedOtherUser.communityScore === 3, `communityScore: ${updatedOtherUser.communityScore}`);

  // ── Test 6: Double vote prevention (should fail with 400) ──
  res = await fetch(`${BASE}/buyer-connect/questions/${questionData._id}/helpful`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${buyerToken}`
    }
  });
  let doubleVoteErr = await res.json();
  logTest('Double voting on question fails (400)', res.status === 400, `status: ${res.status}, error: ${doubleVoteErr.error}`);

  // ── Test 7: Upload photo by non-buyer (should fail with 403) ──
  res = await fetch(`${BASE}/buyer-connect/${product.slug}/photos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${otherToken}`
    },
    body: JSON.stringify({
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
      caption: 'Regular user check.'
    })
  });
  let photoErr = await res.json();
  logTest('Uploading photo by non-buyer fails (403)', res.status === 403, `status: ${res.status}, error: ${photoErr.error}`);

  // ── Test 8: Upload photo by Verified Buyer (should succeed with 201, +10 points) ──
  res = await fetch(`${BASE}/buyer-connect/${product.slug}/photos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${buyerToken}`
    },
    body: JSON.stringify({
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
      caption: 'Look at this fit!'
    })
  });
  let photoData = await res.json();
  logTest('Verified buyer uploads photo (201)', res.status === 201, `status: ${res.status}, id: ${photoData._id}`);

  updatedBuyerUser = await User.findById(buyerUser._id);
  logTest('Buyer user received +10 community points (score = 15)', updatedBuyerUser.communityScore === 15, `communityScore: ${updatedBuyerUser.communityScore}`);

  // ── Test 9: Profile contributions calculation and stats ──
  res = await fetch(`${BASE}/buyer-connect/profile/contributions`, {
    headers: { 'Authorization': `Bearer ${buyerToken}` }
  });
  let profileData = await res.json();
  logTest('Verified Purchases count calculation matches distinct items', profileData.verifiedPurchases === 1, `verifiedPurchases: ${profileData.verifiedPurchases}`);
  logTest('Profile displays buyer communityScore', profileData.communityScore === 15, `communityScore: ${profileData.communityScore}`);

  res = await fetch(`${BASE}/buyer-connect/${product.slug}/stats`);
  let statsData = await res.json();
  logTest('Product stats: questionsCount is 1', statsData.questionsCount === 1, `questionsCount: ${statsData.questionsCount}`);
  logTest('Product stats: verifiedAnswersCount is 1', statsData.verifiedAnswersCount === 1, `verifiedAnswersCount: ${statsData.verifiedAnswersCount}`);
  logTest('Product stats: photosCount is 1', statsData.photosCount === 1, `photosCount: ${statsData.photosCount}`);

  // ── Test 10: Admin Moderation content fetch ──
  res = await fetch(`${BASE}/admin/buyer-connect/content`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  let adminData = await res.json();
  logTest('Admin retrieves all moderation content (200)', res.status === 200, `questions: ${adminData.questions?.length}, photos: ${adminData.photos?.length}`);

  // ── Test 11: Admin clears answer permanently ──
  res = await fetch(`${BASE}/admin/buyer-connect/questions/${questionData._id}/answer`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  logTest('Admin clears abusive answer (200)', res.status === 200, `status: ${res.status}`);
  let checkClearedQuestion = await BuyerQuestion.findById(questionData._id);
  logTest('Answer field is cleared in database', checkClearedQuestion.answer === undefined && checkClearedQuestion.isAnswered === false, `answer: ${checkClearedQuestion.answer}`);

  // ── Test 12: Admin deletes question permanently ──
  res = await fetch(`${BASE}/admin/buyer-connect/questions/${questionData._id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  logTest('Admin deletes abusive question (200)', res.status === 200, `status: ${res.status}`);
  let checkDeletedQuestion = await BuyerQuestion.findById(questionData._id);
  logTest('Question is deleted from database', checkDeletedQuestion === null, `question: ${checkDeletedQuestion}`);

  // ── Test 13: Admin deletes photo permanently ──
  res = await fetch(`${BASE}/admin/buyer-connect/photos/${photoData._id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  logTest('Admin deletes abusive photo (200)', res.status === 200, `status: ${res.status}`);
  let checkDeletedPhoto = await BuyerPhoto.findById(photoData._id);
  logTest('Photo is deleted from database', checkDeletedPhoto === null, `photo: ${checkDeletedPhoto}`);

  // ── Cleanup ──
  await BuyerQuestion.deleteMany({ product: product._id });
  await BuyerPhoto.deleteMany({ product: product._id });
  await Order.deleteOne({ _id: shippedOrder._id });
  await Product.deleteOne({ _id: product._id });
  await User.deleteMany({ email: { $in: [adminEmail, buyerEmail, otherUserEmail] } });
  await mongoose.disconnect();
  console.log('✅ Cleanup complete. DB connection closed.');

  console.log('\n═══════════════════════════════════════════════════════');
  console.log(`   Results: ${passed} passed, ${failed} failed`);
  console.log('═══════════════════════════════════════════════════════\n');
  
  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

run();
