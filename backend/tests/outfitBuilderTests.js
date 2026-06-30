import mongoose from 'mongoose';
import {
  classifyProductRole,
  groupProductsByRole,
  scoreProductForIntent,
  sortProductsForRole,
  pickBestCompatibleItem,
  toMinimalProduct,
  buildSingleLook,
  buildLooks
} from '../services/outfitBuilderService.js';

async function run() {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('   StyleAI Phase 5.4A – Outfit Builder Unit Tests');
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

  // ── [1] Test classifyProductRole ──
  console.log('--- Test Group 1: classifyProductRole ---');
  
  logTest(
    'Classify Lehenga as main',
    classifyProductRole({ subCategory: 'Lehenga' }) === 'main',
    classifyProductRole({ subCategory: 'Lehenga' })
  );
  logTest(
    'Classify heels as footwear',
    classifyProductRole({ name: 'Embellished Golden Heels' }) === 'footwear',
    classifyProductRole({ name: 'Embellished Golden Heels' })
  );
  logTest(
    'Classify clutch as accessory',
    classifyProductRole({ subCategory: 'Handbags', name: 'Potli Clutch' }) === 'accessory',
    classifyProductRole({ subCategory: 'Handbags', name: 'Potli Clutch' })
  );
  logTest(
    'Classify blazer as layer',
    classifyProductRole({ subCategory: 'Blazers' }) === 'layer',
    classifyProductRole({ subCategory: 'Blazers' })
  );
  logTest(
    'Classify ambiguous items as main',
    classifyProductRole({ subCategory: 'Trousers' }) === 'main',
    classifyProductRole({ subCategory: 'Trousers' })
  );

  // ── [2] Test groupProductsByRole ──
  console.log('\n--- Test Group 2: groupProductsByRole ---');
  const mockProductList = [
    { _id: '1', subCategory: 'Lehenga' },
    { _id: '2', subCategory: 'Heels' },
    { _id: '3', subCategory: 'Watches' },
    { _id: '4', subCategory: 'Blazers' }
  ];
  const grouped = groupProductsByRole(mockProductList);
  logTest('Grouped main length is 1', grouped.main.length === 1, `length: ${grouped.main.length}`);
  logTest('Grouped footwear length is 1', grouped.footwear.length === 1, `length: ${grouped.footwear.length}`);
  logTest('Grouped accessory length is 1', grouped.accessory.length === 1, `length: ${grouped.accessory.length}`);
  logTest('Grouped layer length is 1', grouped.layer.length === 1, `length: ${grouped.layer.length}`);

  // ── [3] Test scoreProductForIntent ──
  console.log('\n--- Test Group 3: scoreProductForIntent ---');
  const weddingIntent = { occasion: 'Wedding', gender: 'Female', budget: 6000, colors: ['Pastel'], style: 'Traditional' };
  
  const lehengaDoc = {
    name: 'Pastel Lehenga',
    isActive: true,
    inventory: 5,
    gender: 'Women',
    price: 4500,
    colors: ['Pastel', 'Pink'],
    occasionTags: ['Wedding']
  };
  const hoodieDoc = {
    name: 'Grey Casual Hoodie',
    isActive: true,
    inventory: 10,
    gender: 'Unisex',
    price: 2000,
    colors: ['Grey'],
    occasionTags: ['Casual']
  };
  
  const lehengaScore = scoreProductForIntent(lehengaDoc, weddingIntent, 'main');
  const hoodieScore = scoreProductForIntent(hoodieDoc, weddingIntent, 'main');
  
  logTest(
    'Wedding lehenga scores higher than casual hoodie for wedding intent',
    lehengaScore > hoodieScore,
    `lehenga: ${lehengaScore}, hoodie: ${hoodieScore}`
  );
  
  // Test active status guard
  const inactiveLehenga = { ...lehengaDoc, isActive: false };
  const inactiveScore = scoreProductForIntent(inactiveLehenga, weddingIntent, 'main');
  logTest('Inactive item receives heavy penalty', inactiveScore === -1000, `score: ${inactiveScore}`);

  // Test zero inventory guard
  const zeroStockLehenga = { ...lehengaDoc, inventory: 0 };
  const zeroStockScore = scoreProductForIntent(zeroStockLehenga, weddingIntent, 'main');
  logTest('Zero stock item receives heavy penalty', zeroStockScore === -1000, `score: ${zeroStockScore}`);

  // ── [4] Test buildLooks ──
  console.log('\n--- Test Group 4: buildLooks ---');
  
  const main1 = { _id: new mongoose.Types.ObjectId('6a2f97cb07805bf53ccf7951'), name: 'Wedding Lehenga', price: 4000, subCategory: 'Lehenga', gender: 'Women', occasionTags: ['Wedding'], isActive: true, inventory: 10 };
  const main2 = { _id: new mongoose.Types.ObjectId('6a2f97cb07805bf53ccf7952'), name: 'Banarasi Saree', price: 3000, subCategory: 'Saree', gender: 'Women', occasionTags: ['Wedding'], isActive: true, inventory: 5 };
  const foot1 = { _id: new mongoose.Types.ObjectId('6a2f97cb07805bf53ccf7953'), name: 'Wedding Heels', price: 1000, subCategory: 'Heels', gender: 'Women', occasionTags: ['Wedding'], isActive: true, inventory: 8 };
  const acc1 = { _id: new mongoose.Types.ObjectId('6a2f97cb07805bf53ccf7954'), name: 'Gold Clutch', price: 800, subCategory: 'Handbags', gender: 'Women', occasionTags: ['Wedding'], isActive: true, inventory: 12 };
  const layer1 = { _id: new mongoose.Types.ObjectId('6a2f97cb07805bf53ccf7955'), name: 'Velvet Shawl', price: 1200, subCategory: 'Shawls', gender: 'Women', occasionTags: ['Wedding'], isActive: true, inventory: 4 };

  const productsPool = [main1, main2, foot1, acc1, layer1];
  
  // Test Case: Under 6000 budget
  const budgetIntent = { occasion: 'Wedding', gender: 'Female', budget: 6000 };
  const looks = buildLooks({ products: productsPool, intent: budgetIntent, maxLooks: 3 });

  logTest('Returns 2 looks', looks.length === 2, `looks count: ${looks.length}`);
  if (looks.length > 0) {
    const first = looks[0];
    logTest('Every look has main populated', !!first.items.main, `main name: ${first.items.main?.name}`);
    logTest('Look totalPrice is computed correctly', first.totalPrice === first.items.main.price + (first.items.footwear?.price || 0) + (first.items.accessory?.price || 0) + (first.items.layer?.price || 0), `totalPrice: ${first.totalPrice}`);
    logTest('Budget constraint respected (totalPrice <= 6000)', first.totalPrice <= 6000, `price: ${first.totalPrice}`);
  }

  // Test Case: Extreme budget (only main Saree should be styled, Heels should fit, clutch/shawl omitted)
  const tightBudgetIntent = { occasion: 'Wedding', gender: 'Female', budget: 4200 };
  const tightLooks = buildLooks({ products: productsPool, intent: tightBudgetIntent });
  
  if (tightLooks.length > 0) {
    const sareeLook = tightLooks.find(l => l.items.main.name === 'Banarasi Saree');
    if (sareeLook) {
      logTest('Omit items that exceed remaining budget', sareeLook.totalPrice <= 4200, `saree look total: ${sareeLook.totalPrice}`);
    }
  }

  // Test Case: Empty main pool
  const emptyLooks = buildLooks({ products: [foot1, acc1], intent: budgetIntent });
  logTest('Returns empty looks array when no valid main items exist', emptyLooks.length === 0, `looks count: ${emptyLooks.length}`);

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
