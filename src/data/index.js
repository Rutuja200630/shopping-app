// ─── Products ───────────────────────────────────────────────────────────────
export const products = [
  {
    id: 1,
    name: 'Lavender Linen Blazer',
    price: 2499,
    originalPrice: 3499,
    category: 'Women',
    occasion: 'Formal',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    image: '/images/products/lavender_blazer.png',
    description:
      'A tailored lavender linen blazer that effortlessly bridges the gap between casual and formal wear. Crafted with a breathable linen blend for all-day comfort.',
    trending: true,
    rating: 4.7,
    reviews: 128,
  },
  {
    id: 2,
    name: 'Oversized Street Hoodie',
    price: 1299,
    originalPrice: 1799,
    category: 'Men',
    occasion: 'Casual',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    image: '/images/products/street_hoodie.png',
    description:
      'Drop-shoulder street-style hoodie in heavyweight fleece. Perfect for the laid-back Gen-Z aesthetic with a roomy fit for layering.',
    trending: true,
    rating: 4.9,
    reviews: 215,
  },
  {
    id: 3,
    name: 'Mini Floral Sundress',
    price: 1799,
    originalPrice: 2399,
    category: 'Women',
    occasion: 'Casual',
    sizes: ['XS', 'S', 'M', 'L'],
    image: '/images/products/floral_sundress.png',
    description:
      'A breezy floral mini dress perfect for brunch dates or weekend outings. Features a smocked bodice and adjustable straps.',
    trending: false,
    rating: 4.5,
    reviews: 87,
    seasonal: 'summer'
  },
  {
    id: 4,
    name: 'Tailored Suit Pants',
    price: 1999,
    originalPrice: 2799,
    category: 'Men',
    occasion: 'Formal',
    sizes: ['28', '30', '32', '34', '36'],
    image: '/images/products/suit_pants.png',
    description:
      'Sharp, slim-fit trousers in a premium charcoal blend. Versatile enough to pair with sneakers or oxfords.',
    trending: false,
    rating: 4.6,
    reviews: 94,
  },
  {
    id: 5,
    name: 'Sequin Party Gown',
    price: 4999,
    originalPrice: 6999,
    category: 'Women',
    occasion: 'Party',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    image: '/images/products/sequin_gown.png',
    description:
      'Be the main character in this floor-length sequin gown. Fully lined with a subtle side slit and adjustable spaghetti straps.',
    trending: true,
    rating: 4.8,
    reviews: 173,
  },
  {
    id: 6,
    name: 'Cargo Joggers',
    price: 1199,
    originalPrice: 1599,
    category: 'Men',
    occasion: 'Casual',
    sizes: ['S', 'M', 'L', 'XL'],
    image: '/images/products/cargo_joggers.png',
    description:
      'Relaxed-fit cargo joggers with multiple pockets and a tapered ankle. The ultimate streetwear staple.',
    trending: true,
    rating: 4.5,
    reviews: 143,
  },
  {
    id: 7,
    name: 'Cream Ribbed Knit Set',
    price: 2299,
    originalPrice: 2999,
    category: 'Women',
    occasion: 'Casual',
    sizes: ['XS', 'S', 'M', 'L'],
    image: '/images/products/ribbed_knit_set.png',
    description:
      'A cozy matching ribbed knit co-ord set in warm cream. The crop top and midi skirt are both sold as a set.',
    trending: false,
    rating: 4.7,
    reviews: 106,
  },
  {
    id: 8,
    name: 'Linen Shirt – Sky Blue',
    price: 1099,
    originalPrice: 1399,
    category: 'Men',
    occasion: 'Casual',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    image: '/images/products/linen_shirt.png',
    description:
      'A relaxed-fit linen shirt in a soothing sky-blue hue. Ideal for beach trips, café hopping, or just looking effortlessly put-together.',
    trending: false,
    rating: 4.4,
    reviews: 62,
    seasonal: 'summer'
  },
  {
    id: 9,
    name: 'Boho Crochet Crop Top',
    price: 899,
    originalPrice: 1299,
    category: 'Women',
    occasion: 'Casual',
    sizes: ['XS', 'S', 'M'],
    image: '/images/products/crochet_top.png',
    description: 'Hand-knitted crochet crop top with intricate patterns. Perfect for beach days and summer fests.',
    trending: true,
    rating: 4.8,
    reviews: 56,
    seasonal: 'summer'
  },
  {
    id: 10,
    name: 'Tropical Print Swim Shorts',
    price: 799,
    originalPrice: 1099,
    category: 'Men',
    occasion: 'Casual',
    sizes: ['M', 'L', 'XL'],
    image: '/images/products/swim_shorts.png',
    description: 'Quick-dry swim shorts with a vibrant tropical leaf print. Mesh lining and elastic waistband.',
    trending: false,
    rating: 4.3,
    reviews: 32,
    seasonal: 'summer'
  },
  {
    id: 11,
    name: 'Wide Brim Straw Hat',
    price: 649,
    originalPrice: 899,
    category: 'Women',
    occasion: 'Casual',
    sizes: ['One Size'],
    image: '/images/products/straw_hat.png',
    description: 'Classic straw hat with a wide brim for maximum sun protection. Features a chic black ribbon.',
    trending: true,
    rating: 4.6,
    reviews: 45,
    seasonal: 'summer'
  },
  {
    id: 12,
    name: 'Pastel Yellow Cotton Dress',
    price: 1899,
    originalPrice: 2599,
    category: 'Women',
    occasion: 'Casual',
    sizes: ['S', 'M', 'L'],
    image: '/images/products/yellow_dress.png',
    description: 'Lightweight off-shoulder dress in a soft pastel yellow. Perfect for summer brunches.',
    trending: true,
    rating: 4.9,
    reviews: 89,
    seasonal: 'summer'
  },

]

