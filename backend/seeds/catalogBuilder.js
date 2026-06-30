import fs from 'fs';
import path from 'path';

// ── COLLECTIONS FOR GENERATION ──────────────────────────────────────────────
const BRANDS = [
  'StyleAI Premium', 'Urban Denim', 'Executive Wear', 'StyleAI Streetwear', 
  'StyleAI Essentials', 'Royal Heritage', 'Graceful', 'Urban Ethnic', 'Zara', 'Nike', 'Puma'
];

const COLORS = [
  'Pink', 'Gold', 'Black', 'White', 'Green', 'Red', 'Blue', 'Navy Blue', 
  'Charcoal Grey', 'Light Blue', 'Beige', 'Burgundy', 'Yellow', 'Peach', 
  'Orange', 'Maroon', 'Khaki', 'Dark Brown', 'Silver'
];

const MATERIALS = [
  'Silk', 'Georgette', 'Cotton', 'Wool Blend', 'Polyester Blend', 'Denim Cotton', 
  'Cotton Fleece', 'Rayon', 'Satin Silk', 'Polyester Sequin', 'Linen', 
  'Acrylic Wool', 'Suede Leather', 'Pique Cotton', 'Synthetic Leather', 'Genuine Leather'
];

const FITS = ['Regular', 'Slim Fit', 'Oversized', 'Loose Fit'];

const OCCASIONS = [
  'Wedding', 'Reception', 'Mehendi', 'Haldi', 'Sangeet', 'Festive', 'Office', 
  'College', 'Casual', 'Date Night', 'Party', 'Vacation', 'Airport', 'Travel', 
  'Gym', 'Winter', 'Summer', 'Traditional', 'Formal', 'Daily Wear'
];

// High-quality verified Unsplash Fashion Photo IDs
const UNSPLASH_IMAGES = {
  ethnic_women: [
    'photo-1610030469983-98e550d6193c', 'photo-1583391733956-3750e0ff4e8b', 
    'photo-1617627143750-d86bc21e42bb', 'photo-1617627143750-d86bc21e42bb',
    'photo-1618932260643-eee4a2f652a6', 'photo-1488426862026-3ee34a7d66df'
  ],
  dress_women: [
    'photo-1595777457583-95e059d581b8', 'photo-1566174053879-31528523f8ae', 
    'photo-1529139574466-a303027c1d8b', 'photo-1494790108377-be9c29b29330', 
    'photo-1496747611176-843222e1e57c', 'photo-1515886657613-9f3515b0c78f',
    'photo-1485968579580-b6d095142e6e', 'photo-1509631179647-0177331693ae'
  ],
  tops_women: [
    'photo-1503342217505-b0a15ec3261c', 'photo-1554412933-514a83d2f3c8', 
    'photo-1434389677669-e08b4cac3105', 'photo-1509319117193-57bab727e09d',
    'photo-1621184455862-c163dfb30e0f'
  ],
  pants_women: [
    'photo-1541099649105-f69ad21f3246', 'photo-1582533561751-ef6f6ab93a2e'
  ],
  shirts_men: [
    'photo-1596755094514-f87e34085b2c', 'photo-1489987707025-afc232f7ea0f', 
    'photo-1521572267360-ee0c2909d518', 'photo-1581655353564-df123a1eb820', 
    'photo-1602810318383-e386cc2a3ccf', 'photo-1598033129183-c4f50c736f10'
  ],
  pants_men: [
    'photo-1542272604-787c3835535d', 'photo-1624378439575-d8705ad7ae80', 
    'photo-1492562080023-ab3db95bfbce'
  ],
  // Subcategory-specific Outerwear Arrays
  outerwear_jackets: [
    'photo-1551028719-00167b16eac5', 'photo-1611312449412-6cefac5dc3e4',
    'photo-1544923246-77307dd654cb', 'photo-1591047139829-d91aecb6caea'
  ],
  outerwear_cozy: [
    'photo-1556821840-3a63f95609a7', 'photo-1583743814966-8936f5b7be1a',
    'photo-1608228088998-57828365d486', 'photo-1583391733956-3750e0ff4e8b'
  ],
  outerwear_suits: [
    'photo-1594938298603-c8148c4dae35', 'photo-1585487000160-6ebcfceb0d03',
    'photo-1598033129183-c4f50c736f10'
  ],
  // Subcategory-specific Footwear Arrays
  footwear_sneakers: [
    'photo-1549298916-b41d501d3772', 'photo-1595950653106-6c9ebd614d3a', 
    'photo-1608231387042-66d1773070a5', 'photo-1560769629-975ec94e6a86', 
    'photo-1600185365483-26d7a4cc7519', 'photo-1542291026-7eec264c27ff', 
    'photo-1606107557195-0e29a4b5b4aa'
  ],
  footwear_heels: [
    'photo-1543163521-1bf539c55dd2'
  ],
  footwear_sandals: [
    'photo-1539185441755-769473a23570'
  ],
  footwear_juttis: [
    'photo-1614252369475-531eba835eb1'
  ],
  footwear_loafers: [
    'photo-1533867617858-e7b97e060509', 'photo-1531310197839-ccf54634509e'
  ],
  // Subcategory-specific Accessories Arrays
  accessories_watches: [
    'photo-1522312346375-d1a52e2b99b3', 'photo-1547949003-9792a18a2601'
  ],
  accessories_bags: [
    'photo-1584917865442-de89df76afd3', 'photo-1591561954557-26941169b49e'
  ],
  accessories_sunglasses: [
    'photo-1511499767150-a48a237f0083'
  ],
  accessories_jewelry: [
    'photo-1535632066927-ab7c9ab60908', 'photo-1599643478518-a784e5dc4c8f', 
    'photo-1635767798638-3e25273a8236', 'photo-1605100804763-247f67b3557e', 
    'photo-1617038260897-41a1f14a8ca0'
  ]
};

