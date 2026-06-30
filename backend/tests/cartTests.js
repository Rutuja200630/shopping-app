/**
 * StyleAI – Phase 4.5 Cart Backend Automated Test Suite
 *
 * Runs all cart endpoint scenarios against the live backend at localhost:5000.
 * Requires: Backend running (npm run dev in /backend)
 *
 * Usage: node tests/cartTests.js
 */

import dotenv from 'dotenv';
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
  const res = await fetch(`${BASE}${path}`, opts);
  let data;
  try { data = await res.json(); } catch { data = null; }
  return { status: res.status, data };
}

// ── Auth Helper: log in as abc@123.com (seeded user) ─────────────────────────
async function getToken() {
  const { status, data } = await req('POST', '/auth/login', {
    body: { email: 'abc@123.com', password: 'abc123' }
  });
  if (status !== 200) {
    console.error('⚠️  Could not login as test user. Make sure abc@123.com exists.');
    process.exit(1);
  }
  return data.token;
}

// ── Known Product Info ────────────────────────────────────────────────────────
const PRODUCT_ID = '6a2f97cb07805bf53ccf7959'; // Pastel Embroidered Lehenga
const VALID_SIZE = 'S';
const INVALID_SIZE = 'XXXL';
const FAKE_PRODUCT_ID = '000000000000000000000000';