// ─── Categories ──────────────────────────────────────────────────────────────
export const categories = [
  {
    id: 1,
    name: 'Men',
    image: '/images/products/category_men.png',
    count: 240,
  },
  {
    id: 2,
    name: 'Women',
    image: '/images/products/category_women.png',
    count: 380,
  },
  {
    id: 3,
    name: 'Casual',
    image: '/images/products/category_casual.png',
    count: 195,
  },
  {
    id: 4,
    name: 'Formal',
    image: '/images/products/category_formal.png',
    count: 120,
  },
  {
    id: 5,
    name: 'Party',
    image: '/images/products/category_party.png',
    count: 88,
  },
]

// ─── Outfit Ideas ─────────────────────────────────────────────────────────────
export const outfitIdeas = [
  {
    id: 1,
    title: 'Office Glazed Daze',
    description: 'Blazer + wide-leg trousers + mules',
    image: '/images/products/outfit_formal.png',
    occasion: 'Formal',
  },
  {
    id: 2,
    title: 'Weekend Wanderer',
    description: 'Oversized knit + baggy denim + sneakers',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2070&auto=format&fit=crop',
    occasion: 'Casual',
  },
  {
    id: 3,
    title: 'Night Out Ready',
    description: 'Sequin mini + block heels + clutch',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2070&auto=format&fit=crop',
    occasion: 'Party',
  },
  {
    id: 4,
    title: 'Beach Breezy',
    description: 'Linen shirt + shorts + slip-ons',
    image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=2070&auto=format&fit=crop',
    occasion: 'Casual',
  },
]

// ─── Chat Data ────────────────────────────────────────────────────────────────
export const chatUsers = [
  { id: 1, name: 'StyleAI Bot', avatar: '🤖', lastMsg: 'Here are today\'s picks for you!', time: '10:32 AM', unread: 2 },
  { id: 2, name: 'Priya S.', avatar: '👩‍🦱', lastMsg: 'Love that lavender blazer!', time: 'Yesterday', unread: 0 },
  { id: 3, name: 'Ananya K.', avatar: '👩', lastMsg: 'Can you share the outfit link?', time: 'Mon', unread: 0 },
  { id: 4, name: 'Support', avatar: '🎧', lastMsg: 'Your order is on its way!', time: 'Sun', unread: 1 },
]

export const chatMessages = [
  { id: 1, from: 'them', text: 'Hey! I found some amazing pieces for your college fest look 🎉', time: '10:28 AM' },
  { id: 2, from: 'me', text: 'Oh wow! What did you find?', time: '10:29 AM' },
  { id: 3, from: 'them', text: 'Check out the Sequin Party set — it\'s trending right now and totally your vibe!', time: '10:30 AM' },
  { id: 4, from: 'me', text: 'That sounds perfect. What about something more casual for day events?', time: '10:31 AM' },
  { id: 5, from: 'them', text: 'Here are today\'s picks for you! The cream ribbed knit set would pair beautifully with your white sneakers ✨', time: '10:32 AM' },
]

// ─── AI Stylist Suggestions ───────────────────────────────────────────────────
export const aiSuggestions = {
  wedding: [
    { title: 'Embroidered Lehenga Set', desc: 'Ivory & gold silk lehenga with dupatta', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80' },
    { title: 'Floral Anarkali Gown', desc: 'Pastel floral print with mirror work', img: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&q=80' },
    { title: 'Classic Sherwani', desc: 'Beige cream sherwani with churidar', img: 'https://images.unsplash.com/photo-1596902852634-a0e1a5f6a1d0?w=400&q=80' },
  ],
  party: [
    { title: 'Sequin Mini Dress', desc: 'Gold sequin bodycon, statement sleeves', img: 'https://images.unsplash.com/photo-1566479179817-8a10e774d4e7?w=400&q=80' },
    { title: 'Metallic Coord Set', desc: 'Silver metallic blazer + flared pants', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4b5f02?w=400&q=80' },
    { title: 'Velvet Slip Dress', desc: 'Deep plum velvet with strappy sandals', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80' },
  ],
  date: [
    { title: 'Flowy Midi Dress', desc: 'Soft floral midi with espadrilles', img: 'https://images.unsplash.com/photo-1623609163859-ca93c959b98a?w=400&q=80' },
    { title: 'Smart Casual Look', desc: 'Fitted chinos + linen shirt + loafers', img: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&q=80' },
    { title: 'Elevated Basics', desc: 'White tee + high-waist jeans + blazer', img: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&q=80' },
  ],
  college: [
    { title: 'Baggy Street Set', desc: 'Oversized hoodie + wide-leg cargos', img: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80' },
    { title: 'Ribbed Co-ord', desc: 'Cream ribbed set with chunky sneakers', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80' },
    { title: 'Y2K Aesthetic', desc: 'Mesh top + mini skirt + platform shoes', img: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&q=80' },
  ],
}
