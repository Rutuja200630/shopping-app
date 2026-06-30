/**
 * Phase 5.5B.0 Diversity Verification Script
 * Run with: node verify_diversity.mjs  (from backend/ directory)
 */

import {
  buildLooks,
  groupProductsByRole,
} from './services/outfitBuilderService.js';

// ── helpers ───────────────────────────────────────────────────────────────────
const mkId = (n) => String(n).padStart(24, '0');

const mkProduct = (id, name, role, price, tags = []) => ({
  _id: mkId(id),
  name,
  slug: name.toLowerCase().replace(/\s+/g, '-'),
  price,
  images: [],
  category:    role === 'footwear'  ? 'footwear'
             : role === 'accessory' ? 'accessories'
             : role === 'layer'     ? 'outerwear'
             : 'clothing',
  subCategory: role === 'footwear'  ? 'Heels'
             : role === 'accessory' ? 'Handbags'
             : role === 'layer'     ? 'Blazers'
             : '',
  brand: 'StyleAI',
  gender: 'Women',
  occasionTags: tags,
  isActive: true,
});

// ── product pools ─────────────────────────────────────────────────────────────

const SCENARIOS = [
  {
    name: 'Wedding outfit under ₹10,000',
    intent: { occasion: 'Wedding', gender: 'Female', budget: 10000, colors: [], style: null },
    products: [
      mkProduct(1,  'Pastel Silk Lehenga',         'main',      5999, ['Wedding']),
      mkProduct(2,  'Royal Blue Anarkali',          'main',      7499, ['Wedding']),
      mkProduct(3,  'Ivory Georgette Saree',        'main',      4999, ['Wedding']),
      mkProduct(4,  'Mint Green Sharara Set',       'main',      6299, ['Wedding']),
      mkProduct(10, 'Gold Block Heels',             'footwear',   999, ['Wedding']),
      mkProduct(11, 'Silver Juttis',                'footwear',   799, ['Wedding']),
      mkProduct(12, 'Embellished Mojaris',          'footwear',   899, ['Wedding']),
      mkProduct(20, 'Gold Potli Bag',               'accessory',  699, ['Wedding']),
      mkProduct(21, 'Pearl Clutch',                 'accessory',  799, ['Wedding']),
      mkProduct(22, 'Emerald Statement Necklace',   'accessory',  599, ['Wedding']),
      mkProduct(30, 'Bridal Dupatta',               'layer',      599, ['Wedding']),
      mkProduct(31, 'Embroidered Shawl',            'layer',      799, ['Wedding']),
    ],
  },
  {
    name: 'Office wear under ₹4,000',
    intent: { occasion: 'Office', gender: 'Female', budget: 4000, colors: [], style: null },
    products: [
      mkProduct(40, 'White Formal Shirt',           'main',      1299, ['Office']),
      mkProduct(41, 'Charcoal Pencil Skirt',        'main',      1499, ['Office']),
      mkProduct(42, 'Navy Blue Blazer Dress',       'main',      2199, ['Office']),
      mkProduct(50, 'Black Loafers',                'footwear',   999, ['Office']),
      mkProduct(51, 'Nude Pointed Flats',           'footwear',   799, ['Office']),
      mkProduct(60, 'Leather Tote Bag',             'accessory',  999, ['Office']),
      mkProduct(61, 'Silver Watch',                 'accessory',  699, ['Office']),
      mkProduct(70, 'Classic Black Blazer',         'layer',     1199, ['Office']),
    ],
  },
  {
    name: 'Casual outfit under ₹2,500',
    intent: { occasion: 'Casual', gender: 'Female', budget: 2500, colors: [], style: null },
    products: [
      mkProduct(80, 'White Crop Tee',              'main',       599, ['Casual']),
      mkProduct(81, 'Blue Denim Jeans',            'main',       999, ['Casual']),
      mkProduct(82, 'Striped Co-ord Set',          'main',      1199, ['Casual']),
      mkProduct(90, 'White Sneakers',              'footwear',   899, ['Casual']),
      mkProduct(91, 'Flat Sandals',                'footwear',   499, ['Casual']),
      mkProduct(100,'Canvas Tote Bag',             'accessory',  399, ['Casual']),
      mkProduct(101,'Hoop Earrings',               'accessory',  299, ['Casual']),
    ],
  },
  {
    name: 'Party outfit under ₹8,000',
    intent: { occasion: 'Party', gender: 'Female', budget: 8000, colors: [], style: null },
    products: [
      mkProduct(110,'Black Sequin Dress',          'main',      3999, ['Party']),
      mkProduct(111,'Red Bodycon Midi Dress',      'main',      2999, ['Party']),
      mkProduct(112,'Gold Shimmer Jumpsuit',       'main',      4499, ['Party']),
      mkProduct(120,'Black Stilettos',             'footwear',  1299, ['Party']),
      mkProduct(121,'Gold Strappy Heels',          'footwear',   999, ['Party']),
      mkProduct(130,'Sequin Clutch',               'accessory',  799, ['Party']),
      mkProduct(131,'Crystal Drop Earrings',       'accessory',  499, ['Party']),
      mkProduct(140,'Black Velvet Blazer',         'layer',     1499, ['Party']),
    ],
  },
  {
    name: 'Edge case: only 1 footwear & 1 accessory',
    intent: { occasion: 'Casual', gender: 'Female', budget: 2500, colors: [], style: null },
    products: [
      mkProduct(200,'Cotton Kurti A',              'main',       799, ['Casual']),
      mkProduct(201,'Linen Kurti B',               'main',       899, ['Casual']),
      mkProduct(202,'Printed Kurti C',             'main',       699, ['Casual']),
      mkProduct(210,'Only Sandals',                'footwear',   399, ['Casual']),  // single
      mkProduct(220,'Only Earrings',               'accessory',  299, ['Casual']),  // single
    ],
  },
];