// Existing seed products to keep (audited & re-mapped with correct images)
const existingProducts = [
  {
    _id: '6a2f97cb07805bf53ccf7959',
    name: 'Pastel Embroidered Lehenga',
    description: 'A gorgeous pastel pink embroidered lehenga featuring premium silk fabric, delicate zari work, and a matching georgette dupatta. Ideal for weddings, receptions, and engagements.',
    brand: 'StyleAI Premium',
    category: 'Ethnic',
    subCategory: 'Lehenga',
    material: 'Silk',
    fit: 'Regular',
    gender: 'Women',
    price: 4999,
    originalPrice: 7999,
    discount: 37,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Pink', 'Gold'],
    inventory: 15,
    occasionTags: ['Wedding', 'Engagement', 'Festive'],
    featured: true,
    aiRecommended: true,
    ratings: 4.8,
    reviewsCount: 1
  },
  {
    name: 'Classic Silk Sherwani',
    description: 'A luxurious off-white silk sherwani styled with intricate gold embroidery. Features a premium velvet collar, matching churidar pants, and a brocade shawl.',
    brand: 'Royal Heritage',
    category: 'Ethnic',
    subCategory: 'Sherwani',
    material: 'Silk',
    fit: 'Slim Fit',
    gender: 'Men',
    price: 6999,
    originalPrice: 11999,
    discount: 41,
    images: [
      'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=600&auto=format&fit=crop&q=80'
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Off-White', 'Gold'],
    inventory: 8,
    occasionTags: ['Wedding', 'Engagement'],
    featured: true,
    aiRecommended: false,
    ratings: 4.5,
    reviewsCount: 0
  },
  {
    name: 'Designer Anarkali Suit',
    description: 'An elegant emerald green Anarkali suit set in premium georgette. Includes heavily embroidered borders and a sheer net dupatta.',
    brand: 'StyleAI Premium',
    category: 'Ethnic',
    subCategory: 'Salwar Kameez',
    material: 'Georgette',
    fit: 'Regular',
    gender: 'Women',
    price: 3499,
    originalPrice: 4999,
    discount: 30,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Green'],
    inventory: 20,
    occasionTags: ['Festive', 'Engagement', 'Wedding'],
    featured: false,
    aiRecommended: true,
    ratings: 4.4,
    reviewsCount: 0
  },
  {
    name: 'Embroidered Kurta Set',
    description: 'Modern peach cotton silk kurta paired with white pajama pants. Finished with subtle neckline mirror embroidery.',
    brand: 'Urban Ethnic',
    category: 'Ethnic',
    subCategory: 'Kurta Pyjama',
    material: 'Cotton Silk',
    fit: 'Regular',
    gender: 'Men',
    price: 1899,
    originalPrice: 2799,
    discount: 32,
    images: [
      'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?w=600&auto=format&fit=crop&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Peach', 'White'],
    inventory: 35,
    occasionTags: ['Engagement', 'Festive', 'Casual'],
    featured: false,
    aiRecommended: true,
    ratings: 4.2,
    reviewsCount: 0
  },
  {
    name: 'Tailored Fit Navy Blazer',
    description: 'A classic navy blue blazer crafted from high-performance breathable wool-blend fabric. Offers a sharp outline for business meetings, conferences, or job interviews.',
    brand: 'Executive Wear',
    category: 'Formal',
    subCategory: 'Blazers',
    material: 'Wool Blend',
    fit: 'Slim Fit',
    gender: 'Men',
    price: 3999,
    originalPrice: 5999,
    discount: 33,
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format&fit=crop&q=80'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: ['Navy Blue'],
    inventory: 14,
    occasionTags: ['Office', 'Engagement', 'Formal'],
    featured: true,
    aiRecommended: true,
    ratings: 4.0,
    reviewsCount: 1
  },
  {
    name: 'Double-Breasted Crimson Blazer',
    description: 'A commanding structured red double-breasted blazer for women. Finished with golden metal crest buttons and a notched collar.',
    brand: 'Executive Wear',
    category: 'Formal',
    subCategory: 'Blazers',
    material: 'Polyester Blend',
    fit: 'Regular',
    gender: 'Women',
    price: 3299,
    originalPrice: 4999,
    discount: 34,
    images: [
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&auto=format&fit=crop&q=80'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Crimson Red'],
    inventory: 10,
    occasionTags: ['Office', 'Formal'],
    featured: false,
    aiRecommended: true,
    ratings: 4.1,
    reviewsCount: 0
  },
  {
    name: 'Classic White Dress Shirt',
    description: 'An essential structured cotton formal shirt for men. Made from easy-iron 100% organic long-staple cotton.',
    brand: 'Executive Wear',
    category: 'Formal',
    subCategory: 'Shirts',
    material: 'Organic Cotton',
    fit: 'Slim Fit',
    gender: 'Men',
    price: 1499,
    originalPrice: 1999,
    discount: 25,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White'],
    inventory: 50,
    occasionTags: ['Office', 'College', 'Formal'],
    featured: false,
    aiRecommended: false,
    ratings: 4.3,
    reviewsCount: 0
  },
  {
    name: 'Pinstripe Wide-Leg Trousers',
    description: 'Sophisticated charcoal grey wide-leg trousers featuring a subtle pinstripe design, double-pleat front, and high waist.',
    brand: 'Executive Wear',
    category: 'Formal',
    subCategory: 'Trousers',
    material: 'Viscose Blend',
    fit: 'Regular',
    gender: 'Women',
    price: 1799,
    originalPrice: 2499,
    discount: 28,
    images: [
      'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?w=600&auto=format&fit=crop&q=80'
    ],
    sizes: ['S', 'M', 'L'],
    colors: ['Charcoal Grey'],
    inventory: 22,
    occasionTags: ['Office', 'Formal'],
    featured: false,
    aiRecommended: true,
    ratings: 4.4,
    reviewsCount: 0
  },
  {
    name: 'Silk Banarasi Saree',
    description: 'Exquisite royal blue Banarasi handloom woven silk saree with premium golden zari designs. Traditional and majestic.',
    brand: 'Royal Heritage',
    category: 'Ethnic',
    subCategory: 'Saree',
    material: 'Pure Silk',
    fit: 'Regular',
    gender: 'Women',
    price: 5499,
    originalPrice: 8999,
    discount: 38,
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80'
    ],
    sizes: ['Free Size'],
    colors: ['Royal Blue', 'Gold'],
    inventory: 11,
    occasionTags: ['Wedding', 'Festive', 'Traditional'],
    featured: true,
    aiRecommended: true,
    ratings: 4.6,
    reviewsCount: 0
  },
  {
    name: 'Embellished Wedding Heels',
    description: 'Elegant golden slip-on heels with block design and rhinestone embellishments, perfect for traditional wear like lehengas and sarees.',
    brand: 'StyleAI Luxury',
    category: 'Ethnic',
    subCategory: 'Heels',
    material: 'Synthetic Leather',
    fit: 'Regular',
    gender: 'Women',
    price: 1499,
    originalPrice: 2499,
    discount: 40,
    images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80'],
    sizes: ['37', '38', '39', '40'],
    colors: ['Gold', 'Bronze'],
    inventory: 20,
    occasionTags: ['Wedding', 'Festive', 'Engagement'],
    featured: false,
    aiRecommended: true,
    ratings: 4.7,
    reviewsCount: 0
  },
  {
    name: 'Royal Golden Juttis',
    description: 'Handcrafted traditional Punjabi juttis featuring premium thread embroidery and gold beadwork.',
    brand: 'Royal Heritage',
    category: 'Ethnic',
    subCategory: 'Juttis',
    material: 'Leather',
    fit: 'Regular',
    gender: 'Women',
    price: 899,
    originalPrice: 1499,
    discount: 40,
    images: ['https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&auto=format&fit=crop&q=80'],
    sizes: ['36', '37', '38', '39'],
    colors: ['Gold', 'Yellow'],
    inventory: 15,
    occasionTags: ['Wedding', 'Festive', 'Engagement'],
    featured: false,
    aiRecommended: true,
    ratings: 4.5,
    reviewsCount: 0
  },
  {
    name: 'Elegant Gold Clutch',
    description: 'A stylish golden metallic frame evening clutch with a detachable chain strap. Perfect accessory for weddings and traditional functions.',
    brand: 'StyleAI Accessories',
    category: 'Ethnic',
    subCategory: 'Handbags',
    material: 'Metal Silk',
    fit: 'One Size',
    gender: 'Women',
    price: 799,
    originalPrice: 1299,
    discount: 38,
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80'],
    sizes: ['Free Size'],
    colors: ['Gold'],
    inventory: 25,
    occasionTags: ['Wedding', 'Festive', 'Engagement', 'Party'],
    featured: false,
    aiRecommended: true,
    ratings: 4.3,
    reviewsCount: 0
  },
  {
    name: 'Velvet Embroidered Shawl',
    description: 'A premium maroon velvet shawl detailed with gold zari embroidery along the borders. Adds an elegant layer to any ethnic outfit.',
    brand: 'Royal Heritage',
    category: 'Ethnic',
    subCategory: 'Shawls',
    material: 'Velvet',
    fit: 'Regular',
    gender: 'Women',
    price: 1999,
    originalPrice: 2999,
    discount: 33,
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80'],
    sizes: ['Free Size'],
    colors: ['Maroon', 'Gold'],
    inventory: 12,
    occasionTags: ['Wedding', 'Festive'],
    featured: false,
    aiRecommended: true,
    ratings: 4.6,
    reviewsCount: 0
  },
  {
    name: 'Traditional Mojaris',
    description: 'Classic off-white leather mojaris decorated with ethnic patterns. Ideal accompaniment for sherwanis and kurtas.',
    brand: 'Royal Heritage',
    category: 'Ethnic',
    subCategory: 'Shoes',
    material: 'Leather',
    fit: 'Regular',
    gender: 'Men',
    price: 999,
    originalPrice: 1599,
    discount: 37,
    images: ['https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=600&auto=format&fit=crop&q=80'],
    sizes: ['7', '8', '9', '10'],
    colors: ['Off-White', 'Gold'],
    inventory: 18,
    occasionTags: ['Wedding', 'Festive', 'Engagement'],
    featured: false,
    aiRecommended: true,
    ratings: 4.4,
    reviewsCount: 0
  },
  {
    name: 'Classic Leather Loafers',
    description: 'Slip-on formal dark brown leather loafers with cushioned footbed and textured outsole. Essential footwear for business styling.',
    brand: 'Executive Wear',
    category: 'Formal',
    subCategory: 'Shoes',
    material: 'Genuine Leather',
    fit: 'Regular',
    gender: 'Men',
    price: 2499,
    originalPrice: 3999,
    discount: 37,
    images: ['https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop&q=80'],
    sizes: ['7', '8', '9', '10'],
    colors: ['Brown', 'Dark Brown'],
    inventory: 15,
    occasionTags: ['Office', 'Formal'],
    featured: false,
    aiRecommended: true,
    ratings: 4.5,
    reviewsCount: 0
  }
];

