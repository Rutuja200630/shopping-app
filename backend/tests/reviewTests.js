import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';

dotenv.config();

const BASE = 'http://localhost:5000/api';

async function run() {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('   StyleAI Phase 4.8 – Product Reviews API Test Suite');
  console.log('═══════════════════════════════════════════════════════\n');

  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/styleai');
    console.log('✅ Connected to MongoDB directly for seeding.');
  } catch (err) {
    console.error('❌ DB connection failed.', err);
    process.exit(1);
  }

  // Seed test user
  const email = 'reviewer@test.com';
  const password = 'testpassword123';
  await User.deleteMany({ email });
  const user = await User.create({
    name: 'Reviewer Test User',
    email,
    password,
    role: 'user',
    provider: 'local'
  });

  // Seed test product
  const uniqueName = 'Review Test Shirt ' + Date.now();
  const product = await Product.create({
    name: uniqueName,
    description: 'A shirt specifically created to test reviews and ratings.',
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
    slug: 'review-test-shirt-' + Date.now()
  });

  // Cleanup past reviews
  await Review.deleteMany({ product: product._id });
  await Order.deleteMany({ user: user._id });

  // Get Auth Token
  const loginRes = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;

  if (!token) {
    console.error('❌ Failed to get authentication token.');
    await User.deleteOne({ _id: user._id });
    await Product.deleteOne({ _id: product._id });
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log('✅ Seeding complete. Authenticated successfully.');

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

  // ── Test 1: Check eligibility before purchase (should be ineligible) ────
  let res = await fetch(`${BASE}/products/${product.slug}/reviews/eligible`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  let data = await res.json();
  logTest('Check eligibility before purchase (should be false)', data.eligible === false, `eligible: ${data.eligible}`);

  // ── Test 2: Try to submit review before purchase (should fail with 403) ──
  res = await fetch(`${BASE}/products/${product.slug}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      rating: 5,
      review: 'Great shirt!',
      images: ['http://example.com/img.png']
    })
  });
  data = await res.json();
  logTest('Submit review before purchase fails (403)', res.status === 403, `status: ${res.status}, error: ${data.error}`);

  // ── Test 3: Seed an order containing the product ──────────────────────
  const order = await Order.create({
    user: user._id,
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
    addressSnapshot: {
      label: 'Home',
      street: '123 Test St',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      phone: '9876543210'
    },
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    status: 'Delivered'
  });
  console.log('✅ Seeded a Delivered order containing the product.');

  // ── Test 4: Check eligibility after purchase (should be eligible) ────
  res = await fetch(`${BASE}/products/${product.slug}/reviews/eligible`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  data = await res.json();
  logTest('Check eligibility after purchase (should be true)', data.eligible === true, `eligible: ${data.eligible}`);

  // ── Test 5: Submit review successfully (should succeed with 200) ──────
  res = await fetch(`${BASE}/products/${product.slug}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      rating: 4,
      review: 'Lovely cotton fabric, fits very well.',
      images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518']
    })
  });
  data = await res.json();
  logTest('Submit review successfully (200)', res.status === 200, `status: ${res.status}, message: ${data.message}`);

  // ── Test 6: Verify review updated on product model ────────────────────
  const updatedProduct = await Product.findById(product._id);
  logTest('Product ratings count is 1', updatedProduct.reviewsCount === 1, `reviewsCount: ${updatedProduct.reviewsCount}`);
  logTest('Product average rating is 4', updatedProduct.ratings === 4, `ratings: ${updatedProduct.ratings}`);

  // ── Test 7: Submit updated review (should edit existing) ──────────────
  res = await fetch(`${BASE}/products/${product.slug}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      rating: 5,
      review: 'Updated: Actually it is super comfortable after a wash!',
      images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518']
    })
  });
  data = await res.json();
  logTest('Edit existing review successfully (200)', res.status === 200, `status: ${res.status}, message: ${data.message}`);

  // ── Test 8: Verify review updated ratings ─────────────────────────────
  const finalProduct = await Product.findById(product._id);
  logTest('Product ratings count remains 1', finalProduct.reviewsCount === 1, `reviewsCount: ${finalProduct.reviewsCount}`);
  logTest('Product average rating updated to 5', finalProduct.ratings === 5, `ratings: ${finalProduct.ratings}`);

  // ── Cleanup ──────────────────────────────────────────────────────────
  await Review.deleteMany({ product: product._id });
  await Order.deleteOne({ _id: order._id });
  await Product.deleteOne({ _id: product._id });
  await User.deleteOne({ _id: user._id });
  await mongoose.disconnect();
  console.log('✅ Cleanup complete. DB connection closed.');

  console.log('\n═══════════════════════════════════════════════════════');
  console.log(`   Results: ${passed} passed, ${failed} failed`);
  console.log('═══════════════════════════════════════════════════════\n');
}

run();