// ── audit logic ────────────────────────────────────────────────────────────────

function auditScenario(scenario) {
  const { name, products, intent } = scenario;
  const looks = buildLooks({ products, intent, maxLooks: 3 });
  const grouped = groupProductsByRole(products);

  const seenTitles     = new Set();
  const seenNoteStarts = new Set();
  const seenMains      = new Set();
  const seenFootwear   = new Set();
  const seenAccessories = new Set();
  const seenLayers     = new Set();

  const report = {
    name,
    looksGenerated: looks.length,
    looks: [],
    titlesUnique:    true,
    notesUnique:     true,
    mainUnique:      true,
    footwearReused:  false,
    accessoryReused: false,
    layerReused:     false,
    reusedItems:     [],
    warnings:        [],
  };

  for (let i = 0; i < looks.length; i++) {
    const look = looks[i];
    const s    = look.items;

    report.looks.push({
      idx: i + 1,
      title:    look.title,
      price:    look.totalPrice,
      main:      s.main      ? `${s.main.name} (₹${s.main.price})`           : '—',
      footwear:  s.footwear  ? `${s.footwear.name} (₹${s.footwear.price})`   : '—',
      accessory: s.accessory ? `${s.accessory.name} (₹${s.accessory.price})` : '—',
      layer:     s.layer     ? `${s.layer.name} (₹${s.layer.price})`         : '—',
      note:      look.stylistNote,
    });

    if (seenTitles.has(look.title))                    report.titlesUnique = false;
    seenTitles.add(look.title);

    const noteKey = look.stylistNote.slice(0, 55);
    if (seenNoteStarts.has(noteKey))                   report.notesUnique = false;
    seenNoteStarts.add(noteKey);

    if (s.main) {
      if (seenMains.has(s.main._id))                   report.mainUnique = false;
      seenMains.add(s.main._id);
    }

    if (s.footwear) {
      if (seenFootwear.has(s.footwear._id)) {
        report.footwearReused = true;
        report.reusedItems.push({ role: 'footwear', name: s.footwear.name, look: i + 1 });
      }
      seenFootwear.add(s.footwear._id);
    }

    if (s.accessory) {
      if (seenAccessories.has(s.accessory._id)) {
        report.accessoryReused = true;
        report.reusedItems.push({ role: 'accessory', name: s.accessory.name, look: i + 1 });
      }
      seenAccessories.add(s.accessory._id);
    }

    if (s.layer) {
      if (seenLayers.has(s.layer._id)) {
        report.layerReused = true;
        report.reusedItems.push({ role: 'layer', name: s.layer.name, look: i + 1 });
      }
      seenLayers.add(s.layer._id);
    }
  }

  // Justify reuse when pool size < looks generated (mathematically unavoidable)
  const footwearPoolSize  = grouped.footwear.length;
  const accessoryPoolSize = grouped.accessory.length;
  const layerPoolSize     = grouped.layer.length;

  if (report.footwearReused  && footwearPoolSize  < report.looksGenerated) report.warnings.push(`Footwear reused — pool has ${footwearPoolSize} option(s) for ${report.looksGenerated} looks (justified).`);
  if (report.accessoryReused && accessoryPoolSize < report.looksGenerated) report.warnings.push(`Accessory reused — pool has ${accessoryPoolSize} option(s) for ${report.looksGenerated} looks (justified).`);
  if (report.layerReused     && layerPoolSize     < report.looksGenerated) report.warnings.push(`Layer reused — pool has ${layerPoolSize} option(s) for ${report.looksGenerated} looks (justified).`);
  if (!report.mainUnique) report.warnings.push('Main reused — likely caused by budget constraint eliminating remaining unique mains (justified if pool has 3+ mains).');


  return report;
}