// Helper to slugify product names deterministically
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

const finalProducts = [...existingProducts];
const seenSlugs = new Set(existingProducts.map(p => slugify(p.name)));

// Dynamic generator function
const addBulk = (count, generator) => {
  for (let i = 0; i < count; i++) {
    const p = generator(i);
    const slug = slugify(p.name);
    if (!seenSlugs.has(slug)) {
      seenSlugs.add(slug);
      finalProducts.push(p);
    }
  }
};

// 1. WOMEN'S WEAR (Ethnic, Casual, Formal, Party - Target: 100 products total)
const womenSubcategories = [
  { sub: 'Sarees', cat: 'Ethnic', tag: ['Wedding', 'Festive', 'Traditional'] },
  { sub: 'Lehengas', cat: 'Ethnic', tag: ['Wedding', 'Reception', 'Sangeet'] },
  { sub: 'Kurtas', cat: 'Ethnic', tag: ['Festive', 'Traditional', 'Daily Wear'] },
  { sub: 'Dresses', cat: 'Casual', tag: ['Casual', 'Summer', 'Vacation', 'Daily Wear'] },
  { sub: 'Dresses', cat: 'Party', tag: ['Party', 'Date Night', 'Reception'] },
  { sub: 'Co-ord Sets', cat: 'Casual', tag: ['Casual', 'Airport', 'Travel'] },
  { sub: 'Tops', cat: 'Casual', tag: ['Casual', 'College', 'Daily Wear'] },
  { sub: 'Shirts', cat: 'Formal', tag: ['Office', 'Formal'] },
  { sub: 'Jeans', cat: 'Casual', tag: ['Casual', 'College'] },
  { sub: 'Trousers', cat: 'Formal', tag: ['Office', 'Formal'] },
  { sub: 'Skirts', cat: 'Casual', tag: ['Casual', 'Summer', 'Vacation'] },
  { sub: 'Shorts', cat: 'Casual', tag: ['Casual', 'Vacation', 'Summer'] },
  { sub: 'Jumpsuits', cat: 'Casual', tag: ['Casual', 'Party', 'Travel'] }
];

