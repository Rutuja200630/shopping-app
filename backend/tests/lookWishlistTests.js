import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Wishlist from '../models/Wishlist.js';

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
  console.log('   StyleAI Phase 5.5B.2 – Wishlist Entire Look Tests');
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
  const testEmail = 'wishlist_look_user@example.com';
  const passwordText = 'password123';

  await User.deleteMany({ email: testEmail });
  await Product.deleteMany({ brand: 'WishlistLookBrand' });
  await Wishlist.deleteMany({});

  const user = await User.create({
    name: 'Wishlist Look User',
    email: testEmail,
    password: passwordText,
    role: 'user',
    provider: 'local'
  });

  // Seed active and inactive products
  const prodA = await Product.create({
    name: 'Active Shirt A',
    slug: 'active-shirt-a',
    description: 'Active test product A',
    brand: 'WishlistLookBrand',
    category: 'Apparel',
    subCategory: 'Shirts',
    material: 'Cotton',
    fit: 'Regular',
    gender: 'Women',
    price: 1500,
    originalPrice: 2000,
    images: ['http://example.com/a.jpg'],
    sizes: ['M'],
    occasionTags: ['Casual'],
    isActive: true,
    inventory: 10
  });

  const prodB = await Product.create({
    name: 'Active Pants B',
    slug: 'active-pants-b',
    description: 'Active test product B',
    brand: 'WishlistLookBrand',
    category: 'Apparel',
    subCategory: 'Pants',
    material: 'Cotton',
    fit: 'Regular',
    gender: 'Women',
    price: 2500,
    originalPrice: 3000,
    images: ['http://example.com/b.jpg'],
    sizes: ['32'],
    occasionTags: ['Casual'],
    isActive: true,
    inventory: 5
  });

  const prodC = await Product.create({
    name: 'Inactive Jacket C',
    slug: 'inactive-jacket-c',
    description: 'Inactive test product C',
    brand: 'WishlistLookBrand',
    category: 'Apparel',
    subCategory: 'Jackets',
    material: 'Nylon',
    fit: 'Regular',
    gender: 'Women',
    price: 4500,
    originalPrice: 5000,
    images: ['http://example.com/c.jpg'],
    sizes: ['L'],
    occasionTags: ['Wedding'],
    isActive: false, // INACTIVE
    inventory: 2
  });

  const prodD = await Product.create({
    name: 'Pre-Existing Product D',
    slug: 'pre-existing-product-d',
    description: 'Product already wishlisted',
    brand: 'WishlistLookBrand',
    category: 'Apparel',
    subCategory: 'Tees',
    material: 'Cotton',
    fit: 'Regular',
    gender: 'Women',
    price: 800,
    originalPrice: 1000,
    images: ['http://example.com/d.jpg'],
    sizes: ['S'],
    occasionTags: ['Casual'],
    isActive: true,
    inventory: 12
  });

  // Seed Product D in wishlist
  await Wishlist.create({
    user: user._id,
    product: prodD._id
  });

  console.log('✅ Seeding of test user and products completed.');

  // Login
  const loginRes = await req('POST', '/auth/login', { body: { email: testEmail, password: passwordText } });
  const token = loginRes.data?.token;

  if (!token) {
    console.error('❌ Authentication failed.', loginRes);
    await User.deleteMany({ email: testEmail });
    await Product.deleteMany({ brand: 'WishlistLookBrand' });
    await mongoose.disconnect();
    process.exit(1);
  }

  // 3. Test Unauthorized Blocked
  console.log('\n--- Test 1: Block Unauthorized Actions ---');
  let r = await req('POST', '/wishlist/look', { body: { productIds: [prodA._id.toString()] } });
  logTest('POST /wishlist/look without token → 401', r.status === 401, `status: ${r.status}`);

  // 4. Test Add Entire Look
  console.log('\n--- Test 2: Add Entire Look (with validations) ---');
  const payload = {
    productIds: [
      prodA._id.toString(),
      prodB._id.toString(),
      prodC._id.toString(), // Inactive -> skip
      prodD._id.toString(), // Pre-existing -> skip
      null,                 // Null -> ignore
      'invalid_objectId_123'// Invalid -> skip
    ]
  };

  r = await req('POST', '/wishlist/look', { body: payload, token });
  logTest('POST /wishlist/look → 200 OK', r.status === 200, `status: ${r.status}`);
  logTest('API returns success flag', r.data?.success === true, `success: ${r.data?.success}`);
  logTest('Added count is 2 (Product A and B)', r.data?.added === 2, `added: ${r.data?.added}`);
  logTest('Skipped count is 3 (Product C, D, and invalid ID)', r.data?.skipped === 3, `skipped: ${r.data?.skipped}`);

  // Verify wishlist size is now 3 (Product A, B, D)
  const items = await Wishlist.find({ user: user._id });
  logTest('Wishlist has exactly 3 items in database', items.length === 3, `count: ${items.length}`);

  // 5. Test Idempotency
  console.log('\n--- Test 3: Idempotency Verification ---');
  r = await req('POST', '/wishlist/look', { body: payload, token });
  logTest('Second POST request → 200 OK', r.status === 200, `status: ${r.status}`);
  logTest('Added count is 0 on re-wishlist', r.data?.added === 0, `added: ${r.data?.added}`);
  logTest('Skipped count is 5 (all 5 filtered IDs are skipped)', r.data?.skipped === 5, `skipped: ${r.data?.skipped}`);

  // Verify database count is still 3
  const finalItems = await Wishlist.find({ user: user._id });
  logTest('Wishlist database count remains unchanged at 3', finalItems.length === 3, `count: ${finalItems.length}`);

  // 6. Cleanup
  await User.deleteMany({ email: testEmail });
  await Product.deleteMany({ brand: 'WishlistLookBrand' });
  await Wishlist.deleteMany({});
  await mongoose.disconnect();
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
