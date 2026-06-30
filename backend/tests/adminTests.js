/**
 * StyleAI – Phase 4.7 Admin Backend Automated Test Suite
 *
 * Runs all admin dashboard, product, order, and user registry scenarios.
 * Requires: Backend running (npm run dev in /backend)
 *
 * Usage: node tests/adminTests.js
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

dotenv.config();

const BASE = 'http://localhost:5000/api';

// ── Helpers ───────────────────────────────────────────────────────────────────
let PASS = 0;
let FAIL = 0;

function log(label, passed, detail = '') {
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
    try { data = await res.json(); } catch { data = null; }
    return { status: res.status, data };
  } catch (err) {
    return { status: 500, data: { error: err.message } };
  }
}

// ── Test Runner ───────────────────────────────────────────────────────────────
async function run() {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('   StyleAI Phase 4.7 – Admin API Test Suite');
  console.log('═══════════════════════════════════════════════════════\n');

  // ── 1. Establish Direct DB Connection for Seeding ──────────────────────────
  console.log('── Database Connection ────────────────────────────────');
  let dbConnected = false;
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/styleai');
    console.log('✅ Connected to MongoDB directly for seeding and cleanup.');
    dbConnected = true;
  } catch (err) {
    console.log(`⚠️ Connection to primary MONGO_URI failed: ${err.message}. Trying local fallback...`);
    try {
      await mongoose.connect('mongodb://127.0.0.1:27017/styleai');
      console.log('✅ Connected to local MongoDB fallback.');
      dbConnected = true;
    } catch (localErr) {
      console.error('❌ Database connection failed. Tests aborted.', localErr);
      process.exit(1);
    }
  }

  // Create temporary test users
  const adminEmail = 'temp.admin@styleai.com';
  const userEmail = 'temp.user@styleai.com';
  const passwordText = 'adminpass123';

  // Clean up any stale records from previous runs
  await User.deleteMany({ email: { $in: [adminEmail, userEmail] } });

  // Seed Admin user
  const adminDbUser = await User.create({
    name: 'Test Administrator',
    email: adminEmail,
    password: passwordText,
    role: 'admin',
    provider: 'local'
  });

  // Seed Regular user
  const regularDbUser = await User.create({
    name: 'Test Regular User',
    email: userEmail,
    password: passwordText,
    role: 'user',
    provider: 'local'
  });

  console.log('✅ Temporary test users seeded successfully in MongoDB.');

  // Fetch Tokens via auth API
  const adminLogin = await req('POST', '/auth/login', { body: { email: adminEmail, password: passwordText } });
  const userLogin = await req('POST', '/auth/login', { body: { email: userEmail, password: passwordText } });

  const adminToken = adminLogin.data?.token;
  const userToken = userLogin.data?.token;

  if (!adminToken || !userToken) {
    console.error('❌ Auth token fetch failed. Ensure backend server is running on port 5000.', { adminLogin, userLogin });
    await User.deleteMany({ email: { $in: [adminEmail, userEmail] } });
    await mongoose.disconnect();
    process.exit(1);
  }

  // ── 2. Security Checks (Unauthorized & Non-Admin block) ──────────────────────
  console.log('\n── 2. Security & Privilege Guards ──────────────────────');
  
  let r = await req('GET', '/admin/dashboard');
  log('GET /admin/dashboard without token → 401', r.status === 401, `status: ${r.status}`);

  r = await req('GET', '/admin/dashboard', { token: userToken });
  log('GET /admin/dashboard with regular user token → 403', r.status === 403, `status: ${r.status}`);

  r = await req('GET', '/admin/dashboard', { token: adminToken });
  log('GET /admin/dashboard with admin token → 200', r.status === 200, `status: ${r.status}`);

  // ── 3. Dashboard Statistics ────────────────────────────────────────────────
  console.log('\n── 3. Dashboard Statistics ─────────────────────────────');
  log('Stats response contains totalUsers', typeof r.data?.totalUsers === 'number', `totalUsers: ${r.data?.totalUsers}`);
  log('Stats response contains totalProducts', typeof r.data?.totalProducts === 'number', `totalProducts: ${r.data?.totalProducts}`);
  log('Stats response contains totalOrders', typeof r.data?.totalOrders === 'number', `totalOrders: ${r.data?.totalOrders}`);
  log('Stats response contains totalRevenue', typeof r.data?.totalRevenue === 'number', `totalRevenue: ${r.data?.totalRevenue}`);
  log('Stats response contains pendingOrders', typeof r.data?.pendingOrders === 'number', `pendingOrders: ${r.data?.pendingOrders}`);
  log('Stats response contains deliveredOrders', typeof r.data?.deliveredOrders === 'number', `deliveredOrders: ${r.data?.deliveredOrders}`);

  // ── 4. Product CRUD Lifecycle ──────────────────────────────────────────────
  console.log('\n── 4. Product CRUD (Admin Only) ────────────────────────');
  
  const testProductPayload = {
    name: 'Admin Test Shirt',
    description: 'Beautiful test shirt created during automated testing.',
    brand: 'StyleAI',
    category: 'Apparel',
    subCategory: 'Shirts',
    material: 'Premium Cotton',
    fit: 'Slim Fit',
    gender: 'Unisex',
    price: 999,
    originalPrice: 1499,
    discount: 33,
    images: ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500'],
    sizes: ['S', 'M', 'L'],
    colors: ['White', 'Black'],
    inventory: 50,
    occasionTags: ['Casual', 'Semi-Formal'],
    featured: true,
    aiRecommended: false,
    isActive: true
  };

  // Create Product
  r = await req('POST', '/admin/products', { token: adminToken, body: testProductPayload });
  log('POST /admin/products → 211 Created', r.status === 201, r.data?.message);
  const productId = r.data?.product?._id;
  log('Product ID was returned', !!productId);

  // Validation: Missing fields
  const invalidPayload = { name: 'Empty Product' };
  r = await req('POST', '/admin/products', { token: adminToken, body: invalidPayload });
  log('POST /admin/products with invalid body → 400 Validation Error', r.status === 400, r.data?.error);

  // Update Product
  if (productId) {
    r = await req('PUT', `/admin/products/${productId}`, {
      token: adminToken,
      body: { name: 'Admin Test Shirt Updated', price: 1099 }
    });
    log('PUT /admin/products/:id → 200 Updated', r.status === 200, r.data?.message);
    log('Name was updated successfully', r.data?.product?.name === 'Admin Test Shirt Updated');
    log('Price was updated successfully', r.data?.product?.price === 1099);
  }

  // List all products
  r = await req('GET', '/admin/products', { token: adminToken });
  log('GET /admin/products → 200', r.status === 200, `products count: ${r.data?.length}`);
  const listedTestProduct = r.data?.find(p => p._id === productId);
  log('Created product exists in products list', !!listedTestProduct);

  // Soft Delete Product
  if (productId) {
    r = await req('DELETE', `/admin/products/${productId}`, { token: adminToken });
    log('DELETE /admin/products/:id → 200 Soft Deleted', r.status === 200, r.data?.message);
    log('Product is now marked isActive = false', r.data?.product?.isActive === false);
  }

  // ── 5. Order Management & Transition Rules ─────────────────────────────────
  console.log('\n── 5. Order Management & Transitions ──────────────────');

  // Seed a product to order
  const orderProduct = await Product.create({
    name: 'Order Test Product',
    slug: 'order-test-product-' + Date.now(),
    description: 'Test product for orders.',
    brand: 'StyleAI',
    category: 'Apparel',
    subCategory: 'Shirts',
    material: 'Linen',
    fit: 'Loose Fit',
    gender: 'Unisex',
    price: 500,
    originalPrice: 500,
    images: ['https://example.com/image.jpg'],
    sizes: ['M'],
    occasionTags: ['Casual'],
    inventory: 10
  });

  // Create order directly in database
  const orderDb = await Order.create({
    user: regularDbUser._id,
    items: [{
      product: orderProduct._id,
      productName: orderProduct.name,
      productImage: orderProduct.images[0],
      size: 'M',
      quantity: 2,
      priceSnapshot: 500
    }],
    addressSnapshot: {
      label: 'Home',
      street: '123 Main St',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      phone: '9876543210',
      country: 'India'
    },
    subtotal: 1000,
    shipping: 0,
    discount: 0,
    total: 1000,
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    status: 'Pending'
  });

  const testOrderId = orderDb._id;
  log('Created test order directly in MongoDB', !!testOrderId);

  // Test invalid transition (Pending -> Shipped)
  r = await req('PATCH', `/admin/orders/${testOrderId}/status`, {
    token: adminToken,
    body: { status: 'Shipped' }
  });
  log('PATCH /admin/orders/:id/status (Pending → Shipped) → 400 Rejected', r.status === 400, r.data?.error);

  // Test valid transition (Pending -> Confirmed)
  r = await req('PATCH', `/admin/orders/${testOrderId}/status`, {
    token: adminToken,
    body: { status: 'Confirmed' }
  });
  log('PATCH /admin/orders/:id/status (Pending → Confirmed) → 200 Accepted', r.status === 200, r.data?.message);

  // Test valid transition (Confirmed -> Packed)
  r = await req('PATCH', `/admin/orders/${testOrderId}/status`, {
    token: adminToken,
    body: { status: 'Packed' }
  });
  log('PATCH /admin/orders/:id/status (Confirmed → Packed) → 200 Accepted', r.status === 200, r.data?.message);

  // Test valid transition (Packed -> Shipped)
  r = await req('PATCH', `/admin/orders/${testOrderId}/status`, {
    token: adminToken,
    body: { status: 'Shipped' }
  });
  log('PATCH /admin/orders/:id/status (Packed → Shipped) → 200 Accepted', r.status === 200, r.data?.message);

  // Test valid transition (Shipped -> Delivered)
  r = await req('PATCH', `/admin/orders/${testOrderId}/status`, {
    token: adminToken,
    body: { status: 'Delivered' }
  });
  log('PATCH /admin/orders/:id/status (Shipped → Delivered) → 200 Accepted', r.status === 200, r.data?.message);

  // Test Delived -> Cancelled (Forbidden)
  r = await req('PATCH', `/admin/orders/${testOrderId}/status`, {
    token: adminToken,
    body: { status: 'Cancelled' }
  });
  log('PATCH /admin/orders/:id/status (Delivered → Cancelled) → 400 Rejected', r.status === 400, r.data?.error);

  // ── 6. User Registry & Role Management ─────────────────────────────────────
  console.log('\n── 6. User Registry & Role Management ──────────────────');
  r = await req('GET', '/admin/users', { token: adminToken });
  log('GET /admin/users → 200', r.status === 200);
  log('Response returns an array of users', Array.isArray(r.data));
  const hasUserFields = r.data?.[0] && 'name' in r.data[0] && 'email' in r.data[0] && 'role' in r.data[0] && 'createdAt' in r.data[0];
  log('User documents contain select read-only fields', !!hasUserFields);
  log('Password hashes are excluded from user list', r.data?.[0] && !('password' in r.data[0]));

  // Promote User to admin
  r = await req('PATCH', `/admin/users/${regularDbUser._id}/role`, {
    token: adminToken,
    body: { role: 'admin' }
  });
  log('PATCH /admin/users/:id/role (Promote to admin) → 200', r.status === 200, r.data?.message);
  log('User role successfully updated in DB', r.data?.user?.role === 'admin');

  // Prevent Self-demotion
  r = await req('PATCH', `/admin/users/${adminDbUser._id}/role`, {
    token: adminToken,
    body: { role: 'user' }
  });
  log('PATCH /admin/users/:id/role (Self-demotion) → 400 Rejected', r.status === 400, r.data?.error);

  // Demote Admin back to user
  r = await req('PATCH', `/admin/users/${regularDbUser._id}/role`, {
    token: adminToken,
    body: { role: 'user' }
  });
  log('PATCH /admin/users/:id/role (Demote user back) → 200', r.status === 200, r.data?.message);

  // ── 7. Isolated Inventory Management ───────────────────────────────────────
  console.log('\n── 7. Isolated Inventory Management ────────────────────');
  r = await req('PATCH', `/admin/products/${orderProduct._id}/inventory`, {
    token: adminToken,
    body: { inventory: 85 }
  });
  log('PATCH /admin/products/:id/inventory (Set to 85) → 200', r.status === 200, r.data?.message);
  log('Inventory stock successfully updated in DB', r.data?.product?.inventory === 85);

  // Validate inventory cannot be negative
  r = await req('PATCH', `/admin/products/${orderProduct._id}/inventory`, {
    token: adminToken,
    body: { inventory: -5 }
  });
  log('PATCH /admin/products/:id/inventory (Set to negative) → 400 Rejected', r.status === 400, r.data?.error);

  // ── 8. Global Search ────────────────────────────────────────────────────────
  console.log('\n── 8. Global Search ────────────────────────────────────');
  r = await req('GET', `/admin/search?q=Order`, { token: adminToken });
  log('GET /admin/search?q=Order → 200', r.status === 200);
  log('Returns product results', r.data?.products?.length > 0);
  log('Returns order results', r.data?.orders?.length > 0);

  r = await req('GET', `/admin/search?q=${adminDbUser._id}`, { token: adminToken });
  log('GET /admin/search?q=ID → 200', r.status === 200);

  // ── 9. Image Upload Endpoint ────────────────────────────────────────────────
  console.log('\n── 9. Image Upload Placement ───────────────────────────');
  const transparentPngBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
    'base64'
  );
  const uploadFormData = new FormData();
  uploadFormData.append('image', new Blob([transparentPngBuffer], { type: 'image/png' }), 'shirt.png');

  let uploadRes;
  try {
    const resObj = await fetch(`${BASE}/admin/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      },
      body: uploadFormData
    });
    const uploadData = await resObj.json();
    uploadRes = { status: resObj.status, data: uploadData };
  } catch (err) {
    uploadRes = { status: 500, data: { error: err.message } };
  }

  log('POST /admin/upload → 200', uploadRes.status === 200, uploadRes.data?.message || uploadRes.data?.error);
  log('Returns correct URL', typeof uploadRes.data?.url === 'string' && uploadRes.data?.url.startsWith('http'), `url: ${uploadRes.data?.url}`);
  log('Returns public ID string', typeof uploadRes.data?.publicId === 'string', `publicId: ${uploadRes.data?.publicId}`);

  // ── 8. Cleanup Database ────────────────────────────────────────────────────
  console.log('\n── Cleanup ────────────────────────────────────────────');
  await User.deleteMany({ email: { $in: [adminEmail, userEmail] } });
  if (productId) await Product.findByIdAndDelete(productId);
  await Product.findByIdAndDelete(orderProduct._id);
  await Order.findByIdAndDelete(testOrderId);
  console.log('✅ Temporary seeding data removed from database.');

  await mongoose.disconnect();
  console.log('✅ Mongoose connection closed.');

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════════════');
  console.log(`   Results: ${PASS} passed, ${FAIL} failed`);
  console.log('═══════════════════════════════════════════════════════\n');
  process.exit(FAIL > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error('Test runner crashed:', err);
  process.exit(1);
});