addBulk(130, (i) => {
  const brand = BRANDS[i % BRANDS.length];
  const color = COLORS[i % COLORS.length];
  const material = MATERIALS[i % MATERIALS.length];
  const fit = FITS[i % FITS.length];
  const subInfo = womenSubcategories[i % womenSubcategories.length];
  
  const name = `${brand} ${color} ${material} ${subInfo.sub} ${i + 1}`;
  const price = 800 + (i * 95) % 11000;
  const originalPrice = Math.floor(price * 1.5);
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
  
  let imgArray = UNSPLASH_IMAGES.dress_women;
  if (subInfo.cat === 'Ethnic') imgArray = UNSPLASH_IMAGES.ethnic_women;
  if (subInfo.sub === 'Tops' || subInfo.sub === 'Shirts') imgArray = UNSPLASH_IMAGES.tops_women;
  if (subInfo.sub === 'Jeans' || subInfo.sub === 'Trousers' || subInfo.sub === 'Skirts') imgArray = UNSPLASH_IMAGES.pants_women;
  
  const imgId = imgArray[i % imgArray.length];
  const imgUrl = `https://images.unsplash.com/${imgId}?sig=w_${i}&w=600&auto=format&fit=crop&q=80`;

  return {
    name,
    description: `A beautifully styled women's ${subInfo.sub} perfect for your next look. Made from highly durable ${material} fabric in a stylish ${fit} layout. Features include matching stitching, premium colorways, and comfortable fit options.`,
    brand,
    category: subInfo.cat,
    subCategory: subInfo.sub,
    material,
    fit,
    gender: 'Women',
    price,
    originalPrice,
    discount,
    images: [imgUrl],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [color],
    inventory: 10 + (i % 40),
    occasionTags: subInfo.tag,
    featured: i % 10 === 0,
    aiRecommended: i % 4 === 0,
    ratings: Number((4.0 + (i % 10) / 10).toFixed(1)),
    reviewsCount: i % 15
  };
});

