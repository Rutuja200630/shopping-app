import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

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
  console.log('   StyleAI Phase 5.5B.3 – Cart Entire Look Tests');
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
  const testEmail = 'cart_look_user@example.com';
  const passwordText = 'password123';

  await User.deleteMany({ email: testEmail });
  await Product.deleteMany({ brand: 'CartLookBrand' });
  await Cart.deleteMany({});

  const user = await User.create({
    name: 'Cart Look User',
    email: testEmail,
    password: passwordText,
    role: 'user',
    provider: 'local'
  });

  // Seed test products
  const prodA = await Product.create({
    name: 'Cart Active Shirt A',
    slug: 'cart-active-shirt-a',
    description: 'Active test product A with size M available',
    brand: 'CartLookBrand',
    category: 'Apparel',
    subCategory: 'Shirts',
    material: 'Cotton',
    fit: 'Regular',
    gender: 'Women',
    price: 1500,
    originalPrice: 2000,
    images: ['http://example.com/a.jpg'],
    sizes: ['L', 'M'], // M preferred
    occasionTags: ['Casual'],
    isActive: true,
    inventory: 10
  });

  const prodB = await Product.create({
    name: 'Cart Active Pants B',
    slug: 'cart-active-pants-b',
    description: 'Active test product B with size S/L only (no M)',
    brand: 'CartLookBrand',
    category: 'Apparel',
    subCategory: 'Pants',
    material: 'Cotton',
    fit: 'Regular',
    gender: 'Women',
    price: 2500,
    originalPrice: 3000,
    images: ['http://example.com/b.jpg'],
    sizes: ['S', 'L'], // fallback to S
    occasionTags: ['Casual'],
    isActive: true,
    inventory: 5
  });

  const prodC = await Product.create({
    name: 'Cart Inactive Jacket C',
    slug: 'cart-inactive-jacket-c',
    description: 'Inactive test product C',
    brand: 'CartLookBrand',
    category: 'Apparel',
    subCategory: 'Jackets',
    material: 'Nylon',
    fit: 'Regular',
    gender: 'Women',
    price: 4500,
    originalPrice: 5000,
    images: ['http://example.com/c.jpg'],
    sizes: ['M'],
    occasionTags: ['Wedding'],
    isActive: false, // INACTIVE
    inventory: 2
  });

  const prodD = await Product.create({
    name: 'Cart Out of Stock D',
    slug: 'cart-out-of-stock-d',
    description: 'Out of stock product D',
    brand: 'CartLookBrand',
    category: 'Apparel',
    subCategory: 'Tees',
    material: 'Cotton',
    fit: 'Regular',
    gender: 'Women',
    price: 800,
    originalPrice: 1000,
    images: ['http://example.com/d.jpg'],
    sizes: ['M'],
    occasionTags: ['Casual'],
    isActive: true,
    inventory: 0 // OUT OF STOCK
  });

  const prodE = await Product.create({
    name: 'Cart Pre-Existing E',
    slug: 'cart-pre-existing-e',
    description: 'Product already in user cart',
    brand: 'CartLookBrand',
    category: 'Apparel',
    subCategory: 'Shoes',
    material: 'Leather',
    fit: 'Regular',
    gender: 'Women',
    price: 1200,
    originalPrice: 1500,
    images: ['http://example.com/e.jpg'],
    sizes: ['M'],
    occasionTags: ['Casual'],
    isActive: true,
    inventory: 8
  });

  // Seed Product E inside cart
  await Cart.create({
    user: user._id,
    product: prodE._id,
    size: 'M',
    quantity: 1
  });

  console.log('✅ Seeding of test user and products completed.');

  // Login
  const loginRes = await req('POST', '/auth/login', { body: { email: testEmail, password: passwordText } });
  const token = loginRes.data?.token;

  if (!token) {
    console.error('❌ Authentication failed.', loginRes);
    await User.deleteMany({ email: testEmail });
    await Product.deleteMany({ brand: 'CartLookBrand' });
    await mongoose.disconnect();
    process.exit(1);
  }

  // 3. Test Unauthorized Blocked
  console.log('\n--- Test 1: Block Unauthorized Actions ---');
  let r = await req('POST', '/cart/look', { body: { productIds: [prodA._id.toString()] } });
  logTest('POST /cart/look without token → 401', r.status === 401, `status: ${r.status}`);

  // 4. Test Add Entire Look to Cart
  console.log('\n--- Test 2: Add Entire Look (with validations) ---');
  const payload = {
    productIds: [
      prodA._id.toString(),
      prodB._id.toString(),
      prodC._id.toString(), // Inactive -> skip
      prodD._id.toString(), // Out of stock -> skip
      prodE._id.toString(), // Pre-existing in cart -> skip
      null,                 // Null -> ignore
      'invalid_objectId_123'// Invalid -> skip
    ]
  };

  r = await req('POST', '/cart/look', { body: payload, token });
  logTest('POST /cart/look → 200 OK', r.status === 200, `status: ${r.status}`);
  logTest('API returns success flag', r.data?.success === true, `success: ${r.data?.success}`);
  logTest('Added count is 2 (Product A and B)', r.data?.added === 2, `added: ${r.data?.added}`);
  logTest('Skipped count is 4 (Product C, D, E, and invalid ID)', r.data?.skipped === 4, `skipped: ${r.data?.skipped}`);

  // Verify size selection rules in database
  const itemA = await Cart.findOne({ user: user._id, product: prodA._id }).lean();
  logTest('Product A size chosen matches preferred "M"', itemA?.size === 'M', `size: ${itemA?.size}`);
  logTest('Product A quantity equals 1', itemA?.quantity === 1, `quantity: ${itemA?.quantity}`);

  const itemB = await Cart.findOne({ user: user._id, product: prodB._id }).lean();
  logTest('Product B size fallback matches first size "S"', itemB?.size === 'S', `size: ${itemB?.size}`);

  const totalCart = await Cart.find({ user: user._id });
  logTest('Cart has exactly 3 items in database', totalCart.length === 3, `count: ${totalCart.length}`);

  // 5. Test Idempotency
  console.log('\n--- Test 3: Idempotency Verification ---');
  r = await req('POST', '/cart/look', { body: payload, token });
  logTest('Second POST request → 200 OK', r.status === 200, `status: ${r.status}`);
  logTest('Added count is 0 on re-cart add', r.data?.added === 0, `added: ${r.data?.added}`);
  logTest('Skipped count is 6 (all valid items now in cart, invalid still skipped)', r.data?.skipped === 6, `skipped: ${r.data?.skipped}`);

  const finalCart = await Cart.find({ user: user._id });
  logTest('Cart database count remains unchanged at 3', finalCart.length === 3, `count: ${finalCart.length}`);

  // 6. Cleanup
  await User.deleteMany({ email: testEmail });
  await Product.deleteMany({ brand: 'CartLookBrand' });
  await Cart.deleteMany({});
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