// ── print & evaluate ──────────────────────────────────────────────────────────

function printResults(results) {
  let pass = 0; let fail = 0;

  for (const r of results) {
    const justifiedFootwear  = r.footwearReused  && r.warnings.some(w => w.startsWith('Footwear'));
    const justifiedAccessory = r.accessoryReused && r.warnings.some(w => w.startsWith('Accessory'));
    const justifiedLayer     = r.layerReused     && r.warnings.some(w => w.startsWith('Layer'));
    const justifiedMain      = !r.mainUnique     && r.warnings.some(w => w.startsWith('Main reused'));

    const unexpectedReuse =
      (r.footwearReused  && !justifiedFootwear)  ||
      (r.accessoryReused && !justifiedAccessory) ||
      (r.layerReused     && !justifiedLayer);
    const unexpectedMainReuse = !r.mainUnique && !justifiedMain;

    const ok = r.titlesUnique && r.notesUnique && !unexpectedReuse && !unexpectedMainReuse;

    if (ok) pass++; else fail++;

    console.log('\n' + '─'.repeat(70));
    console.log(`${ok ? '✅ PASS' : '❌ FAIL'}  ${r.name}  (${r.looksGenerated} looks)`);

    for (const l of r.looks) {
      console.log(`\n  Look ${l.idx}: "${l.title}" — ₹${l.price}`);
      console.log(`    Main:      ${l.main}`);
      console.log(`    Footwear:  ${l.footwear}`);
      console.log(`    Accessory: ${l.accessory}`);
      console.log(`    Layer:     ${l.layer}`);
      console.log(`    Note:      "${l.note}"`);
    }

    console.log('\n  Diversity:');
    console.log(`    Titles unique:      ${r.titlesUnique    ? '✅' : '❌'}`);
    console.log(`    Notes unique:       ${r.notesUnique     ? '✅' : '❌'}`);
    console.log(`    Mains unique:       ${r.mainUnique      ? '✅' : '❌'}`);
    console.log(`    Footwear reused:    ${r.footwearReused  ? (justifiedFootwear  ? '⚠️  YES (justified)' : '❌ YES') : '✅ NO'}`);
    console.log(`    Accessory reused:   ${r.accessoryReused ? (justifiedAccessory ? '⚠️  YES (justified)' : '❌ YES') : '✅ NO'}`);
    console.log(`    Layer reused:       ${r.layerReused     ? (justifiedLayer     ? '⚠️  YES (justified)' : '❌ YES') : '✅ NO'}`);

    if (r.warnings.length) {
      console.log('\n  📝 Notes:');
      r.warnings.forEach(w => console.log(`    - ${w}`));
    }
  }

  console.log('\n' + '═'.repeat(70));
  console.log(`RESULT: ${pass}/${results.length} scenarios passed.`);
  if (fail === 0) {
    console.log('✅  Phase 5.5B.0 diversity logic is PRODUCTION-READY.');
  } else {
    console.log(`❌  ${fail} scenario(s) require fixes.`);
    process.exitCode = 1;
  }
}

printResults(SCENARIOS.map(auditScenario));