// 2. MEN'S WEAR (Formal, Casual, Ethnic - Target: 80 products total)
const menSubcategories = [
  { sub: 'Shirts', cat: 'Casual', tag: ['Casual', 'Vacation', 'Daily Wear'] },
  { sub: 'Shirts', cat: 'Formal', tag: ['Office', 'Formal'] },
  { sub: 'T-Shirts', cat: 'Casual', tag: ['Casual', 'College', 'Gym'] },
  { sub: 'Polo Shirts', cat: 'Casual', tag: ['Casual', 'Office', 'College'] },
  { sub: 'Jeans', cat: 'Casual', tag: ['Casual', 'College'] },
  { sub: 'Chinos', cat: 'Casual', tag: ['Casual', 'Office', 'Travel'] },
  { sub: 'Cargo Pants', cat: 'Casual', tag: ['Casual', 'Travel'] },
  { sub: 'Trousers', cat: 'Formal', tag: ['Office', 'Formal'] },
  { sub: 'Suits', cat: 'Formal', tag: ['Wedding', 'Reception', 'Formal'] },
  { sub: 'Sherwanis', cat: 'Ethnic', tag: ['Wedding', 'Reception'] },
  { sub: 'Kurtas', cat: 'Ethnic', tag: ['Festive', 'Traditional', 'Sangeet'] },
  { sub: 'Sweatshirts', cat: 'Casual', tag: ['Casual', 'Winter'] }
];

addBulk(130, (i) => {
  const brand = BRANDS[(i + 3) % BRANDS.length];
  const color = COLORS[(i + 2) % COLORS.length];
  const material = MATERIALS[(i + 4) % MATERIALS.length];
  const fit = FITS[i % FITS.length];
  const subInfo = menSubcategories[i % menSubcategories.length];
  
  const name = `${brand} Men's ${color} ${material} ${subInfo.sub} ${i + 1}`;
  const price = 600 + (i * 125) % 14000;
  const originalPrice = Math.floor(price * 1.4);
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
  
  let imgArray = UNSPLASH_IMAGES.shirts_men;
  if (subInfo.sub === 'Jeans' || subInfo.sub === 'Chinos' || subInfo.sub === 'Cargo Pants' || subInfo.sub === 'Trousers') imgArray = UNSPLASH_IMAGES.pants_men;
  if (subInfo.sub === 'Suits' || subInfo.sub === 'Sherwanis') imgArray = UNSPLASH_IMAGES.outerwear_suits;
  
  const imgId = imgArray[i % imgArray.length];
  const imgUrl = `https://images.unsplash.com/${imgId}?sig=m_${i}&w=600&auto=format&fit=crop&q=80`;

  return {
    name,
    description: `A sophisticated and tailored men's ${subInfo.sub} for style-focused shoppers. Designed using breathable ${material} textile structure in a sharp ${fit} silhouette. Perfect combination of daily fashion and premium quality.`,
    brand,
    category: subInfo.cat,
    subCategory: subInfo.sub,
    material,
    fit,
    gender: 'Men',
    price,
    originalPrice,
    discount,
    images: [imgUrl],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [color],
    inventory: 15 + (i % 30),
    occasionTags: subInfo.tag,
    featured: i % 8 === 0,
    aiRecommended: i % 5 === 0,
    ratings: Number((4.1 + (i % 9) / 10).toFixed(1)),
    reviewsCount: i % 12
  };
});

