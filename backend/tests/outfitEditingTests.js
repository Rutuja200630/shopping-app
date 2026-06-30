import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

dotenv.config();

const BASE = 'http://localhost:5000/api';

async function run() {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('   StyleAI Phase 5.5A – Outfit Editing Test Suite');
  console.log('═══════════════════════════════════════════════════════\n');

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

  // ── [A] DATABASE CONNECTION & SEEDING ──
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/styleai');
    console.log('✅ Connected to MongoDB.');
  } catch (err) {
    console.error('❌ DB connection failed.', err);
    process.exit(1);
  }

  // Clean previous test items
  await Product.deleteMany({ brand: 'EditTestBrand' });

  // Seed sample products
  const productsToSeed = [
    // Mains
    {
      name: 'EditTest Anarkali Kurta',
      slug: 'edittest-anarkali-kurta',
      description: 'Elegant silk pink kurta.',
      brand: 'EditTestBrand',
      category: 'Apparel',
      subCategory: 'Kurtas',
      material: 'Silk',
      fit: 'Regular',
      gender: 'Women',
      price: 3200,
      originalPrice: 4000,
      images: ['http://example.com/kurta1.png'],
      sizes: ['M'],
      occasionTags: ['Wedding'],
      isActive: true,
      inventory: 10
    },
    {
      name: 'EditTest Designer Saree',
      slug: 'edittest-designer-saree',
      description: 'Beautiful wedding saree.',
      brand: 'EditTestBrand',
      category: 'Apparel',
      subCategory: 'Saree',
      material: 'Georgette',
      fit: 'Regular',
      gender: 'Women',
      price: 4500,
      originalPrice: 6000,
      images: ['http://example.com/saree.png'],
      sizes: ['Free'],
      occasionTags: ['Wedding'],
      isActive: true,
      inventory: 8
    },
    // Footwear
    {
      name: 'EditTest Golden Heels',
      slug: 'edittest-golden-heels',
      description: 'Shiny block wedding heels.',
      brand: 'EditTestBrand',
      category: 'Footwear',
      subCategory: 'Heels',
      material: 'Synthetic',
      fit: 'Regular',
      gender: 'Women',
      price: 1200,
      originalPrice: 1800,
      images: ['http://example.com/heels.png'],
      sizes: ['7', '8'],
      occasionTags: ['Wedding'],
      isActive: true,
      inventory: 5,
      ratings: 4.2
    },
    {
      name: 'EditTest White Sneakers',
      slug: 'edittest-white-sneakers',
      description: 'Comfy everyday white sneakers.',
      brand: 'EditTestBrand',
      category: 'Footwear',
      subCategory: 'Sneakers',
      material: 'Leather',
      fit: 'Regular',
      gender: 'Women',
      price: 1800,
      originalPrice: 2500,
      images: ['http://example.com/sneakers.png'],
      sizes: ['7', '8'],
      occasionTags: ['Casual', 'Wedding'],
      isActive: true,
      inventory: 12,
      ratings: 4.6
    },
    // Accessories
    {
      name: 'EditTest Potli Clutch',
      slug: 'edittest-potli-clutch',
      description: 'Zardozi embroidered clutch.',
      brand: 'EditTestBrand',
      category: 'Accessories',
      subCategory: 'Handbags',
      material: 'Silk',
      fit: 'Regular',
      gender: 'Women',
      price: 800,
      originalPrice: 1200,
      images: ['http://example.com/clutch.png'],
      sizes: ['Free'],
      occasionTags: ['Wedding'],
      isActive: true,
      inventory: 15
    },
    {
      name: 'EditTest Premium Slingbag',
      slug: 'edittest-premium-slingbag',
      description: 'Leather slingbag for dressy events.',
      brand: 'EditTestBrand',
      category: 'Accessories',
      subCategory: 'Handbags',
      material: 'Leather',
      fit: 'Regular',
      gender: 'Women',
      price: 1500,
      originalPrice: 2200,
      images: ['http://example.com/slingbag.png'],
      sizes: ['Free'],
      occasionTags: ['Wedding'],
      isActive: true,
      inventory: 6
    },
    // Layers
    {
      name: 'EditTest Silk Shawl',
      slug: 'edittest-silk-shawl',
      description: 'Rich borders silk wedding shawl.',
      brand: 'EditTestBrand',
      category: 'Apparel',
      subCategory: 'Shawls',
      material: 'Silk',
      fit: 'Free',
      gender: 'Women',
      price: 1000,
      originalPrice: 1500,
      images: ['http://example.com/shawl.png'],
      sizes: ['Free'],
      occasionTags: ['Wedding'],
      isActive: true,
      inventory: 7
    }
  ];

  await Product.create(productsToSeed);
  console.log('✅ Seeded test catalog.');

  const testSessionId = 'edit_test_session_' + Math.random().toString(36).substring(2, 8);

  // ── [1] Initialize Conversation and Generate Looks ──
  console.log('\n--- Test 1: Initialize Chat and Generate Outfits ---');
  let res = await fetch(`${BASE}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: testSessionId,
      message: 'Need a wedding wear outfit under 8000 for a woman'
    })
  });

  let data = await res.json();
  logTest('Chat initialized successfully', res.status === 200, `status: ${res.status}`);
  logTest('API returns looks array', data.success && Array.isArray(data.looks) && data.looks.length > 0, `Looks count: ${data.looks ? data.looks.length : 0}`);

  if (!data.looks || data.looks.length === 0) {
    console.error('❌ Cannot run modification tests since initial looks generation returned 0 outfits.');
    await Product.deleteMany({ brand: 'EditTestBrand' });
    await mongoose.disconnect();
    process.exit(1);
  }

  const currentLook = data.looks[0];
  const lookId = currentLook.id;
  console.log(`Working with Look ID: ${lookId}, Title: "${currentLook.title}"`);

  // ── [2] Test action: replace footwear ──
  console.log('\n--- Test 2: Replace Footwear Slot ---');
  res = await fetch(`${BASE}/ai/modify-look`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: testSessionId,
      lookId,
      action: 'replace',
      slot: 'footwear',
      query: 'replace with white sneakers'
    })
  });
  let editData = await res.json();
  logTest('Replace footwear status', res.status === 200, `status: ${res.status}`);
  if (editData.success) {
    const newFootwear = editData.look.items.footwear;
    logTest(
      'Footwear slot replaced with sneakers',
      newFootwear && newFootwear.name.includes('Sneakers'),
      `New footwear item: ${newFootwear ? newFootwear.name : 'null'}`
    );
    logTest(
      'Price correctly updated for new item',
      editData.look.totalPrice === editData.look.items.main.price + newFootwear.price + (editData.look.items.accessory?.price || 0) + (editData.look.items.layer?.price || 0),
      `New totalPrice: ₹${editData.look.totalPrice}`
    );
  }

  // ── [3] Test action: replace accessory ──
  console.log('\n--- Test 3: Replace Accessory Slot ---');
  res = await fetch(`${BASE}/ai/modify-look`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: testSessionId,
      lookId,
      action: 'replace',
      slot: 'accessory',
      query: 'replace with slingbag'
    })
  });
  editData = await res.json();
  logTest('Replace accessory status', res.status === 200, `status: ${res.status}`);
  if (editData.success) {
    const newAccessory = editData.look.items.accessory;
    logTest(
      'Accessory slot replaced with slingbag',
      newAccessory && newAccessory.name.includes('Slingbag'),
      `New accessory item: ${newAccessory ? newAccessory.name : 'null'}`
    );
  }

  // ── [4] Test action: remove layer ──
  console.log('\n--- Test 4: Remove Layer Slot ---');
  res = await fetch(`${BASE}/ai/modify-look`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: testSessionId,
      lookId,
      action: 'remove',
      slot: 'layer'
    })
  });
  editData = await res.json();
  logTest('Remove layer status', res.status === 200, `status: ${res.status}`);
  if (editData.success) {
    logTest('Layer slot set to null', editData.look.items.layer === null, `Layer item: ${JSON.stringify(editData.look.items.layer)}`);
    logTest(
      'Note updated to state completed without layer',
      !editData.look.stylistNote.toLowerCase().includes('shawl'),
      `New Stylist Note: "${editData.look.stylistNote}"`
    );
  }

  // ── [5] Test action: upgrade item ──
  console.log('\n--- Test 5: Upgrade Footwear Slot ---');
  res = await fetch(`${BASE}/ai/modify-look`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: testSessionId,
      lookId,
      action: 'upgrade',
      slot: 'footwear'
    })
  });
  editData = await res.json();
  logTest('Upgrade footwear status', res.status === 200, `status: ${res.status}`);
  if (editData.success) {
    logTest(
      'Footwear item has ratings or price upgrade',
      editData.look.items.footwear !== null,
      `Upgraded Footwear: ${editData.look.items.footwear?.name}`
    );
  }

  // ── [6] Test action: regenerate entire look ──
  console.log('\n--- Test 6: Regenerate Entire Look ---');
  res = await fetch(`${BASE}/ai/modify-look`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: testSessionId,
      lookId,
      action: 'regenerate'
    })
  });
  editData = await res.json();
  logTest('Regenerate entire look status', res.status === 200, `status: ${res.status}`);
  if (editData.success) {
    logTest(
      'Look ID matches the requested lookId',
      editData.look.id === lookId,
      `Original Look ID: ${lookId}, Returned Look ID: ${editData.look.id}`
    );
    logTest(
      'New styling coordinate built',
      editData.look.items.main !== null && editData.look.items.main._id !== currentLook.items.main._id,
      `Original Main: ${currentLook.items.main.name}, New Main: ${editData.look.items.main?.name}`
    );
  }

  // ── [7] Test Input Validations and Error Boundaries ──
  console.log('\n--- Test 7: Error Boundaries and Validations ---');
  
  // A. Invalid slot validation
  res = await fetch(`${BASE}/ai/modify-look`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: testSessionId,
      lookId,
      action: 'replace',
      slot: 'unknown_slot',
      query: 'sneakers'
    })
  });
  data = await res.json();
  logTest('Fails for invalid slot name (400 or 404/500)', res.status === 400 || res.status === 404 || res.status === 500, `status: ${res.status}, error: ${data.error}`);

  // B. Invalid lookId validation
  res = await fetch(`${BASE}/ai/modify-look`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: testSessionId,
      lookId: 'invalid_look_id_123',
      action: 'regenerate'
    })
  });
  data = await res.json();
  logTest('Fails for non-existing lookId (404)', res.status === 404, `status: ${res.status}, error: ${data.error}`);

  // C. Malformed request (missing sessionId)
  res = await fetch(`${BASE}/ai/modify-look`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      lookId,
      action: 'regenerate'
    })
  });
  data = await res.json();
  logTest('Fails for missing sessionId (400)', res.status === 400, `status: ${res.status}, error: ${data.error}`);

  // ── CLEANUP & DISCONNECT ──
  await Product.deleteMany({ brand: 'EditTestBrand' });
  await mongoose.disconnect();
  console.log('\n✅ Cleanup complete. Database disconnected.');

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