// ── Test Runner ───────────────────────────────────────────────────────────────
async function run() {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('   StyleAI Phase 4.5 – Cart API Test Suite');
  console.log('═══════════════════════════════════════════════════════\n');

  // ── 1. Unauthorized Access ─────────────────────────────────────────────────
  console.log('── 1. Unauthorized Access ──────────────────────────────');

  let r = await req('GET', '/cart');
  log('GET /cart without token → 401', r.status === 401, `status: ${r.status}`);

  r = await req('POST', '/cart', { body: { productId: PRODUCT_ID, size: VALID_SIZE } });
  log('POST /cart without token → 401', r.status === 401, `status: ${r.status}`);

  // ── Login and get token ────────────────────────────────────────────────────
  console.log('\n── Logging in as test user ─────────────────────────────');
  const token = await getToken();
  console.log('   Token obtained ✓\n');

  // ── 2. Clear cart first (clean slate) ─────────────────────────────────────
  console.log('── 2. Clear Cart ───────────────────────────────────────');
  r = await req('DELETE', '/cart', { token });
  log('DELETE /cart (clear) → 200', r.status === 200, r.data?.message);

  // ── 3. Get empty cart ─────────────────────────────────────────────────────
  console.log('\n── 3. Get Empty Cart ───────────────────────────────────');
  r = await req('GET', '/cart', { token });
  log('GET /cart (empty) → 200', r.status === 200, `items: ${r.data?.length ?? 'N/A'}`);
  log('GET /cart returns empty array', Array.isArray(r.data) && r.data.length === 0);

  // ── 4. Count endpoint on empty cart ───────────────────────────────────────
  console.log('\n── 4. Count Endpoint (empty) ───────────────────────────');
  r = await req('GET', '/cart/count', { token });
  log('GET /cart/count → 200', r.status === 200, `count: ${r.data?.count}`);
  log('GET /cart/count returns 0 on empty cart', r.data?.count === 0);

  // ── 5. Invalid Product ────────────────────────────────────────────────────
  console.log('\n── 5. Invalid Product ──────────────────────────────────');
  r = await req('POST', '/cart', { token, body: { productId: FAKE_PRODUCT_ID, size: VALID_SIZE } });
  log('POST /cart with non-existent productId → 404', r.status === 404, r.data?.error);

  // ── 6. Invalid MongoId format ──────────────────────────────────────────────
  console.log('\n── 6. Validation: Invalid MongoId ──────────────────────');
  r = await req('POST', '/cart', { token, body: { productId: 'not-a-mongo-id', size: VALID_SIZE } });
  log('POST /cart with invalid MongoId format → 400', r.status === 400, r.data?.error);

  // ── 7. Invalid Size ───────────────────────────────────────────────────────
  console.log('\n── 7. Invalid Size ─────────────────────────────────────');
  r = await req('POST', '/cart', { token, body: { productId: PRODUCT_ID, size: INVALID_SIZE } });
  log('POST /cart with unavailable size → 400', r.status === 400, r.data?.error);

  // ── 8. Add Item Successfully ──────────────────────────────────────────────
  console.log('\n── 8. Add Item to Cart ─────────────────────────────────');
  r = await req('POST', '/cart', { token, body: { productId: PRODUCT_ID, size: VALID_SIZE, quantity: 1 } });
  log('POST /cart → 201 Created', r.status === 201, r.data?.message);
  log('Response has cartItem', !!r.data?.cartItem);
  log('cartItem.product is populated', !!r.data?.cartItem?.product?.name, r.data?.cartItem?.product?.name);
  log('cartItem.size is correct', r.data?.cartItem?.size === VALID_SIZE);
  log('cartItem.quantity is 1', r.data?.cartItem?.quantity === 1);
  const cartItemId = r.data?.cartItem?._id;

  // ── 9. Add Same Product+Size Again (quantity should increment) ─────────────
  console.log('\n── 9. Upsert: Add Same Product+Size Again ──────────────');
  r = await req('POST', '/cart', { token, body: { productId: PRODUCT_ID, size: VALID_SIZE, quantity: 2 } });
  log('POST /cart same product+size → 200 (upsert)', r.status === 200, r.data?.message);
  log('Quantity incremented to 3 (1+2)', r.data?.cartItem?.quantity === 3, `quantity: ${r.data?.cartItem?.quantity}`);

  // ── 10. Count endpoint reflects total quantity ─────────────────────────────
  console.log('\n── 10. Count After Add ─────────────────────────────────');
  r = await req('GET', '/cart/count', { token });
  log('GET /cart/count reflects total quantity', r.data?.count === 3, `count: ${r.data?.count}`);

  // ── 11. Get Cart with populated product ───────────────────────────────────
  console.log('\n── 11. Get Cart (populated) ────────────────────────────');
  r = await req('GET', '/cart', { token });
  log('GET /cart → 200', r.status === 200);
  log('Cart has 1 item', Array.isArray(r.data) && r.data.length === 1);
  log('Product name populated', !!r.data?.[0]?.product?.name, r.data?.[0]?.product?.name);
  log('Product images populated', Array.isArray(r.data?.[0]?.product?.images));

  // ── 12. Update Quantity ───────────────────────────────────────────────────
  console.log('\n── 12. Update Cart Item Quantity ───────────────────────');
  if (cartItemId) {
    r = await req('PUT', `/cart/${cartItemId}`, { token, body: { quantity: 5 } });
    log('PUT /cart/:id → 200', r.status === 200, r.data?.message);
    log('Quantity updated to 5', r.data?.cartItem?.quantity === 5, `quantity: ${r.data?.cartItem?.quantity}`);
  } else {
    log('PUT /cart/:id skipped (no cartItemId)', false, 'cartItemId missing from add step');
  }

  // ── 13. Update with invalid quantity ─────────────────────────────────────
  console.log('\n── 13. Validation: Update with qty < 1 ─────────────────');
  if (cartItemId) {
    r = await req('PUT', `/cart/${cartItemId}`, { token, body: { quantity: 0 } });
    log('PUT /cart/:id with qty=0 → 400', r.status === 400, r.data?.error);
  }

  // ── 14. Remove Item ───────────────────────────────────────────────────────
  console.log('\n── 14. Remove Cart Item ────────────────────────────────');
  if (cartItemId) {
    r = await req('DELETE', `/cart/${cartItemId}`, { token });
    log('DELETE /cart/:id → 200', r.status === 200, r.data?.message);

    // Verify item is gone
    r = await req('GET', '/cart', { token });
    log('Cart is empty after remove', Array.isArray(r.data) && r.data.length === 0);
  }

  // ── 15. Delete non-existent item ─────────────────────────────────────────
  console.log('\n── 15. Delete Non-Existent Item ────────────────────────');
  r = await req('DELETE', `/cart/000000000000000000000001`, { token });
  log('DELETE /cart/:id non-existent → 404', r.status === 404, r.data?.error);

  // ── 16. Add item for final clear test ────────────────────────────────────
  console.log('\n── 16. Final Clear Cart ────────────────────────────────');
  await req('POST', '/cart', { token, body: { productId: PRODUCT_ID, size: VALID_SIZE, quantity: 1 } });
  r = await req('DELETE', '/cart', { token });
  log('DELETE /cart (clear all) → 200', r.status === 200, r.data?.message);

  r = await req('GET', '/cart/count', { token });
  log('Count is 0 after clear', r.data?.count === 0, `count: ${r.data?.count}`);

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