// 3. FOOTWEAR (Sneakers, Heels, Loafers, Boots - Target: 60 products total)
const footwearSubcategories = [
  { sub: 'Sneakers', cat: 'Casual', tag: ['Casual', 'College', 'Airport', 'Travel'], gen: 'Unisex' },
  { sub: 'Running Shoes', cat: 'Casual', tag: ['Gym', 'Casual', 'Daily Wear'], gen: 'Men' },
  { sub: 'Loafers', cat: 'Casual', tag: ['Casual', 'Office', 'Date Night'], gen: 'Men' },
  { sub: 'Boots', cat: 'Casual', tag: ['Casual', 'Winter', 'Travel'], gen: 'Unisex' },
  { sub: 'Sandals', cat: 'Casual', tag: ['Casual', 'Summer', 'Vacation'], gen: 'Women' },
  { sub: 'Heels', cat: 'Formal', tag: ['Party', 'Wedding', 'Reception'], gen: 'Women' },
  { sub: 'Flats', cat: 'Casual', tag: ['Casual', 'Daily Wear', 'Summer'], gen: 'Women' },
  { sub: 'Juttis', cat: 'Ethnic', tag: ['Wedding', 'Festive', 'Traditional'], gen: 'Women' },
  { sub: 'Kolhapuris', cat: 'Ethnic', tag: ['Festive', 'Traditional'], gen: 'Unisex' },
  { sub: 'Formal Shoes', cat: 'Formal', tag: ['Office', 'Formal'] }
];

addBulk(90, (i) => {
  const brand = BRANDS[(i + 6) % BRANDS.length];
  const color = COLORS[(i + 4) % COLORS.length];
  const material = i % 2 === 0 ? 'Genuine Leather' : 'Synthetic Leather';
  const subInfo = footwearSubcategories[i % footwearSubcategories.length];
  const gender = subInfo.gen || (i % 2 === 0 ? 'Men' : 'Women');
  
  const name = `${brand} Premium ${color} ${subInfo.sub} ${i + 1}`;
  const price = 900 + (i * 115) % 7000;
  const originalPrice = Math.floor(price * 1.5);
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
  
  let imgArray = UNSPLASH_IMAGES.footwear_sneakers;
  const subLower = subInfo.sub.toLowerCase();
  if (subLower.includes('sneaker') || subLower.includes('running') || subLower.includes('trainer')) {
    imgArray = UNSPLASH_IMAGES.footwear_sneakers;
  } else if (subLower.includes('heel')) {
    imgArray = UNSPLASH_IMAGES.footwear_heels;
  } else if (subLower.includes('sandal') || subLower.includes('slide') || subLower.includes('flat')) {
    imgArray = UNSPLASH_IMAGES.footwear_sandals;
  } else if (subLower.includes('jutti') || subLower.includes('kolhapuri')) {
    imgArray = UNSPLASH_IMAGES.footwear_juttis;
  } else {
    imgArray = UNSPLASH_IMAGES.footwear_loafers;
  }
  const imgId = imgArray[i % imgArray.length];
  const imgUrl = `https://images.unsplash.com/${imgId}?sig=f_${i}&w=600&auto=format&fit=crop&q=80`;

  return {
    name,
    description: `Expertly handcrafted and designed men/women's ${subInfo.sub}. Structured using rich ${material} linings and durable outsoles for unparalleled walking comfort and style flexibility.`,
    brand,
    category: 'Footwear',
    subCategory: subInfo.sub,
    material,
    fit: 'Regular',
    gender,
    price,
    originalPrice,
    discount,
    images: [imgUrl],
    sizes: gender === 'Women' ? ['36', '37', '38', '39', '40'] : ['7', '8', '9', '10', '11'],
    colors: [color],
    inventory: 8 + (i % 25),
    occasionTags: subInfo.tag,
    featured: i % 9 === 0,
    aiRecommended: i % 3 === 0,
    ratings: Number((4.2 + (i % 8) / 10).toFixed(1)),
    reviewsCount: i % 8
  };
});

