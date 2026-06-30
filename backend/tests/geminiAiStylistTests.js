import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

dotenv.config();

const BASE = 'http://localhost:5000/api';

async function run() {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('   StyleAI Phase 5.4A – Gemini Outfit Builder Integration Tests');
  console.log('═══════════════════════════════════════════════════════\n');

  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/styleai');
    console.log('✅ Connected to MongoDB directly for seeding.');
  } catch (err) {
    console.error('❌ DB connection failed.', err);
    process.exit(1);
  }

  // Seeding test products
  await Product.deleteMany({ brand: 'GeminiStylistBrand' });

  const productsToSeed = [
    {
      name: 'Gemini Pastel Lehenga',
      slug: 'gemini-pastel-lehenga',
      description: 'A traditional pastel dress for weddings.',
      brand: 'GeminiStylistBrand',
      category: 'Apparel',
      subCategory: 'Lehengas',
      material: 'Georgette',
      fit: 'Regular',
      gender: 'Women',
      price: 4500,
      originalPrice: 6000,
      images: ['http://example.com/lehenga.png'],
      sizes: ['S', 'M'],
      occasionTags: ['Wedding'],
      isActive: true
    },
    {
      name: 'Gemini Bright Red Sherwani',
      slug: 'gemini-bright-red-sherwani',
      description: 'Stunning bright red wedding sherwani.',
      brand: 'GeminiStylistBrand',
      category: 'Apparel',
      subCategory: 'Sherwanis',
      material: 'Silk',
      fit: 'Regular',
      gender: 'Men',
      price: 4999,
      originalPrice: 7000,
      images: ['http://example.com/sherwani.png'],
      sizes: ['L'],
      occasionTags: ['Wedding'],
      isActive: true
    },
    {
      name: 'Gemini Casual Blue Jeans',
      slug: 'gemini-casual-blue-jeans',
      description: 'Daily wear blue denim jeans.',
      brand: 'GeminiStylistBrand',
      category: 'Apparel',
      subCategory: 'Jeans',
      material: 'Denim',
      fit: 'Regular',
      gender: 'Unisex',
      price: 1500,
      originalPrice: 2000,
      images: ['http://example.com/jeans.png'],
      sizes: ['32'],
      occasionTags: ['Casual'],
      isActive: true
    },
    {
      name: 'Gemini Wedding Jutti',
      slug: 'gemini-wedding-jutti',
      description: 'Traditional wedding footwear.',
      brand: 'GeminiStylistBrand',
      category: 'Footwear',
      subCategory: 'Juttis',
      material: 'Leather',
      fit: 'Regular',
      gender: 'Women',
      price: 800,
      originalPrice: 1200,
      images: ['http://example.com/jutti.png'],
      sizes: ['7', '8'],
      occasionTags: ['Wedding'],
      isActive: true
    },
    {
      name: 'Gemini Gold Clutch',
      slug: 'gemini-gold-clutch',
      description: 'Golden accessory for weddings.',
      brand: 'GeminiStylistBrand',
      category: 'Accessories',
      subCategory: 'Handbags',
      material: 'Metal',
      fit: 'Regular',
      gender: 'Women',
      price: 600,
      originalPrice: 1000,
      images: ['http://example.com/clutch.png'],
      sizes: ['One Size'],
      occasionTags: ['Wedding'],
      isActive: true
    },
    {
      name: 'Gemini Velvet Shawl',
      slug: 'gemini-velvet-shawl',
      description: 'A velvet layer shawl for weddings.',
      brand: 'GeminiStylistBrand',
      category: 'Apparel',
      subCategory: 'Shawls',
      material: 'Velvet',
      fit: 'Regular',
      gender: 'Women',
      price: 1000,
      originalPrice: 1500,
      images: ['http://example.com/shawl.png'],
      sizes: ['One Size'],
      occasionTags: ['Wedding'],
      isActive: true
    }
  ];

  await Product.create(productsToSeed);
  console.log('✅ Seeded test products successfully.');

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

  const sessionId = 'test-session-' + Date.now();

  // ── Test 1: Typing "Hi" (should return friendly greeting, no product search) ──
  let res = await fetch(`${BASE}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Hi', sessionId })
  });
  let data = await res.json();
  logTest('POST /api/ai/chat (Greeting "Hi")', res.status === 200, `status: ${res.status}`);
  if (data.success) {
    logTest('Greeting returns empty product array', data.products.length === 0, `products count: ${data.products.length}`);
    logTest('Greeting returns empty looks array', Array.isArray(data.looks) && data.looks.length === 0, `looks count: ${data.looks?.length}`);
    logTest('Greeting returns stylist response text', typeof data.response === 'string' && data.response.length > 0, `response: "${data.response}"`);
  }

  // ── Test 2: Set color preference "I like pastel colors." ──
  res = await fetch(`${BASE}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'I like pastel colors.', sessionId })
  });
  data = await res.json();
  logTest('POST /api/ai/chat (Prefer pastel colors)', res.status === 200, `status: ${res.status}`);
  if (data.success) {
    const hasPastel = data.intent.colors.some(c => c.toLowerCase().includes('pastel'));
    logTest('Memory successfully tracks pastel colors preference', hasPastel, `colors: ${JSON.stringify(data.intent.colors)}`);
    logTest('Preference turn returns empty looks array', Array.isArray(data.looks) && data.looks.length === 0, `looks count: ${data.looks?.length}`);
    logTest('Preference turn returns empty products array', Array.isArray(data.products) && data.products.length === 0, `products count: ${data.products?.length}`);
  }

  // ── Test 3: Follow up with "Need a pastel wedding outfit under 6000 for a woman" ──
  res = await fetch(`${BASE}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Need a pastel wedding outfit under 6000 for a woman', sessionId })
  });
  data = await res.json();
  logTest('POST /api/ai/chat (Wedding outfit request)', res.status === 200, `status: ${res.status}`);
  if (data.success) {
    logTest('looks exists and is an array', Array.isArray(data.looks), `looks is array: ${Array.isArray(data.looks)}`);
    logTest('at least one look exists', data.looks.length > 0, `looks count: ${data.looks.length}`);
    
    if (data.looks.length > 0) {
      const firstLook = data.looks[0];
      logTest('first look has id', typeof firstLook.id === 'string' && firstLook.id.length > 0, `id: ${firstLook.id}`);
      logTest('first look has title', typeof firstLook.title === 'string' && firstLook.title.length > 0, `title: ${firstLook.title}`);
      logTest('first look has stylistNote', typeof firstLook.stylistNote === 'string' && firstLook.stylistNote.length > 0, `stylistNote: ${firstLook.stylistNote}`);
      logTest('first look has totalPrice', typeof firstLook.totalPrice === 'number' && firstLook.totalPrice > 0, `totalPrice: ${firstLook.totalPrice}`);
      logTest('first look has items.main', !!firstLook.items?.main, `main exists: ${!!firstLook.items?.main}`);
      
      // Check projection fields for main
      const mainKeys = Object.keys(firstLook.items.main).sort();
      const expectedKeys = ['_id', 'name', 'slug', 'price', 'images', 'category', 'brand'].sort();
      logTest('slot products contain only minimal product fields', JSON.stringify(mainKeys) === JSON.stringify(expectedKeys), `keys: ${mainKeys.join(', ')}`);
      
      // Check that products is unique union of look slot products
      const unionIds = new Set();
      data.looks.forEach(look => {
        ['main', 'footwear', 'accessory', 'layer'].forEach(slot => {
          const item = look.items[slot];
          if (item) unionIds.add(item._id.toString());
        });
      });
      const prodIds = data.products.map(p => p._id.toString());
      const allIncluded = prodIds.every(id => unionIds.has(id)) && unionIds.size === prodIds.length;
      logTest('products is unique union of products used in looks', allIncluded, `products count: ${prodIds.length}, looks union size: ${unionIds.size}`);
    }
  }

  // ── Test 4: Malformed queries validation ──
  res = await fetch(`${BASE}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  data = await res.json();
  logTest('Validation fails on missing query message (400)', res.status === 400, `status: ${res.status}, error: ${data.error}`);

  // ── Test 5: Fallback extraction (Simulate invalid Gemini API key) ──
  const originalKey = process.env.GEMINI_API_KEY;
  process.env.GEMINI_API_KEY = ''; 

  res = await fetch(`${BASE}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Need a wedding outfit under 6000 for a woman', sessionId: 'fallback-session' })
  });
  data = await res.json();
  logTest('Fallback API works when key is unconfigured (200)', res.status === 200, `status: ${res.status}`);
  if (data.success) {
    logTest('Fallback extracts occasion "Wedding"', data.intent.occasion === 'Wedding', `occasion: ${data.intent.occasion}`);
    logTest('Fallback extracts gender "Female"', data.intent.gender === 'Female', `gender: ${data.intent.gender}`);
    logTest('Fallback extracts budget 6000', data.intent.budget === 6000, `budget: ${data.intent.budget}`);
    logTest('Fallback flag is returned in payload', data.fallback === true, `fallback: ${data.fallback}`);
  }

  // Restore API key
  process.env.GEMINI_API_KEY = originalKey;

  // ── Cleanup ──
  await Product.deleteMany({ brand: 'GeminiStylistBrand' });
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
