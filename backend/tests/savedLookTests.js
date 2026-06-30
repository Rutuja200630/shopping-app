import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import SavedLook from '../models/SavedLook.js';

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
  console.log('   StyleAI Phase 5.5B.1 – Saved Looks Test Suite');
  console.log('═══════════════════════════════════════════════════════\n');

  // 1. Connect to MongoDB
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/styleai');
    console.log('✅ Connected to MongoDB.');
  } catch (err) {
    console.error('❌ DB connection failed.', err);
    process.exit(1);
  }

  // 2. Setup test users
  const emailA = 'look_user_a@example.com';
  const emailB = 'look_user_b@example.com';
  const passwordText = 'password123';

  // Clean existing test users if any
  await User.deleteMany({ email: { $in: [emailA, emailB] } });
  await SavedLook.deleteMany({});

  // Seed User A
  const userA = await User.create({
    name: 'Saved Look User A',
    email: emailA,
    password: passwordText,
    role: 'user',
    provider: 'local'
  });

  // Seed User B
  const userB = await User.create({
    name: 'Saved Look User B',
    email: emailB,
    password: passwordText,
    role: 'user',
    provider: 'local'
  });

  console.log('✅ Seeding of test users completed.');

  // Login both users to fetch tokens
  const loginARes = await req('POST', '/auth/login', { body: { email: emailA, password: passwordText } });
  const loginBRes = await req('POST', '/auth/login', { body: { email: emailB, password: passwordText } });

  const tokenA = loginARes.data?.token;
  const tokenB = loginBRes.data?.token;

  if (!tokenA || !tokenB) {
    console.error('❌ Auth token fetch failed. Verify backend server is running.', { loginARes, loginBRes });
    await User.deleteMany({ email: { $in: [emailA, emailB] } });
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log('✅ Authentication tokens fetched successfully.');

  // 3. Test Unauthorized Access
  console.log('\n--- Test 1: Block Unauthorized Actions ---');
  let r = await req('GET', '/looks');
  logTest('GET /looks without token → 401', r.status === 401, `status: ${r.status}`);

  r = await req('POST', '/looks', { body: { title: 'Test Look' } });
  logTest('POST /looks without token → 401', r.status === 401, `status: ${r.status}`);

  r = await req('DELETE', '/looks/60c72b2f9b1d8a001c8e1000');
  logTest('DELETE /looks/:id without token → 401', r.status === 401, `status: ${r.status}`);

  // 4. Test Save Look
  console.log('\n--- Test 2: Save Look (User A) ---');
  const sampleLook = {
    title: 'Classic Saree Look',
    stylistNote: 'Anchored by the beautiful Silk Saree and paired with elegant heels.',
    totalPrice: 6200,
    items: {
      main: {
        productId: '60c72b2f9b1d8a001c8e2001',
        name: 'Ivory Silk Saree',
        slug: 'ivory-silk-saree',
        image: 'http://example.com/saree.jpg',
        price: 5000,
        brand: 'StyleAI'
      },
      footwear: {
        productId: '60c72b2f9b1d8a001c8e2002',
        name: 'Gold Heels',
        slug: 'gold-heels',
        image: 'http://example.com/heels.jpg',
        price: 1200,
        brand: 'StyleAI'
      }
    }
  };

  r = await req('POST', '/looks', { body: sampleLook, token: tokenA });
  logTest('POST /looks → 201 Created', r.status === 201, `status: ${r.status}`);
  
  const savedLookId = r.data?._id;
  logTest('Look returns generated database ID', !!savedLookId, `id: ${savedLookId}`);
  logTest('Look contains correct user reference', r.data?.user === userA._id.toString(), `user: ${r.data?.user}`);

  // 5. Test Duplicate Prevention
  console.log('\n--- Test 3: Duplicate Look Prevention ---');
  r = await req('POST', '/looks', { body: sampleLook, token: tokenA });
  logTest('POST duplicate look → 409 Conflict', r.status === 409, `status: ${r.status}, error: ${r.data?.error || r.data?.message}`);

  // 6. Test List Looks
  console.log('\n--- Test 4: List Saved Looks ---');
  // Save another look to verify sort and array structure
  const secondLook = {
    title: 'Anarkali Festive Look',
    stylistNote: 'Built around the elegant Pink Anarkali.',
    totalPrice: 3800,
    items: {
      main: {
        productId: '60c72b2f9b1d8a001c8e3001',
        name: 'Festive Pink Anarkali',
        slug: 'festive-pink-anarkali',
        image: 'http://example.com/anarkali.jpg',
        price: 3800,
        brand: 'StyleAI'
      }
    }
  };
  await req('POST', '/looks', { body: secondLook, token: tokenA });

  r = await req('GET', '/looks', { token: tokenA });
  logTest('GET /looks → 200 OK', r.status === 200, `status: ${r.status}`);
  logTest('GET /looks returns array of looks', Array.isArray(r.data), `type: ${typeof r.data}`);
  logTest('Array has 2 items', r.data?.length === 2, `length: ${r.data?.length}`);
  logTest('First item is the newest saved look (Anarkali)', r.data?.[0]?.title === 'Anarkali Festive Look', `newest: ${r.data?.[0]?.title}`);

  // 7. Test Delete Look Auth Protection (User B cannot delete User A's look)
  console.log('\n--- Test 5: Delete Unauthorized Check ---');
  r = await req('DELETE', `/looks/${savedLookId}`, { token: tokenB });
  logTest('DELETE /looks/:id (User B trying to delete User A look) → 403 Forbidden', r.status === 403, `status: ${r.status}, error: ${r.data?.error || r.data?.message}`);

  // 8. Test Delete Look Owner Check (User A can delete their own look)
  console.log('\n--- Test 6: Delete Saved Look (Owner) ---');
  r = await req('DELETE', `/looks/${savedLookId}`, { token: tokenA });
  logTest('DELETE /looks/:id (Owner deletes) → 200 OK', r.status === 200, `status: ${r.status}`);

  // Verify deletion actually removed from DB
  r = await req('GET', '/looks', { token: tokenA });
  logTest('Look is removed from active saved looks list', r.data?.length === 1 && r.data?.[0]?._id !== savedLookId, `remaining count: ${r.data?.length}`);

  // 9. Cleanup database
  await User.deleteMany({ email: { $in: [emailA, emailB] } });
  await SavedLook.deleteMany({});
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