// 4. ACCESSORIES (Watches, Bags, Jewelry - Target: 60 products total)
const accessoriesSubcategories = [
  { sub: 'Watches', tag: ['Office', 'Formal', 'Daily Wear'], gen: 'Unisex' },
  { sub: 'Handbags', tag: ['Casual', 'Office', 'Travel'], gen: 'Women' },
  { sub: 'Tote Bags', tag: ['Casual', 'Vacation', 'College'], gen: 'Women' },
  { sub: 'Sling Bags', tag: ['Casual', 'Party', 'Date Night'], gen: 'Women' },
  { sub: 'Clutches', tag: ['Wedding', 'Reception', 'Party'], gen: 'Women' },
  { sub: 'Wallets', tag: ['Casual', 'Office', 'Daily Wear'], gen: 'Men' },
  { sub: 'Sunglasses', tag: ['Casual', 'Vacation', 'Airport'], gen: 'Unisex' },
  { sub: 'Belts', tag: ['Office', 'Formal', 'Casual'], gen: 'Men' },
  { sub: 'Necklaces', tag: ['Wedding', 'Festive', 'Traditional'], gen: 'Women' },
  { sub: 'Earrings', tag: ['Party', 'Festive', 'Date Night'], gen: 'Women' },
  { sub: 'Bracelets', tag: ['Casual', 'College'], gen: 'Unisex' },
  { sub: 'Rings', tag: ['Wedding', 'Engagement', 'Formal'], gen: 'Unisex' }
];

addBulk(90, (i) => {
  const brand = BRANDS[(i + 2) % BRANDS.length];
  const color = COLORS[(i + 5) % COLORS.length];
  const material = i % 2 === 0 ? 'Stainless Steel' : 'Genuine Leather';
  const subInfo = accessoriesSubcategories[i % accessoriesSubcategories.length];
  const gender = subInfo.gen || (i % 2 === 0 ? 'Men' : 'Women');
  
  const name = `${brand} Elegant ${color} ${subInfo.sub} ${i + 1}`;
  const price = 400 + (i * 90) % 5500;
  const originalPrice = Math.floor(price * 1.4);
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
  
  let imgArray = UNSPLASH_IMAGES.accessories_jewelry;
  const subLower = subInfo.sub.toLowerCase();
  if (subLower.includes('watch')) {
    imgArray = UNSPLASH_IMAGES.accessories_watches;
  } else if (subLower.includes('bag') || subLower.includes('clutch') || subLower.includes('wallet') || subLower.includes('belt')) {
    imgArray = UNSPLASH_IMAGES.accessories_bags;
  } else if (subLower.includes('sunglass')) {
    imgArray = UNSPLASH_IMAGES.accessories_sunglasses;
  } else {
    imgArray = UNSPLASH_IMAGES.accessories_jewelry;
  }
  const imgId = imgArray[i % imgArray.length];
  const imgUrl = `https://images.unsplash.com/${imgId}?sig=a_${i}&w=600&auto=format&fit=crop&q=80`;

  return {
    name,
    description: `A beautifully detailed ${subInfo.sub} featuring clean contours and reliable construction. Created from select ${material} components. Perfect accessory option for modern styling coordinates.`,
    brand,
    category: 'Accessories',
    subCategory: subInfo.sub,
    material,
    fit: 'One Size',
    gender,
    price,
    originalPrice,
    discount,
    images: [imgUrl],
    sizes: ['Free Size'],
    colors: [color],
    inventory: 20 + (i % 50),
    occasionTags: subInfo.tag,
    featured: i % 10 === 0,
    aiRecommended: i % 4 === 0,
    ratings: Number((4.0 + (i % 10) / 10).toFixed(1)),
    reviewsCount: i % 6
  };
});

// 5. OUTERWEAR / LAYERS (Denim, Leather, Cardigans - Target: 30 products total)
const outerwearSubcategories = [
  { sub: 'Cardigans', tag: ['Winter', 'Casual', 'Daily Wear'], gen: 'Women' },
  { sub: 'Shawls', tag: ['Wedding', 'Festive', 'Traditional'], gen: 'Women' },
  { sub: 'Leather Jackets', tag: ['Party', 'Casual', 'Winter'], gen: 'Men' },
  { sub: 'Denim Jackets', tag: ['Casual', 'College', 'Travel'], gen: 'Unisex' },
  { sub: 'Bomber Jackets', tag: ['Casual', 'Airport', 'Travel'], gen: 'Men' },
  { sub: 'Trench Coats', tag: ['Winter', 'Formal', 'Travel'], gen: 'Unisex' }
];

