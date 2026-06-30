import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { extractBudget, extractGender, extractOccasion, parseUserIntent, buildStylistMessage } from '../controllers/aiController.js';

dotenv.config();

const BASE = 'http://localhost:5000/api';

async function run() {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('   StyleAI Phase 5 – AI Stylist API Test Suite');
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

  // ── [A] UNIT TESTS FOR INTENT EXTRACTION HELPERS ──
  console.log('--- [A] Testing Intent Extraction Helpers ---');

  // 1. Budget extraction
  logTest('extractBudget("Need wedding wear under ₹5000")', extractBudget('Need wedding wear under ₹5000') === 5000, `budget: ${extractBudget('Need wedding wear under ₹5000')}`);
  logTest('extractBudget("below 1500 for college")', extractBudget('below 1500 for college') === 1500, `budget: ${extractBudget('below 1500 for college')}`);
  logTest('extractBudget("budget of Rs 2500")', extractBudget('budget of Rs 2500') === 2500, `budget: ${extractBudget('budget of Rs 2500')}`);
  logTest('extractBudget("casual style shirt")', extractBudget('casual style shirt') === null, `budget: ${extractBudget('casual style shirt')}`);

  // 2. Gender extraction
  logTest('extractGender("outfit for a woman")', extractGender('outfit for a woman') === 'Female', `gender: ${extractGender('outfit for a woman')}`);
  logTest('extractGender("clothing for guys")', extractGender('clothing for guys') === 'Male', `gender: ${extractGender('clothing for guys')}`);
  logTest('extractGender("unisex shoes")', extractGender('unisex shoes') === 'Unisex', `gender: ${extractGender('unisex shoes')}`);
  logTest('extractGender("wedding party clothes")', extractGender('wedding party clothes') === null, `gender: ${extractGender('wedding party clothes')}`);

  // 3. Occasion extraction
  logTest('extractOccasion("Need a wedding dress")', extractOccasion('Need a wedding dress') === 'Wedding', `occasion: ${extractOccasion('Need a wedding dress')}`);
  logTest('extractOccasion("party wear shoes")', extractOccasion('party wear shoes') === 'Party', `occasion: ${extractOccasion('party wear shoes')}`);
  logTest('extractOccasion("festive kurta")', extractOccasion('festive kurta') === 'Festive', `occasion: ${extractOccasion('festive kurta')}`);
  logTest('extractOccasion("office shirt under 2000")', extractOccasion('office shirt under 2000') === 'Office', `occasion: ${extractOccasion('office shirt under 2000')}`);
  logTest('extractOccasion("something for a dinner date")', extractOccasion('something for a dinner date') === 'Date Night', `occasion: ${extractOccasion('something for a dinner date')}`);

  // 4. Intent parsing wrapper
  const intent = parseUserIntent('Need a wedding outfit under ₹5000 for a woman');
  logTest(
    'parseUserIntent("Need a wedding outfit under ₹5000 for a woman")',
    intent.occasion === 'Wedding' && intent.gender === 'Female' && intent.budget === 5000,
    `intent: ${JSON.stringify(intent)}`
  );

  // 5. Stylist message generation
  const msg = buildStylistMessage(intent);
  const containsWedding = msg.includes('Wedding');
  const containsWomen = msg.includes('women');
  const containsBudget = msg.includes('₹5000');
  logTest('buildStylistMessage generates descriptive reasons', containsWedding && containsWomen && containsBudget, `msg: ${msg}`);

  // ── [B] INTEGRATION TESTS FOR ENDPOINTS ──
  console.log('\n--- [B] Testing Database Recommendations Endpoint ---');

  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/styleai');
    console.log('✅ Connected to MongoDB directly for seeding.');
  } catch (err) {
    console.error('❌ DB connection failed.', err);
    process.exit(1);
  }

  // Clear previous test products
  await Product.deleteMany({ brand: 'AIStylistBrand' });

  // Seed test products matching different requirements
  const productsToSeed = [
    {
      name: 'AIStylist Wedding Kurta',
      slug: 'aistylist-wedding-kurta',
      description: 'Elegant ethnic wedding wear.',
      brand: 'AIStylistBrand',
      category: 'Apparel',
      subCategory: 'Kurtas',
      material: 'Silk',
      fit: 'Regular',
      gender: 'Women',
      price: 3500,
      originalPrice: 5000,
      images: ['http://example.com/kurta.png'],
      sizes: ['M'],
      occasionTags: ['Wedding', 'Festive'],
      isActive: true
    },
    {
      name: 'AIStylist Expensive Wedding Dress',
      slug: 'aistylist-expensive-wedding-dress',
      description: 'Designer wedding gown.',
      brand: 'AIStylistBrand',
      category: 'Apparel',
      subCategory: 'Dresses',
      material: 'Satin',
      fit: 'Slim',
      gender: 'Women',
      price: 7500, // over budget
      originalPrice: 9000,
      images: ['http://example.com/dress.png'],
      sizes: ['S'],
      occasionTags: ['Wedding'],
      isActive: true
    },
    {
      name: 'AIStylist Inactive Wedding Kurta',
      slug: 'aistylist-inactive-wedding-kurta',
      description: 'Wedding wear kurta (inactive).',
      brand: 'AIStylistBrand',
      category: 'Apparel',
      subCategory: 'Kurtas',
      material: 'Silk',
      fit: 'Regular',
      gender: 'Women',
      price: 2500,
      originalPrice: 4000,
      images: ['http://example.com/kurta-inactive.png'],
      sizes: ['M'],
      occasionTags: ['Wedding'],
      isActive: false // Inactive
    },
    {
      name: 'AIStylist Men Wedding Sherwani',
      slug: 'aistylist-men-wedding-sherwani',
      description: 'Wedding sherwani for men.',
      brand: 'AIStylistBrand',
      category: 'Apparel',
      subCategory: 'Sherwanis',
      material: 'Silk',
      fit: 'Slim',
      gender: 'Men', // wrong gender for female query
      price: 4500,
      originalPrice: 6000,
      images: ['http://example.com/sherwani.png'],
      sizes: ['XL'],
      occasionTags: ['Wedding'],
      isActive: true
    },
    {
      name: 'AIStylist Unisex Casual Tee',
      slug: 'aistylist-unisex-casual-tee',
      description: 'Comfortable everyday unisex tee.',
      brand: 'AIStylistBrand',
      category: 'Apparel',
      subCategory: 'T-Shirts',
      material: 'Cotton',
      fit: 'Relaxed',
      gender: 'Unisex', // Should match Female/Male queries
      price: 499,
      originalPrice: 999,
      images: ['http://example.com/tee.png'],
      sizes: ['L'],
      occasionTags: ['Casual'],
      isActive: true
    }
  ];

  await Product.create(productsToSeed);
  console.log('✅ Seeded test products successfully.');

  // 1. Query wedding outfit under 5000 for a woman
  let res = await fetch(`${BASE}/ai/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'Need a wedding outfit under ₹5000 for a woman' })
  });
  let data = await res.json();
  logTest('POST /api/ai/recommend status', res.status === 200, `status: ${res.status}`);
  if (data.success) {
    logTest('filters are correctly parsed', data.filters.occasion === 'Wedding' && data.filters.gender === 'Female' && data.filters.budget === 5000, `filters: ${JSON.stringify(data.filters)}`);
    logTest('stylistMessage is populated', typeof data.stylistMessage === 'string' && data.stylistMessage.length > 10, `message: ${data.stylistMessage}`);
    
    const names = data.products.map(p => p.name);
    const hasKurta = names.includes('AIStylist Wedding Kurta');
    const hasExpensive = names.includes('AIStylist Expensive Wedding Dress');
    const hasInactive = names.includes('AIStylist Inactive Wedding Kurta');
    const hasSherwani = names.includes('AIStylist Men Wedding Sherwani');

    logTest('Matched products verify active, budget and gender restrictions', hasKurta && !hasExpensive && !hasInactive && !hasSherwani, `Returned products: ${names.join(', ')}`);
  }

  // 2. Query casual outfit for a woman
  res = await fetch(`${BASE}/ai/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'casual outfit for a woman' })
  });
  data = await res.json();
  if (data.success) {
    const names = data.products.map(p => p.name);
    const hasUnisexTee = names.includes('AIStylist Unisex Casual Tee');
    logTest('Unisex products are returned for Female query requests', hasUnisexTee, `Returned casual items: ${names.join(', ')}`);
  }

  // 3. Output projections check
  if (data.success && data.products.length > 0) {
    const p = data.products[0];
    const keys = Object.keys(p).sort();
    const expectedKeys = ['_id', 'name', 'slug', 'price', 'images', 'category', 'brand'].sort();
    logTest(
      'Projections match required fields exactly',
      JSON.stringify(keys) === JSON.stringify(expectedKeys),
      `Sample product keys: ${keys.join(', ')}`
    );
  }

  // 4. Missing query parameter error handling
  res = await fetch(`${BASE}/ai/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  data = await res.json();
  logTest('Validation fails on missing query (400)', res.status === 400, `status: ${res.status}, error: ${data.error}`);

  // ── Cleanup ──
  await Product.deleteMany({ brand: 'AIStylistBrand' });
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