addBulk(60, (i) => {
  const brand = BRANDS[(i + 9) % BRANDS.length];
  const color = COLORS[(i + 7) % COLORS.length];
  const material = MATERIALS[i % MATERIALS.length];
  const fit = FITS[i % FITS.length];
  const subInfo = outerwearSubcategories[i % outerwearSubcategories.length];
  const gender = subInfo.gen || (i % 2 === 0 ? 'Men' : 'Women');

  const name = `${brand} Cozy ${color} ${subInfo.sub} ${i + 1}`;
  const price = 1200 + (i * 240) % 8000;
  const originalPrice = Math.floor(price * 1.5);
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

  let imgArray = UNSPLASH_IMAGES.outerwear_jackets;
  const subLower = subInfo.sub.toLowerCase();
  if (subLower.includes('jacket') || subLower.includes('hoodie')) {
    imgArray = UNSPLASH_IMAGES.outerwear_jackets;
  } else if (subLower.includes('cardigan') || subLower.includes('shawl') || subLower.includes('shrug')) {
    imgArray = UNSPLASH_IMAGES.outerwear_cozy;
  } else {
    imgArray = UNSPLASH_IMAGES.outerwear_suits;
  }
  const imgId = imgArray[i % imgArray.length];
  const imgUrl = `https://images.unsplash.com/${imgId}?sig=o_${i}&w=600&auto=format&fit=crop&q=80`;

  return {
    name,
    description: `A warm and highly functional ${subInfo.sub} layering option. Tailored using premium ${material} fibres in a relaxed ${fit} profile. Designed to protect and elevate winter styling configurations.`,
    brand,
    category: 'Outerwear',
    subCategory: subInfo.sub,
    material,
    fit,
    gender,
    price,
    originalPrice,
    discount,
    images: [imgUrl],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [color],
    inventory: 10 + (i % 20),
    occasionTags: subInfo.tag,
    featured: i % 8 === 0,
    aiRecommended: i % 4 === 0,
    ratings: Number((4.1 + (i % 9) / 10).toFixed(1)),
    reviewsCount: i % 10
  };
});

// ── FORMAT SEEDER FILE CONTENT ──────────────────────────────────────────────
const buildSeederContent = () => {
  const jsonProducts = JSON.stringify(finalProducts, null, 2);
  
  return `import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import Address from '../models/Address.js';

dotenv.config();

const products = ${jsonProducts};

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/styleai';
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected for Seeding...'.cyan);

    // Drop products and reviews collections
    await Product.deleteMany({});
    await Review.deleteMany({});
    console.log('Existing products and reviews deleted.'.red);

    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log(\`\${createdProducts.length} Products Seeded successfully!\`.green);

    // Seed test user and address for cart & order test scenarios
    const testUserEmail = 'abc@123.com';
    const testUserId = '6a2f9fb097e421b1b0f7d65a';
    await User.deleteMany({ email: testUserEmail });

    await User.create({
      _id: testUserId,
      name: 'Test Buyer',
      email: testUserEmail,
      password: 'abc123',
      role: 'user',
      provider: 'local'
    });
    console.log('Test user abc@123.com seeded successfully.'.green);

    const testAddressId = '6a2f9fe097e421b1b0f7d65e';
    await Address.deleteMany({ _id: testAddressId });
    await Address.create({
      _id: testAddressId,
      user: testUserId,
      label: 'Home',
      street: '123 Test St',
      city: 'Mumbai',
      state: 'Test State',
      zipCode: '123456',
      phone: '1234567890',
      isDefault: true
    });
    console.log('Test address seeded successfully.'.green);

    // Get or create a default test reviewer user
    let user = await User.findOne({ email: 'rutuja.hirudkar30@gmail.com' });
    if (!user) {
      user = await User.findOne({}); // find any user
    }
    if (!user) {
      user = await User.create({
        name: 'Test Reviewer',
        email: 'reviewer@styleai.com',
        password: 'password123',
        role: 'user',
        provider: 'local'
      });
      console.log('Created test reviewer user.'.yellow);
    }

    // Add some reviews to some products
    const reviews = [];
    const lehenga = createdProducts.find(p => p.slug === 'pastel-embroidered-lehenga');
    if (lehenga) {
      reviews.push({
        user: user._id,
        product: lehenga._id,
        rating: 5,
        review: 'Absolutely stunning! The embroidery details are gorgeous and it fits perfectly.',
        isVerifiedPurchase: true,
        images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80']
      });
    }

    const blazer = createdProducts.find(p => p.slug === 'tailored-fit-navy-blazer');
    if (blazer) {
      reviews.push({
        user: user._id,
        product: blazer._id,
        rating: 4,
        review: 'Great fabric quality and fit. Excellent for office presentations.',
        isVerifiedPurchase: true,
        images: []
      });
    }

    if (reviews.length > 0) {
      await Review.insertMany(reviews);
      console.log('Reviews Seeded successfully!'.green);
    }

    mongoose.connection.close();
    console.log('Seeder completed successfully. Connection closed.'.green.bold);
    process.exit(0);
  } catch (error) {
    console.error(\`Error seeding data: \${error.message}\`.red.bold);
    process.exit(1);
  }
};

seedData();
`;
};

// Write output
const outputPath = path.join('c:', 'Users', 'Rutuja Hirudkar', 'react native', 'OneDrive', 'c', 'shopping app', 'backend', 'seeds', 'productSeeder.js');
fs.writeFileSync(outputPath, buildSeederContent(), 'utf-8');
console.log('Generated productSeeder.js successfully!');
