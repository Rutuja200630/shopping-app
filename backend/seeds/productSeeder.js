import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import Address from '../models/Address.js';

dotenv.config();

const products = [
  {
    "_id": "6a2f97cb07805bf53ccf7959",
    "name": "Pastel Embroidered Lehenga",
    "description": "A gorgeous pastel pink embroidered lehenga featuring premium silk fabric, delicate zari work, and a matching georgette dupatta. Ideal for weddings, receptions, and engagements.",
    "brand": "StyleAI Premium",
    "category": "Ethnic",
    "subCategory": "Lehenga",
    "material": "Silk",
    "fit": "Regular",
    "gender": "Women",
    "price": 4999,
    "originalPrice": 7999,
    "discount": 37,
    "images": [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Pink",
      "Gold"
    ],
    "inventory": 15,
    "occasionTags": [
      "Wedding",
      "Engagement",
      "Festive"
    ],
    "featured": true,
    "aiRecommended": true,
    "ratings": 4.8,
    "reviewsCount": 1
  },
  {
    "name": "Classic Silk Sherwani",
    "description": "A luxurious off-white silk sherwani styled with intricate gold embroidery. Features a premium velvet collar, matching churidar pants, and a brocade shawl.",
    "brand": "Royal Heritage",
    "category": "Ethnic",
    "subCategory": "Sherwani",
    "material": "Silk",
    "fit": "Slim Fit",
    "gender": "Men",
    "price": 6999,
    "originalPrice": 11999,
    "discount": 41,
    "images": [
      "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Off-White",
      "Gold"
    ],
    "inventory": 8,
    "occasionTags": [
      "Wedding",
      "Engagement"
    ],
    "featured": true,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 0
  },
  {
    "name": "Designer Anarkali Suit",
    "description": "An elegant emerald green Anarkali suit set in premium georgette. Includes heavily embroidered borders and a sheer net dupatta.",
    "brand": "StyleAI Premium",
    "category": "Ethnic",
    "subCategory": "Salwar Kameez",
    "material": "Georgette",
    "fit": "Regular",
    "gender": "Women",
    "price": 3499,
    "originalPrice": 4999,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Green"
    ],
    "inventory": 20,
    "occasionTags": [
      "Festive",
      "Engagement",
      "Wedding"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.4,
    "reviewsCount": 0
  },
  {
    "name": "Embroidered Kurta Set",
    "description": "Modern peach cotton silk kurta paired with white pajama pants. Finished with subtle neckline mirror embroidery.",
    "brand": "Urban Ethnic",
    "category": "Ethnic",
    "subCategory": "Kurta Pyjama",
    "material": "Cotton Silk",
    "fit": "Regular",
    "gender": "Men",
    "price": 1899,
    "originalPrice": 2799,
    "discount": 32,
    "images": [
      "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Peach",
      "White"
    ],
    "inventory": 35,
    "occasionTags": [
      "Engagement",
      "Festive",
      "Casual"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.2,
    "reviewsCount": 0
  },
  {
    "name": "Tailored Fit Navy Blazer",
    "description": "A classic navy blue blazer crafted from high-performance breathable wool-blend fabric. Offers a sharp outline for business meetings, conferences, or job interviews.",
    "brand": "Executive Wear",
    "category": "Formal",
    "subCategory": "Blazers",
    "material": "Wool Blend",
    "fit": "Slim Fit",
    "gender": "Men",
    "price": 3999,
    "originalPrice": 5999,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Navy Blue"
    ],
    "inventory": 14,
    "occasionTags": [
      "Office",
      "Engagement",
      "Formal"
    ],
    "featured": true,
    "aiRecommended": true,
    "ratings": 4,
    "reviewsCount": 1
  },
  {
    "name": "Double-Breasted Crimson Blazer",
    "description": "A commanding structured red double-breasted blazer for women. Finished with golden metal crest buttons and a notched collar.",
    "brand": "Executive Wear",
    "category": "Formal",
    "subCategory": "Blazers",
    "material": "Polyester Blend",
    "fit": "Regular",
    "gender": "Women",
    "price": 3299,
    "originalPrice": 4999,
    "discount": 34,
    "images": [
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Crimson Red"
    ],
    "inventory": 10,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.1,
    "reviewsCount": 0
  },
  {
    "name": "Classic White Dress Shirt",
    "description": "An essential structured cotton formal shirt for men. Made from easy-iron 100% organic long-staple cotton.",
    "brand": "Executive Wear",
    "category": "Formal",
    "subCategory": "Shirts",
    "material": "Organic Cotton",
    "fit": "Slim Fit",
    "gender": "Men",
    "price": 1499,
    "originalPrice": 1999,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "White"
    ],
    "inventory": 50,
    "occasionTags": [
      "Office",
      "College",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 0
  },
  {
    "name": "Pinstripe Wide-Leg Trousers",
    "description": "Sophisticated charcoal grey wide-leg trousers featuring a subtle pinstripe design, double-pleat front, and high waist.",
    "brand": "Executive Wear",
    "category": "Formal",
    "subCategory": "Trousers",
    "material": "Viscose Blend",
    "fit": "Regular",
    "gender": "Women",
    "price": 1799,
    "originalPrice": 2499,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Charcoal Grey"
    ],
    "inventory": 22,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.4,
    "reviewsCount": 0
  },
  {
    "name": "Silk Banarasi Saree",
    "description": "Exquisite royal blue Banarasi handloom woven silk saree with premium golden zari designs. Traditional and majestic.",
    "brand": "Royal Heritage",
    "category": "Ethnic",
    "subCategory": "Saree",
    "material": "Pure Silk",
    "fit": "Regular",
    "gender": "Women",
    "price": 5499,
    "originalPrice": 8999,
    "discount": 38,
    "images": [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Royal Blue",
      "Gold"
    ],
    "inventory": 11,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Traditional"
    ],
    "featured": true,
    "aiRecommended": true,
    "ratings": 4.6,
    "reviewsCount": 0
  },
  {
    "name": "Embellished Wedding Heels",
    "description": "Elegant golden slip-on heels with block design and rhinestone embellishments, perfect for traditional wear like lehengas and sarees.",
    "brand": "StyleAI Luxury",
    "category": "Ethnic",
    "subCategory": "Heels",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 1499,
    "originalPrice": 2499,
    "discount": 40,
    "images": [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Gold",
      "Bronze"
    ],
    "inventory": 20,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Engagement"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.7,
    "reviewsCount": 0
  },
  {
    "name": "Royal Golden Juttis",
    "description": "Handcrafted traditional Punjabi juttis featuring premium thread embroidery and gold beadwork.",
    "brand": "Royal Heritage",
    "category": "Ethnic",
    "subCategory": "Juttis",
    "material": "Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 899,
    "originalPrice": 1499,
    "discount": 40,
    "images": [
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39"
    ],
    "colors": [
      "Gold",
      "Yellow"
    ],
    "inventory": 15,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Engagement"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.5,
    "reviewsCount": 0
  },
  {
    "name": "Elegant Gold Clutch",
    "description": "A stylish golden metallic frame evening clutch with a detachable chain strap. Perfect accessory for weddings and traditional functions.",
    "brand": "StyleAI Accessories",
    "category": "Ethnic",
    "subCategory": "Handbags",
    "material": "Metal Silk",
    "fit": "One Size",
    "gender": "Women",
    "price": 799,
    "originalPrice": 1299,
    "discount": 38,
    "images": [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Gold"
    ],
    "inventory": 25,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Engagement",
      "Party"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.3,
    "reviewsCount": 0
  },
  {
    "name": "Velvet Embroidered Shawl",
    "description": "A premium maroon velvet shawl detailed with gold zari embroidery along the borders. Adds an elegant layer to any ethnic outfit.",
    "brand": "Royal Heritage",
    "category": "Ethnic",
    "subCategory": "Shawls",
    "material": "Velvet",
    "fit": "Regular",
    "gender": "Women",
    "price": 1999,
    "originalPrice": 2999,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Maroon",
      "Gold"
    ],
    "inventory": 12,
    "occasionTags": [
      "Wedding",
      "Festive"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.6,
    "reviewsCount": 0
  },
  {
    "name": "Traditional Mojaris",
    "description": "Classic off-white leather mojaris decorated with ethnic patterns. Ideal accompaniment for sherwanis and kurtas.",
    "brand": "Royal Heritage",
    "category": "Ethnic",
    "subCategory": "Shoes",
    "material": "Leather",
    "fit": "Regular",
    "gender": "Men",
    "price": 999,
    "originalPrice": 1599,
    "discount": 37,
    "images": [
      "https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10"
    ],
    "colors": [
      "Off-White",
      "Gold"
    ],
    "inventory": 18,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Engagement"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.4,
    "reviewsCount": 0
  },
  {
    "name": "Classic Leather Loafers",
    "description": "Slip-on formal dark brown leather loafers with cushioned footbed and textured outsole. Essential footwear for business styling.",
    "brand": "Executive Wear",
    "category": "Formal",
    "subCategory": "Shoes",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Men",
    "price": 2499,
    "originalPrice": 3999,
    "discount": 37,
    "images": [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10"
    ],
    "colors": [
      "Brown",
      "Dark Brown"
    ],
    "inventory": 15,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.5,
    "reviewsCount": 0
  },
  {
    "name": "StyleAI Premium Pink Silk Sarees 1",
    "description": "A beautifully styled women's Sarees perfect for your next look. Made from highly durable Silk fabric in a stylish Regular layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "StyleAI Premium",
    "category": "Ethnic",
    "subCategory": "Sarees",
    "material": "Silk",
    "fit": "Regular",
    "gender": "Women",
    "price": 800,
    "originalPrice": 1200,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?sig=w_0&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Pink"
    ],
    "inventory": 10,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Traditional"
    ],
    "featured": true,
    "aiRecommended": true,
    "ratings": 4,
    "reviewsCount": 0
  },
  {
    "name": "Urban Denim Gold Georgette Lehengas 2",
    "description": "A beautifully styled women's Lehengas perfect for your next look. Made from highly durable Georgette fabric in a stylish Slim Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Urban Denim",
    "category": "Ethnic",
    "subCategory": "Lehengas",
    "material": "Georgette",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 895,
    "originalPrice": 1342,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?sig=w_1&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Gold"
    ],
    "inventory": 11,
    "occasionTags": [
      "Wedding",
      "Reception",
      "Sangeet"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 1
  },
  {
    "name": "Executive Wear Black Cotton Kurtas 3",
    "description": "A beautifully styled women's Kurtas perfect for your next look. Made from highly durable Cotton fabric in a stylish Oversized layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Executive Wear",
    "category": "Ethnic",
    "subCategory": "Kurtas",
    "material": "Cotton",
    "fit": "Oversized",
    "gender": "Women",
    "price": 990,
    "originalPrice": 1485,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?sig=w_2&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black"
    ],
    "inventory": 12,
    "occasionTags": [
      "Festive",
      "Traditional",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 2
  },
  {
    "name": "StyleAI Streetwear White Wool Blend Dresses 4",
    "description": "A beautifully styled women's Dresses perfect for your next look. Made from highly durable Wool Blend fabric in a stylish Loose Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "StyleAI Streetwear",
    "category": "Casual",
    "subCategory": "Dresses",
    "material": "Wool Blend",
    "fit": "Loose Fit",
    "gender": "Women",
    "price": 1085,
    "originalPrice": 1627,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?sig=w_3&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "White"
    ],
    "inventory": 13,
    "occasionTags": [
      "Casual",
      "Summer",
      "Vacation",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 3
  },
  {
    "name": "StyleAI Essentials Green Polyester Blend Dresses 5",
    "description": "A beautifully styled women's Dresses perfect for your next look. Made from highly durable Polyester Blend fabric in a stylish Regular layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "StyleAI Essentials",
    "category": "Party",
    "subCategory": "Dresses",
    "material": "Polyester Blend",
    "fit": "Regular",
    "gender": "Women",
    "price": 1180,
    "originalPrice": 1770,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?sig=w_4&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Green"
    ],
    "inventory": 14,
    "occasionTags": [
      "Party",
      "Date Night",
      "Reception"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.4,
    "reviewsCount": 4
  },
  {
    "name": "Royal Heritage Red Denim Cotton Co-ord Sets 6",
    "description": "A beautifully styled women's Co-ord Sets perfect for your next look. Made from highly durable Denim Cotton fabric in a stylish Slim Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Royal Heritage",
    "category": "Casual",
    "subCategory": "Co-ord Sets",
    "material": "Denim Cotton",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 1275,
    "originalPrice": 1912,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?sig=w_5&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Red"
    ],
    "inventory": 15,
    "occasionTags": [
      "Casual",
      "Airport",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 5
  },
  {
    "name": "Graceful Blue Cotton Fleece Tops 7",
    "description": "A beautifully styled women's Tops perfect for your next look. Made from highly durable Cotton Fleece fabric in a stylish Oversized layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Graceful",
    "category": "Casual",
    "subCategory": "Tops",
    "material": "Cotton Fleece",
    "fit": "Oversized",
    "gender": "Women",
    "price": 1370,
    "originalPrice": 2055,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?sig=w_6&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Blue"
    ],
    "inventory": 16,
    "occasionTags": [
      "Casual",
      "College",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.6,
    "reviewsCount": 6
  },
  {
    "name": "Urban Ethnic Navy Blue Rayon Shirts 8",
    "description": "A beautifully styled women's Shirts perfect for your next look. Made from highly durable Rayon fabric in a stylish Loose Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Urban Ethnic",
    "category": "Formal",
    "subCategory": "Shirts",
    "material": "Rayon",
    "fit": "Loose Fit",
    "gender": "Women",
    "price": 1465,
    "originalPrice": 2197,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?sig=w_7&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Navy Blue"
    ],
    "inventory": 17,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 7
  },
  {
    "name": "Zara Charcoal Grey Satin Silk Jeans 9",
    "description": "A beautifully styled women's Jeans perfect for your next look. Made from highly durable Satin Silk fabric in a stylish Regular layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Zara",
    "category": "Casual",
    "subCategory": "Jeans",
    "material": "Satin Silk",
    "fit": "Regular",
    "gender": "Women",
    "price": 1560,
    "originalPrice": 2340,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?sig=w_8&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Charcoal Grey"
    ],
    "inventory": 18,
    "occasionTags": [
      "Casual",
      "College"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.8,
    "reviewsCount": 8
  },
  {
    "name": "Nike Light Blue Polyester Sequin Trousers 10",
    "description": "A beautifully styled women's Trousers perfect for your next look. Made from highly durable Polyester Sequin fabric in a stylish Slim Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Nike",
    "category": "Formal",
    "subCategory": "Trousers",
    "material": "Polyester Sequin",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 1655,
    "originalPrice": 2482,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?sig=w_9&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Light Blue"
    ],
    "inventory": 19,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 9
  },
  {
    "name": "Puma Beige Linen Skirts 11",
    "description": "A beautifully styled women's Skirts perfect for your next look. Made from highly durable Linen fabric in a stylish Oversized layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Puma",
    "category": "Casual",
    "subCategory": "Skirts",
    "material": "Linen",
    "fit": "Oversized",
    "gender": "Women",
    "price": 1750,
    "originalPrice": 2625,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?sig=w_10&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Beige"
    ],
    "inventory": 20,
    "occasionTags": [
      "Casual",
      "Summer",
      "Vacation"
    ],
    "featured": true,
    "aiRecommended": false,
    "ratings": 4,
    "reviewsCount": 10
  },
  {
    "name": "StyleAI Premium Burgundy Acrylic Wool Shorts 12",
    "description": "A beautifully styled women's Shorts perfect for your next look. Made from highly durable Acrylic Wool fabric in a stylish Loose Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "StyleAI Premium",
    "category": "Casual",
    "subCategory": "Shorts",
    "material": "Acrylic Wool",
    "fit": "Loose Fit",
    "gender": "Women",
    "price": 1845,
    "originalPrice": 2767,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?sig=w_11&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Burgundy"
    ],
    "inventory": 21,
    "occasionTags": [
      "Casual",
      "Vacation",
      "Summer"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 11
  },
  {
    "name": "Urban Denim Yellow Suede Leather Jumpsuits 13",
    "description": "A beautifully styled women's Jumpsuits perfect for your next look. Made from highly durable Suede Leather fabric in a stylish Regular layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Urban Denim",
    "category": "Casual",
    "subCategory": "Jumpsuits",
    "material": "Suede Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 1940,
    "originalPrice": 2910,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?sig=w_12&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Yellow"
    ],
    "inventory": 22,
    "occasionTags": [
      "Casual",
      "Party",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.2,
    "reviewsCount": 12
  },
  {
    "name": "Executive Wear Peach Pique Cotton Sarees 14",
    "description": "A beautifully styled women's Sarees perfect for your next look. Made from highly durable Pique Cotton fabric in a stylish Slim Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Executive Wear",
    "category": "Ethnic",
    "subCategory": "Sarees",
    "material": "Pique Cotton",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 2035,
    "originalPrice": 3052,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?sig=w_13&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Peach"
    ],
    "inventory": 23,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 13
  },
  {
    "name": "StyleAI Streetwear Orange Synthetic Leather Lehengas 15",
    "description": "A beautifully styled women's Lehengas perfect for your next look. Made from highly durable Synthetic Leather fabric in a stylish Oversized layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "StyleAI Streetwear",
    "category": "Ethnic",
    "subCategory": "Lehengas",
    "material": "Synthetic Leather",
    "fit": "Oversized",
    "gender": "Women",
    "price": 2130,
    "originalPrice": 3195,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?sig=w_14&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Orange"
    ],
    "inventory": 24,
    "occasionTags": [
      "Wedding",
      "Reception",
      "Sangeet"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.4,
    "reviewsCount": 14
  },
  {
    "name": "StyleAI Essentials Maroon Genuine Leather Kurtas 16",
    "description": "A beautifully styled women's Kurtas perfect for your next look. Made from highly durable Genuine Leather fabric in a stylish Loose Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "StyleAI Essentials",
    "category": "Ethnic",
    "subCategory": "Kurtas",
    "material": "Genuine Leather",
    "fit": "Loose Fit",
    "gender": "Women",
    "price": 2225,
    "originalPrice": 3337,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?sig=w_15&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Maroon"
    ],
    "inventory": 25,
    "occasionTags": [
      "Festive",
      "Traditional",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 0
  },
  {
    "name": "Royal Heritage Khaki Silk Dresses 17",
    "description": "A beautifully styled women's Dresses perfect for your next look. Made from highly durable Silk fabric in a stylish Regular layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Royal Heritage",
    "category": "Casual",
    "subCategory": "Dresses",
    "material": "Silk",
    "fit": "Regular",
    "gender": "Women",
    "price": 2320,
    "originalPrice": 3480,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?sig=w_16&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Khaki"
    ],
    "inventory": 26,
    "occasionTags": [
      "Casual",
      "Summer",
      "Vacation",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.6,
    "reviewsCount": 1
  },
  {
    "name": "Graceful Dark Brown Georgette Dresses 18",
    "description": "A beautifully styled women's Dresses perfect for your next look. Made from highly durable Georgette fabric in a stylish Slim Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Graceful",
    "category": "Party",
    "subCategory": "Dresses",
    "material": "Georgette",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 2415,
    "originalPrice": 3622,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?sig=w_17&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Dark Brown"
    ],
    "inventory": 27,
    "occasionTags": [
      "Party",
      "Date Night",
      "Reception"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 2
  },
  {
    "name": "Urban Ethnic Silver Cotton Co-ord Sets 19",
    "description": "A beautifully styled women's Co-ord Sets perfect for your next look. Made from highly durable Cotton fabric in a stylish Oversized layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Urban Ethnic",
    "category": "Casual",
    "subCategory": "Co-ord Sets",
    "material": "Cotton",
    "fit": "Oversized",
    "gender": "Women",
    "price": 2510,
    "originalPrice": 3765,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?sig=w_18&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Silver"
    ],
    "inventory": 28,
    "occasionTags": [
      "Casual",
      "Airport",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.8,
    "reviewsCount": 3
  },
  {
    "name": "Zara Pink Wool Blend Tops 20",
    "description": "A beautifully styled women's Tops perfect for your next look. Made from highly durable Wool Blend fabric in a stylish Loose Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Zara",
    "category": "Casual",
    "subCategory": "Tops",
    "material": "Wool Blend",
    "fit": "Loose Fit",
    "gender": "Women",
    "price": 2605,
    "originalPrice": 3907,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?sig=w_19&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Pink"
    ],
    "inventory": 29,
    "occasionTags": [
      "Casual",
      "College",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 4
  },
  {
    "name": "Nike Gold Polyester Blend Shirts 21",
    "description": "A beautifully styled women's Shirts perfect for your next look. Made from highly durable Polyester Blend fabric in a stylish Regular layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Nike",
    "category": "Formal",
    "subCategory": "Shirts",
    "material": "Polyester Blend",
    "fit": "Regular",
    "gender": "Women",
    "price": 2700,
    "originalPrice": 4050,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?sig=w_20&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Gold"
    ],
    "inventory": 30,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": true,
    "aiRecommended": true,
    "ratings": 4,
    "reviewsCount": 5
  },
  {
    "name": "Puma Black Denim Cotton Jeans 22",
    "description": "A beautifully styled women's Jeans perfect for your next look. Made from highly durable Denim Cotton fabric in a stylish Slim Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Puma",
    "category": "Casual",
    "subCategory": "Jeans",
    "material": "Denim Cotton",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 2795,
    "originalPrice": 4192,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?sig=w_21&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black"
    ],
    "inventory": 31,
    "occasionTags": [
      "Casual",
      "College"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 6
  },
  {
    "name": "StyleAI Premium White Cotton Fleece Trousers 23",
    "description": "A beautifully styled women's Trousers perfect for your next look. Made from highly durable Cotton Fleece fabric in a stylish Oversized layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "StyleAI Premium",
    "category": "Formal",
    "subCategory": "Trousers",
    "material": "Cotton Fleece",
    "fit": "Oversized",
    "gender": "Women",
    "price": 2890,
    "originalPrice": 4335,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?sig=w_22&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "White"
    ],
    "inventory": 32,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 7
  },
  {
    "name": "Urban Denim Green Rayon Skirts 24",
    "description": "A beautifully styled women's Skirts perfect for your next look. Made from highly durable Rayon fabric in a stylish Loose Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Urban Denim",
    "category": "Casual",
    "subCategory": "Skirts",
    "material": "Rayon",
    "fit": "Loose Fit",
    "gender": "Women",
    "price": 2985,
    "originalPrice": 4477,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?sig=w_23&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Green"
    ],
    "inventory": 33,
    "occasionTags": [
      "Casual",
      "Summer",
      "Vacation"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 8
  },
  {
    "name": "Executive Wear Red Satin Silk Shorts 25",
    "description": "A beautifully styled women's Shorts perfect for your next look. Made from highly durable Satin Silk fabric in a stylish Regular layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Executive Wear",
    "category": "Casual",
    "subCategory": "Shorts",
    "material": "Satin Silk",
    "fit": "Regular",
    "gender": "Women",
    "price": 3080,
    "originalPrice": 4620,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?sig=w_24&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Red"
    ],
    "inventory": 34,
    "occasionTags": [
      "Casual",
      "Vacation",
      "Summer"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.4,
    "reviewsCount": 9
  },
  {
    "name": "StyleAI Streetwear Blue Polyester Sequin Jumpsuits 26",
    "description": "A beautifully styled women's Jumpsuits perfect for your next look. Made from highly durable Polyester Sequin fabric in a stylish Slim Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "StyleAI Streetwear",
    "category": "Casual",
    "subCategory": "Jumpsuits",
    "material": "Polyester Sequin",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 3175,
    "originalPrice": 4762,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?sig=w_25&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Blue"
    ],
    "inventory": 35,
    "occasionTags": [
      "Casual",
      "Party",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 10
  },
  {
    "name": "StyleAI Essentials Navy Blue Linen Sarees 27",
    "description": "A beautifully styled women's Sarees perfect for your next look. Made from highly durable Linen fabric in a stylish Oversized layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "StyleAI Essentials",
    "category": "Ethnic",
    "subCategory": "Sarees",
    "material": "Linen",
    "fit": "Oversized",
    "gender": "Women",
    "price": 3270,
    "originalPrice": 4905,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?sig=w_26&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Navy Blue"
    ],
    "inventory": 36,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.6,
    "reviewsCount": 11
  },
  {
    "name": "Royal Heritage Charcoal Grey Acrylic Wool Lehengas 28",
    "description": "A beautifully styled women's Lehengas perfect for your next look. Made from highly durable Acrylic Wool fabric in a stylish Loose Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Royal Heritage",
    "category": "Ethnic",
    "subCategory": "Lehengas",
    "material": "Acrylic Wool",
    "fit": "Loose Fit",
    "gender": "Women",
    "price": 3365,
    "originalPrice": 5047,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?sig=w_27&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Charcoal Grey"
    ],
    "inventory": 37,
    "occasionTags": [
      "Wedding",
      "Reception",
      "Sangeet"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 12
  },
  {
    "name": "Graceful Light Blue Suede Leather Kurtas 29",
    "description": "A beautifully styled women's Kurtas perfect for your next look. Made from highly durable Suede Leather fabric in a stylish Regular layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Graceful",
    "category": "Ethnic",
    "subCategory": "Kurtas",
    "material": "Suede Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 3460,
    "originalPrice": 5190,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?sig=w_28&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Light Blue"
    ],
    "inventory": 38,
    "occasionTags": [
      "Festive",
      "Traditional",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.8,
    "reviewsCount": 13
  },
  {
    "name": "Urban Ethnic Beige Pique Cotton Dresses 30",
    "description": "A beautifully styled women's Dresses perfect for your next look. Made from highly durable Pique Cotton fabric in a stylish Slim Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Urban Ethnic",
    "category": "Casual",
    "subCategory": "Dresses",
    "material": "Pique Cotton",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 3555,
    "originalPrice": 5332,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?sig=w_29&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Beige"
    ],
    "inventory": 39,
    "occasionTags": [
      "Casual",
      "Summer",
      "Vacation",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 14
  },
  {
    "name": "Zara Burgundy Synthetic Leather Dresses 31",
    "description": "A beautifully styled women's Dresses perfect for your next look. Made from highly durable Synthetic Leather fabric in a stylish Oversized layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Zara",
    "category": "Party",
    "subCategory": "Dresses",
    "material": "Synthetic Leather",
    "fit": "Oversized",
    "gender": "Women",
    "price": 3650,
    "originalPrice": 5475,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?sig=w_30&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Burgundy"
    ],
    "inventory": 40,
    "occasionTags": [
      "Party",
      "Date Night",
      "Reception"
    ],
    "featured": true,
    "aiRecommended": false,
    "ratings": 4,
    "reviewsCount": 0
  },
  {
    "name": "Nike Yellow Genuine Leather Co-ord Sets 32",
    "description": "A beautifully styled women's Co-ord Sets perfect for your next look. Made from highly durable Genuine Leather fabric in a stylish Loose Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Nike",
    "category": "Casual",
    "subCategory": "Co-ord Sets",
    "material": "Genuine Leather",
    "fit": "Loose Fit",
    "gender": "Women",
    "price": 3745,
    "originalPrice": 5617,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?sig=w_31&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Yellow"
    ],
    "inventory": 41,
    "occasionTags": [
      "Casual",
      "Airport",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 1
  },
  {
    "name": "Puma Peach Silk Tops 33",
    "description": "A beautifully styled women's Tops perfect for your next look. Made from highly durable Silk fabric in a stylish Regular layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Puma",
    "category": "Casual",
    "subCategory": "Tops",
    "material": "Silk",
    "fit": "Regular",
    "gender": "Women",
    "price": 3840,
    "originalPrice": 5760,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?sig=w_32&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Peach"
    ],
    "inventory": 42,
    "occasionTags": [
      "Casual",
      "College",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.2,
    "reviewsCount": 2
  },
  {
    "name": "StyleAI Premium Orange Georgette Shirts 34",
    "description": "A beautifully styled women's Shirts perfect for your next look. Made from highly durable Georgette fabric in a stylish Slim Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "StyleAI Premium",
    "category": "Formal",
    "subCategory": "Shirts",
    "material": "Georgette",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 3935,
    "originalPrice": 5902,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1509319117193-57bab727e09d?sig=w_33&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Orange"
    ],
    "inventory": 43,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 3
  },
  {
    "name": "Urban Denim Maroon Cotton Jeans 35",
    "description": "A beautifully styled women's Jeans perfect for your next look. Made from highly durable Cotton fabric in a stylish Oversized layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Urban Denim",
    "category": "Casual",
    "subCategory": "Jeans",
    "material": "Cotton",
    "fit": "Oversized",
    "gender": "Women",
    "price": 4030,
    "originalPrice": 6045,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?sig=w_34&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Maroon"
    ],
    "inventory": 44,
    "occasionTags": [
      "Casual",
      "College"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.4,
    "reviewsCount": 4
  },
  {
    "name": "Executive Wear Khaki Wool Blend Trousers 36",
    "description": "A beautifully styled women's Trousers perfect for your next look. Made from highly durable Wool Blend fabric in a stylish Loose Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Executive Wear",
    "category": "Formal",
    "subCategory": "Trousers",
    "material": "Wool Blend",
    "fit": "Loose Fit",
    "gender": "Women",
    "price": 4125,
    "originalPrice": 6187,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?sig=w_35&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Khaki"
    ],
    "inventory": 45,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 5
  },
  {
    "name": "StyleAI Streetwear Dark Brown Polyester Blend Skirts 37",
    "description": "A beautifully styled women's Skirts perfect for your next look. Made from highly durable Polyester Blend fabric in a stylish Regular layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "StyleAI Streetwear",
    "category": "Casual",
    "subCategory": "Skirts",
    "material": "Polyester Blend",
    "fit": "Regular",
    "gender": "Women",
    "price": 4220,
    "originalPrice": 6330,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?sig=w_36&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Dark Brown"
    ],
    "inventory": 46,
    "occasionTags": [
      "Casual",
      "Summer",
      "Vacation"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.6,
    "reviewsCount": 6
  },
  {
    "name": "StyleAI Essentials Silver Denim Cotton Shorts 38",
    "description": "A beautifully styled women's Shorts perfect for your next look. Made from highly durable Denim Cotton fabric in a stylish Slim Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "StyleAI Essentials",
    "category": "Casual",
    "subCategory": "Shorts",
    "material": "Denim Cotton",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 4315,
    "originalPrice": 6472,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?sig=w_37&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Silver"
    ],
    "inventory": 47,
    "occasionTags": [
      "Casual",
      "Vacation",
      "Summer"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 7
  },
  {
    "name": "Royal Heritage Pink Cotton Fleece Jumpsuits 39",
    "description": "A beautifully styled women's Jumpsuits perfect for your next look. Made from highly durable Cotton Fleece fabric in a stylish Oversized layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Royal Heritage",
    "category": "Casual",
    "subCategory": "Jumpsuits",
    "material": "Cotton Fleece",
    "fit": "Oversized",
    "gender": "Women",
    "price": 4410,
    "originalPrice": 6615,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?sig=w_38&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Pink"
    ],
    "inventory": 48,
    "occasionTags": [
      "Casual",
      "Party",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.8,
    "reviewsCount": 8
  },
  {
    "name": "Graceful Gold Rayon Sarees 40",
    "description": "A beautifully styled women's Sarees perfect for your next look. Made from highly durable Rayon fabric in a stylish Loose Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Graceful",
    "category": "Ethnic",
    "subCategory": "Sarees",
    "material": "Rayon",
    "fit": "Loose Fit",
    "gender": "Women",
    "price": 4505,
    "originalPrice": 6757,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?sig=w_39&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Gold"
    ],
    "inventory": 49,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 9
  },
  {
    "name": "Urban Ethnic Black Satin Silk Lehengas 41",
    "description": "A beautifully styled women's Lehengas perfect for your next look. Made from highly durable Satin Silk fabric in a stylish Regular layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Urban Ethnic",
    "category": "Ethnic",
    "subCategory": "Lehengas",
    "material": "Satin Silk",
    "fit": "Regular",
    "gender": "Women",
    "price": 4600,
    "originalPrice": 6900,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?sig=w_40&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black"
    ],
    "inventory": 10,
    "occasionTags": [
      "Wedding",
      "Reception",
      "Sangeet"
    ],
    "featured": true,
    "aiRecommended": true,
    "ratings": 4,
    "reviewsCount": 10
  },
  {
    "name": "Zara White Polyester Sequin Kurtas 42",
    "description": "A beautifully styled women's Kurtas perfect for your next look. Made from highly durable Polyester Sequin fabric in a stylish Slim Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Zara",
    "category": "Ethnic",
    "subCategory": "Kurtas",
    "material": "Polyester Sequin",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 4695,
    "originalPrice": 7042,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?sig=w_41&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "White"
    ],
    "inventory": 11,
    "occasionTags": [
      "Festive",
      "Traditional",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 11
  },
  {
    "name": "Nike Green Linen Dresses 43",
    "description": "A beautifully styled women's Dresses perfect for your next look. Made from highly durable Linen fabric in a stylish Oversized layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Nike",
    "category": "Casual",
    "subCategory": "Dresses",
    "material": "Linen",
    "fit": "Oversized",
    "gender": "Women",
    "price": 4790,
    "originalPrice": 7185,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?sig=w_42&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Green"
    ],
    "inventory": 12,
    "occasionTags": [
      "Casual",
      "Summer",
      "Vacation",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 12
  },
  {
    "name": "Puma Red Acrylic Wool Dresses 44",
    "description": "A beautifully styled women's Dresses perfect for your next look. Made from highly durable Acrylic Wool fabric in a stylish Loose Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Puma",
    "category": "Party",
    "subCategory": "Dresses",
    "material": "Acrylic Wool",
    "fit": "Loose Fit",
    "gender": "Women",
    "price": 4885,
    "originalPrice": 7327,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?sig=w_43&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Red"
    ],
    "inventory": 13,
    "occasionTags": [
      "Party",
      "Date Night",
      "Reception"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 13
  },
  {
    "name": "StyleAI Premium Blue Suede Leather Co-ord Sets 45",
    "description": "A beautifully styled women's Co-ord Sets perfect for your next look. Made from highly durable Suede Leather fabric in a stylish Regular layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "StyleAI Premium",
    "category": "Casual",
    "subCategory": "Co-ord Sets",
    "material": "Suede Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 4980,
    "originalPrice": 7470,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?sig=w_44&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Blue"
    ],
    "inventory": 14,
    "occasionTags": [
      "Casual",
      "Airport",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.4,
    "reviewsCount": 14
  },
  {
    "name": "Urban Denim Navy Blue Pique Cotton Tops 46",
    "description": "A beautifully styled women's Tops perfect for your next look. Made from highly durable Pique Cotton fabric in a stylish Slim Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Urban Denim",
    "category": "Casual",
    "subCategory": "Tops",
    "material": "Pique Cotton",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 5075,
    "originalPrice": 7612,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?sig=w_45&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Navy Blue"
    ],
    "inventory": 15,
    "occasionTags": [
      "Casual",
      "College",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 0
  },
  {
    "name": "Executive Wear Charcoal Grey Synthetic Leather Shirts 47",
    "description": "A beautifully styled women's Shirts perfect for your next look. Made from highly durable Synthetic Leather fabric in a stylish Oversized layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Executive Wear",
    "category": "Formal",
    "subCategory": "Shirts",
    "material": "Synthetic Leather",
    "fit": "Oversized",
    "gender": "Women",
    "price": 5170,
    "originalPrice": 7755,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?sig=w_46&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Charcoal Grey"
    ],
    "inventory": 16,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.6,
    "reviewsCount": 1
  },
  {
    "name": "StyleAI Streetwear Light Blue Genuine Leather Jeans 48",
    "description": "A beautifully styled women's Jeans perfect for your next look. Made from highly durable Genuine Leather fabric in a stylish Loose Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "StyleAI Streetwear",
    "category": "Casual",
    "subCategory": "Jeans",
    "material": "Genuine Leather",
    "fit": "Loose Fit",
    "gender": "Women",
    "price": 5265,
    "originalPrice": 7897,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?sig=w_47&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Light Blue"
    ],
    "inventory": 17,
    "occasionTags": [
      "Casual",
      "College"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 2
  },
  {
    "name": "StyleAI Essentials Beige Silk Trousers 49",
    "description": "A beautifully styled women's Trousers perfect for your next look. Made from highly durable Silk fabric in a stylish Regular layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "StyleAI Essentials",
    "category": "Formal",
    "subCategory": "Trousers",
    "material": "Silk",
    "fit": "Regular",
    "gender": "Women",
    "price": 5360,
    "originalPrice": 8040,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?sig=w_48&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Beige"
    ],
    "inventory": 18,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.8,
    "reviewsCount": 3
  },
  {
    "name": "Royal Heritage Burgundy Georgette Skirts 50",
    "description": "A beautifully styled women's Skirts perfect for your next look. Made from highly durable Georgette fabric in a stylish Slim Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Royal Heritage",
    "category": "Casual",
    "subCategory": "Skirts",
    "material": "Georgette",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 5455,
    "originalPrice": 8182,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?sig=w_49&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Burgundy"
    ],
    "inventory": 19,
    "occasionTags": [
      "Casual",
      "Summer",
      "Vacation"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 4
  },
  {
    "name": "Graceful Yellow Cotton Shorts 51",
    "description": "A beautifully styled women's Shorts perfect for your next look. Made from highly durable Cotton fabric in a stylish Oversized layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Graceful",
    "category": "Casual",
    "subCategory": "Shorts",
    "material": "Cotton",
    "fit": "Oversized",
    "gender": "Women",
    "price": 5550,
    "originalPrice": 8325,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?sig=w_50&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Yellow"
    ],
    "inventory": 20,
    "occasionTags": [
      "Casual",
      "Vacation",
      "Summer"
    ],
    "featured": true,
    "aiRecommended": false,
    "ratings": 4,
    "reviewsCount": 5
  },
  {
    "name": "Urban Ethnic Peach Wool Blend Jumpsuits 52",
    "description": "A beautifully styled women's Jumpsuits perfect for your next look. Made from highly durable Wool Blend fabric in a stylish Loose Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Urban Ethnic",
    "category": "Casual",
    "subCategory": "Jumpsuits",
    "material": "Wool Blend",
    "fit": "Loose Fit",
    "gender": "Women",
    "price": 5645,
    "originalPrice": 8467,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?sig=w_51&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Peach"
    ],
    "inventory": 21,
    "occasionTags": [
      "Casual",
      "Party",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 6
  },
  {
    "name": "Zara Orange Polyester Blend Sarees 53",
    "description": "A beautifully styled women's Sarees perfect for your next look. Made from highly durable Polyester Blend fabric in a stylish Regular layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Zara",
    "category": "Ethnic",
    "subCategory": "Sarees",
    "material": "Polyester Blend",
    "fit": "Regular",
    "gender": "Women",
    "price": 5740,
    "originalPrice": 8610,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?sig=w_52&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Orange"
    ],
    "inventory": 22,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.2,
    "reviewsCount": 7
  },
  {
    "name": "Nike Maroon Denim Cotton Lehengas 54",
    "description": "A beautifully styled women's Lehengas perfect for your next look. Made from highly durable Denim Cotton fabric in a stylish Slim Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Nike",
    "category": "Ethnic",
    "subCategory": "Lehengas",
    "material": "Denim Cotton",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 5835,
    "originalPrice": 8752,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?sig=w_53&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Maroon"
    ],
    "inventory": 23,
    "occasionTags": [
      "Wedding",
      "Reception",
      "Sangeet"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 8
  },
  {
    "name": "Puma Khaki Cotton Fleece Kurtas 55",
    "description": "A beautifully styled women's Kurtas perfect for your next look. Made from highly durable Cotton Fleece fabric in a stylish Oversized layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Puma",
    "category": "Ethnic",
    "subCategory": "Kurtas",
    "material": "Cotton Fleece",
    "fit": "Oversized",
    "gender": "Women",
    "price": 5930,
    "originalPrice": 8895,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?sig=w_54&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Khaki"
    ],
    "inventory": 24,
    "occasionTags": [
      "Festive",
      "Traditional",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.4,
    "reviewsCount": 9
  },
  {
    "name": "StyleAI Premium Dark Brown Rayon Dresses 56",
    "description": "A beautifully styled women's Dresses perfect for your next look. Made from highly durable Rayon fabric in a stylish Loose Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "StyleAI Premium",
    "category": "Casual",
    "subCategory": "Dresses",
    "material": "Rayon",
    "fit": "Loose Fit",
    "gender": "Women",
    "price": 6025,
    "originalPrice": 9037,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?sig=w_55&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Dark Brown"
    ],
    "inventory": 25,
    "occasionTags": [
      "Casual",
      "Summer",
      "Vacation",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 10
  },
  {
    "name": "Urban Denim Silver Satin Silk Dresses 57",
    "description": "A beautifully styled women's Dresses perfect for your next look. Made from highly durable Satin Silk fabric in a stylish Regular layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Urban Denim",
    "category": "Party",
    "subCategory": "Dresses",
    "material": "Satin Silk",
    "fit": "Regular",
    "gender": "Women",
    "price": 6120,
    "originalPrice": 9180,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?sig=w_56&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Silver"
    ],
    "inventory": 26,
    "occasionTags": [
      "Party",
      "Date Night",
      "Reception"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.6,
    "reviewsCount": 11
  },
  {
    "name": "Executive Wear Pink Polyester Sequin Co-ord Sets 58",
    "description": "A beautifully styled women's Co-ord Sets perfect for your next look. Made from highly durable Polyester Sequin fabric in a stylish Slim Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Executive Wear",
    "category": "Casual",
    "subCategory": "Co-ord Sets",
    "material": "Polyester Sequin",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 6215,
    "originalPrice": 9322,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?sig=w_57&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Pink"
    ],
    "inventory": 27,
    "occasionTags": [
      "Casual",
      "Airport",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 12
  },
  {
    "name": "StyleAI Streetwear Gold Linen Tops 59",
    "description": "A beautifully styled women's Tops perfect for your next look. Made from highly durable Linen fabric in a stylish Oversized layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "StyleAI Streetwear",
    "category": "Casual",
    "subCategory": "Tops",
    "material": "Linen",
    "fit": "Oversized",
    "gender": "Women",
    "price": 6310,
    "originalPrice": 9465,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1509319117193-57bab727e09d?sig=w_58&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Gold"
    ],
    "inventory": 28,
    "occasionTags": [
      "Casual",
      "College",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.8,
    "reviewsCount": 13
  },
  {
    "name": "StyleAI Essentials Black Acrylic Wool Shirts 60",
    "description": "A beautifully styled women's Shirts perfect for your next look. Made from highly durable Acrylic Wool fabric in a stylish Loose Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "StyleAI Essentials",
    "category": "Formal",
    "subCategory": "Shirts",
    "material": "Acrylic Wool",
    "fit": "Loose Fit",
    "gender": "Women",
    "price": 6405,
    "originalPrice": 9607,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?sig=w_59&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black"
    ],
    "inventory": 29,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 14
  },
  {
    "name": "Royal Heritage White Suede Leather Jeans 61",
    "description": "A beautifully styled women's Jeans perfect for your next look. Made from highly durable Suede Leather fabric in a stylish Regular layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Royal Heritage",
    "category": "Casual",
    "subCategory": "Jeans",
    "material": "Suede Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 6500,
    "originalPrice": 9750,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?sig=w_60&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "White"
    ],
    "inventory": 30,
    "occasionTags": [
      "Casual",
      "College"
    ],
    "featured": true,
    "aiRecommended": true,
    "ratings": 4,
    "reviewsCount": 0
  },
  {
    "name": "Graceful Green Pique Cotton Trousers 62",
    "description": "A beautifully styled women's Trousers perfect for your next look. Made from highly durable Pique Cotton fabric in a stylish Slim Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Graceful",
    "category": "Formal",
    "subCategory": "Trousers",
    "material": "Pique Cotton",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 6595,
    "originalPrice": 9892,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?sig=w_61&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Green"
    ],
    "inventory": 31,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 1
  },
  {
    "name": "Urban Ethnic Red Synthetic Leather Skirts 63",
    "description": "A beautifully styled women's Skirts perfect for your next look. Made from highly durable Synthetic Leather fabric in a stylish Oversized layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Urban Ethnic",
    "category": "Casual",
    "subCategory": "Skirts",
    "material": "Synthetic Leather",
    "fit": "Oversized",
    "gender": "Women",
    "price": 6690,
    "originalPrice": 10035,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?sig=w_62&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Red"
    ],
    "inventory": 32,
    "occasionTags": [
      "Casual",
      "Summer",
      "Vacation"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 2
  },
  {
    "name": "Zara Blue Genuine Leather Shorts 64",
    "description": "A beautifully styled women's Shorts perfect for your next look. Made from highly durable Genuine Leather fabric in a stylish Loose Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Zara",
    "category": "Casual",
    "subCategory": "Shorts",
    "material": "Genuine Leather",
    "fit": "Loose Fit",
    "gender": "Women",
    "price": 6785,
    "originalPrice": 10177,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?sig=w_63&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Blue"
    ],
    "inventory": 33,
    "occasionTags": [
      "Casual",
      "Vacation",
      "Summer"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 3
  },
  {
    "name": "Nike Navy Blue Silk Jumpsuits 65",
    "description": "A beautifully styled women's Jumpsuits perfect for your next look. Made from highly durable Silk fabric in a stylish Regular layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Nike",
    "category": "Casual",
    "subCategory": "Jumpsuits",
    "material": "Silk",
    "fit": "Regular",
    "gender": "Women",
    "price": 6880,
    "originalPrice": 10320,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?sig=w_64&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Navy Blue"
    ],
    "inventory": 34,
    "occasionTags": [
      "Casual",
      "Party",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.4,
    "reviewsCount": 4
  },
  {
    "name": "Puma Charcoal Grey Georgette Sarees 66",
    "description": "A beautifully styled women's Sarees perfect for your next look. Made from highly durable Georgette fabric in a stylish Slim Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Puma",
    "category": "Ethnic",
    "subCategory": "Sarees",
    "material": "Georgette",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 6975,
    "originalPrice": 10462,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?sig=w_65&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Charcoal Grey"
    ],
    "inventory": 35,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 5
  },
  {
    "name": "StyleAI Premium Light Blue Cotton Lehengas 67",
    "description": "A beautifully styled women's Lehengas perfect for your next look. Made from highly durable Cotton fabric in a stylish Oversized layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "StyleAI Premium",
    "category": "Ethnic",
    "subCategory": "Lehengas",
    "material": "Cotton",
    "fit": "Oversized",
    "gender": "Women",
    "price": 7070,
    "originalPrice": 10605,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?sig=w_66&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Light Blue"
    ],
    "inventory": 36,
    "occasionTags": [
      "Wedding",
      "Reception",
      "Sangeet"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.6,
    "reviewsCount": 6
  },
  {
    "name": "Urban Denim Beige Wool Blend Kurtas 68",
    "description": "A beautifully styled women's Kurtas perfect for your next look. Made from highly durable Wool Blend fabric in a stylish Loose Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Urban Denim",
    "category": "Ethnic",
    "subCategory": "Kurtas",
    "material": "Wool Blend",
    "fit": "Loose Fit",
    "gender": "Women",
    "price": 7165,
    "originalPrice": 10747,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?sig=w_67&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Beige"
    ],
    "inventory": 37,
    "occasionTags": [
      "Festive",
      "Traditional",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 7
  },
  {
    "name": "Executive Wear Burgundy Polyester Blend Dresses 69",
    "description": "A beautifully styled women's Dresses perfect for your next look. Made from highly durable Polyester Blend fabric in a stylish Regular layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Executive Wear",
    "category": "Casual",
    "subCategory": "Dresses",
    "material": "Polyester Blend",
    "fit": "Regular",
    "gender": "Women",
    "price": 7260,
    "originalPrice": 10890,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?sig=w_68&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Burgundy"
    ],
    "inventory": 38,
    "occasionTags": [
      "Casual",
      "Summer",
      "Vacation",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.8,
    "reviewsCount": 8
  },
  {
    "name": "StyleAI Streetwear Yellow Denim Cotton Dresses 70",
    "description": "A beautifully styled women's Dresses perfect for your next look. Made from highly durable Denim Cotton fabric in a stylish Slim Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "StyleAI Streetwear",
    "category": "Party",
    "subCategory": "Dresses",
    "material": "Denim Cotton",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 7355,
    "originalPrice": 11032,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?sig=w_69&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Yellow"
    ],
    "inventory": 39,
    "occasionTags": [
      "Party",
      "Date Night",
      "Reception"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 9
  },
  {
    "name": "StyleAI Essentials Peach Cotton Fleece Co-ord Sets 71",
    "description": "A beautifully styled women's Co-ord Sets perfect for your next look. Made from highly durable Cotton Fleece fabric in a stylish Oversized layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "StyleAI Essentials",
    "category": "Casual",
    "subCategory": "Co-ord Sets",
    "material": "Cotton Fleece",
    "fit": "Oversized",
    "gender": "Women",
    "price": 7450,
    "originalPrice": 11175,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?sig=w_70&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Peach"
    ],
    "inventory": 40,
    "occasionTags": [
      "Casual",
      "Airport",
      "Travel"
    ],
    "featured": true,
    "aiRecommended": false,
    "ratings": 4,
    "reviewsCount": 10
  },
  {
    "name": "Royal Heritage Orange Rayon Tops 72",
    "description": "A beautifully styled women's Tops perfect for your next look. Made from highly durable Rayon fabric in a stylish Loose Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Royal Heritage",
    "category": "Casual",
    "subCategory": "Tops",
    "material": "Rayon",
    "fit": "Loose Fit",
    "gender": "Women",
    "price": 7545,
    "originalPrice": 11317,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?sig=w_71&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Orange"
    ],
    "inventory": 41,
    "occasionTags": [
      "Casual",
      "College",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 11
  },
  {
    "name": "Graceful Maroon Satin Silk Shirts 73",
    "description": "A beautifully styled women's Shirts perfect for your next look. Made from highly durable Satin Silk fabric in a stylish Regular layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Graceful",
    "category": "Formal",
    "subCategory": "Shirts",
    "material": "Satin Silk",
    "fit": "Regular",
    "gender": "Women",
    "price": 7640,
    "originalPrice": 11460,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?sig=w_72&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Maroon"
    ],
    "inventory": 42,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.2,
    "reviewsCount": 12
  },
  {
    "name": "Urban Ethnic Khaki Polyester Sequin Jeans 74",
    "description": "A beautifully styled women's Jeans perfect for your next look. Made from highly durable Polyester Sequin fabric in a stylish Slim Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Urban Ethnic",
    "category": "Casual",
    "subCategory": "Jeans",
    "material": "Polyester Sequin",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 7735,
    "originalPrice": 11602,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?sig=w_73&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Khaki"
    ],
    "inventory": 43,
    "occasionTags": [
      "Casual",
      "College"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 13
  },
  {
    "name": "Zara Dark Brown Linen Trousers 75",
    "description": "A beautifully styled women's Trousers perfect for your next look. Made from highly durable Linen fabric in a stylish Oversized layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Zara",
    "category": "Formal",
    "subCategory": "Trousers",
    "material": "Linen",
    "fit": "Oversized",
    "gender": "Women",
    "price": 7830,
    "originalPrice": 11745,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?sig=w_74&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Dark Brown"
    ],
    "inventory": 44,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.4,
    "reviewsCount": 14
  },
  {
    "name": "Nike Silver Acrylic Wool Skirts 76",
    "description": "A beautifully styled women's Skirts perfect for your next look. Made from highly durable Acrylic Wool fabric in a stylish Loose Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Nike",
    "category": "Casual",
    "subCategory": "Skirts",
    "material": "Acrylic Wool",
    "fit": "Loose Fit",
    "gender": "Women",
    "price": 7925,
    "originalPrice": 11887,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?sig=w_75&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Silver"
    ],
    "inventory": 45,
    "occasionTags": [
      "Casual",
      "Summer",
      "Vacation"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 0
  },
  {
    "name": "Puma Pink Suede Leather Shorts 77",
    "description": "A beautifully styled women's Shorts perfect for your next look. Made from highly durable Suede Leather fabric in a stylish Regular layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Puma",
    "category": "Casual",
    "subCategory": "Shorts",
    "material": "Suede Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 8020,
    "originalPrice": 12030,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?sig=w_76&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Pink"
    ],
    "inventory": 46,
    "occasionTags": [
      "Casual",
      "Vacation",
      "Summer"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.6,
    "reviewsCount": 1
  },
  {
    "name": "StyleAI Premium Gold Pique Cotton Jumpsuits 78",
    "description": "A beautifully styled women's Jumpsuits perfect for your next look. Made from highly durable Pique Cotton fabric in a stylish Slim Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "StyleAI Premium",
    "category": "Casual",
    "subCategory": "Jumpsuits",
    "material": "Pique Cotton",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 8115,
    "originalPrice": 12172,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?sig=w_77&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Gold"
    ],
    "inventory": 47,
    "occasionTags": [
      "Casual",
      "Party",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 2
  },
  {
    "name": "Urban Denim Black Synthetic Leather Sarees 79",
    "description": "A beautifully styled women's Sarees perfect for your next look. Made from highly durable Synthetic Leather fabric in a stylish Oversized layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Urban Denim",
    "category": "Ethnic",
    "subCategory": "Sarees",
    "material": "Synthetic Leather",
    "fit": "Oversized",
    "gender": "Women",
    "price": 8210,
    "originalPrice": 12315,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?sig=w_78&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black"
    ],
    "inventory": 48,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.8,
    "reviewsCount": 3
  },
  {
    "name": "Executive Wear White Genuine Leather Lehengas 80",
    "description": "A beautifully styled women's Lehengas perfect for your next look. Made from highly durable Genuine Leather fabric in a stylish Loose Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Executive Wear",
    "category": "Ethnic",
    "subCategory": "Lehengas",
    "material": "Genuine Leather",
    "fit": "Loose Fit",
    "gender": "Women",
    "price": 8305,
    "originalPrice": 12457,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?sig=w_79&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "White"
    ],
    "inventory": 49,
    "occasionTags": [
      "Wedding",
      "Reception",
      "Sangeet"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 4
  },
  {
    "name": "StyleAI Streetwear Green Silk Kurtas 81",
    "description": "A beautifully styled women's Kurtas perfect for your next look. Made from highly durable Silk fabric in a stylish Regular layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "StyleAI Streetwear",
    "category": "Ethnic",
    "subCategory": "Kurtas",
    "material": "Silk",
    "fit": "Regular",
    "gender": "Women",
    "price": 8400,
    "originalPrice": 12600,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?sig=w_80&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Green"
    ],
    "inventory": 10,
    "occasionTags": [
      "Festive",
      "Traditional",
      "Daily Wear"
    ],
    "featured": true,
    "aiRecommended": true,
    "ratings": 4,
    "reviewsCount": 5
  },
  {
    "name": "StyleAI Essentials Red Georgette Dresses 82",
    "description": "A beautifully styled women's Dresses perfect for your next look. Made from highly durable Georgette fabric in a stylish Slim Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "StyleAI Essentials",
    "category": "Casual",
    "subCategory": "Dresses",
    "material": "Georgette",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 8495,
    "originalPrice": 12742,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?sig=w_81&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Red"
    ],
    "inventory": 11,
    "occasionTags": [
      "Casual",
      "Summer",
      "Vacation",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 6
  },
  {
    "name": "Royal Heritage Blue Cotton Dresses 83",
    "description": "A beautifully styled women's Dresses perfect for your next look. Made from highly durable Cotton fabric in a stylish Oversized layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Royal Heritage",
    "category": "Party",
    "subCategory": "Dresses",
    "material": "Cotton",
    "fit": "Oversized",
    "gender": "Women",
    "price": 8590,
    "originalPrice": 12885,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?sig=w_82&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Blue"
    ],
    "inventory": 12,
    "occasionTags": [
      "Party",
      "Date Night",
      "Reception"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 7
  },
  {
    "name": "Graceful Navy Blue Wool Blend Co-ord Sets 84",
    "description": "A beautifully styled women's Co-ord Sets perfect for your next look. Made from highly durable Wool Blend fabric in a stylish Loose Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Graceful",
    "category": "Casual",
    "subCategory": "Co-ord Sets",
    "material": "Wool Blend",
    "fit": "Loose Fit",
    "gender": "Women",
    "price": 8685,
    "originalPrice": 13027,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?sig=w_83&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Navy Blue"
    ],
    "inventory": 13,
    "occasionTags": [
      "Casual",
      "Airport",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 8
  },
  {
    "name": "Urban Ethnic Charcoal Grey Polyester Blend Tops 85",
    "description": "A beautifully styled women's Tops perfect for your next look. Made from highly durable Polyester Blend fabric in a stylish Regular layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Urban Ethnic",
    "category": "Casual",
    "subCategory": "Tops",
    "material": "Polyester Blend",
    "fit": "Regular",
    "gender": "Women",
    "price": 8780,
    "originalPrice": 13170,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?sig=w_84&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Charcoal Grey"
    ],
    "inventory": 14,
    "occasionTags": [
      "Casual",
      "College",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.4,
    "reviewsCount": 9
  },
  {
    "name": "Zara Light Blue Denim Cotton Shirts 86",
    "description": "A beautifully styled women's Shirts perfect for your next look. Made from highly durable Denim Cotton fabric in a stylish Slim Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Zara",
    "category": "Formal",
    "subCategory": "Shirts",
    "material": "Denim Cotton",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 8875,
    "originalPrice": 13312,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?sig=w_85&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Light Blue"
    ],
    "inventory": 15,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 10
  },
  {
    "name": "Nike Beige Cotton Fleece Jeans 87",
    "description": "A beautifully styled women's Jeans perfect for your next look. Made from highly durable Cotton Fleece fabric in a stylish Oversized layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Nike",
    "category": "Casual",
    "subCategory": "Jeans",
    "material": "Cotton Fleece",
    "fit": "Oversized",
    "gender": "Women",
    "price": 8970,
    "originalPrice": 13455,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?sig=w_86&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Beige"
    ],
    "inventory": 16,
    "occasionTags": [
      "Casual",
      "College"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.6,
    "reviewsCount": 11
  },
  {
    "name": "Puma Burgundy Rayon Trousers 88",
    "description": "A beautifully styled women's Trousers perfect for your next look. Made from highly durable Rayon fabric in a stylish Loose Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Puma",
    "category": "Formal",
    "subCategory": "Trousers",
    "material": "Rayon",
    "fit": "Loose Fit",
    "gender": "Women",
    "price": 9065,
    "originalPrice": 13597,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?sig=w_87&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Burgundy"
    ],
    "inventory": 17,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 12
  },
  {
    "name": "StyleAI Premium Yellow Satin Silk Skirts 89",
    "description": "A beautifully styled women's Skirts perfect for your next look. Made from highly durable Satin Silk fabric in a stylish Regular layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "StyleAI Premium",
    "category": "Casual",
    "subCategory": "Skirts",
    "material": "Satin Silk",
    "fit": "Regular",
    "gender": "Women",
    "price": 9160,
    "originalPrice": 13740,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?sig=w_88&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Yellow"
    ],
    "inventory": 18,
    "occasionTags": [
      "Casual",
      "Summer",
      "Vacation"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.8,
    "reviewsCount": 13
  },
  {
    "name": "Urban Denim Peach Polyester Sequin Shorts 90",
    "description": "A beautifully styled women's Shorts perfect for your next look. Made from highly durable Polyester Sequin fabric in a stylish Slim Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Urban Denim",
    "category": "Casual",
    "subCategory": "Shorts",
    "material": "Polyester Sequin",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 9255,
    "originalPrice": 13882,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?sig=w_89&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Peach"
    ],
    "inventory": 19,
    "occasionTags": [
      "Casual",
      "Vacation",
      "Summer"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 14
  },
  {
    "name": "Executive Wear Orange Linen Jumpsuits 91",
    "description": "A beautifully styled women's Jumpsuits perfect for your next look. Made from highly durable Linen fabric in a stylish Oversized layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Executive Wear",
    "category": "Casual",
    "subCategory": "Jumpsuits",
    "material": "Linen",
    "fit": "Oversized",
    "gender": "Women",
    "price": 9350,
    "originalPrice": 14025,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?sig=w_90&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Orange"
    ],
    "inventory": 20,
    "occasionTags": [
      "Casual",
      "Party",
      "Travel"
    ],
    "featured": true,
    "aiRecommended": false,
    "ratings": 4,
    "reviewsCount": 0
  },
  {
    "name": "StyleAI Streetwear Maroon Acrylic Wool Sarees 92",
    "description": "A beautifully styled women's Sarees perfect for your next look. Made from highly durable Acrylic Wool fabric in a stylish Loose Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "StyleAI Streetwear",
    "category": "Ethnic",
    "subCategory": "Sarees",
    "material": "Acrylic Wool",
    "fit": "Loose Fit",
    "gender": "Women",
    "price": 9445,
    "originalPrice": 14167,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?sig=w_91&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Maroon"
    ],
    "inventory": 21,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 1
  },
  {
    "name": "StyleAI Essentials Khaki Suede Leather Lehengas 93",
    "description": "A beautifully styled women's Lehengas perfect for your next look. Made from highly durable Suede Leather fabric in a stylish Regular layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "StyleAI Essentials",
    "category": "Ethnic",
    "subCategory": "Lehengas",
    "material": "Suede Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 9540,
    "originalPrice": 14310,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?sig=w_92&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Khaki"
    ],
    "inventory": 22,
    "occasionTags": [
      "Wedding",
      "Reception",
      "Sangeet"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.2,
    "reviewsCount": 2
  },
  {
    "name": "Royal Heritage Dark Brown Pique Cotton Kurtas 94",
    "description": "A beautifully styled women's Kurtas perfect for your next look. Made from highly durable Pique Cotton fabric in a stylish Slim Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Royal Heritage",
    "category": "Ethnic",
    "subCategory": "Kurtas",
    "material": "Pique Cotton",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 9635,
    "originalPrice": 14452,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?sig=w_93&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Dark Brown"
    ],
    "inventory": 23,
    "occasionTags": [
      "Festive",
      "Traditional",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 3
  },
  {
    "name": "Graceful Silver Synthetic Leather Dresses 95",
    "description": "A beautifully styled women's Dresses perfect for your next look. Made from highly durable Synthetic Leather fabric in a stylish Oversized layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Graceful",
    "category": "Casual",
    "subCategory": "Dresses",
    "material": "Synthetic Leather",
    "fit": "Oversized",
    "gender": "Women",
    "price": 9730,
    "originalPrice": 14595,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?sig=w_94&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Silver"
    ],
    "inventory": 24,
    "occasionTags": [
      "Casual",
      "Summer",
      "Vacation",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.4,
    "reviewsCount": 4
  },
  {
    "name": "Urban Ethnic Pink Genuine Leather Dresses 96",
    "description": "A beautifully styled women's Dresses perfect for your next look. Made from highly durable Genuine Leather fabric in a stylish Loose Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Urban Ethnic",
    "category": "Party",
    "subCategory": "Dresses",
    "material": "Genuine Leather",
    "fit": "Loose Fit",
    "gender": "Women",
    "price": 9825,
    "originalPrice": 14737,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?sig=w_95&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Pink"
    ],
    "inventory": 25,
    "occasionTags": [
      "Party",
      "Date Night",
      "Reception"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 5
  },
  {
    "name": "Zara Gold Silk Co-ord Sets 97",
    "description": "A beautifully styled women's Co-ord Sets perfect for your next look. Made from highly durable Silk fabric in a stylish Regular layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Zara",
    "category": "Casual",
    "subCategory": "Co-ord Sets",
    "material": "Silk",
    "fit": "Regular",
    "gender": "Women",
    "price": 9920,
    "originalPrice": 14880,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?sig=w_96&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Gold"
    ],
    "inventory": 26,
    "occasionTags": [
      "Casual",
      "Airport",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.6,
    "reviewsCount": 6
  },
  {
    "name": "Nike Black Georgette Tops 98",
    "description": "A beautifully styled women's Tops perfect for your next look. Made from highly durable Georgette fabric in a stylish Slim Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Nike",
    "category": "Casual",
    "subCategory": "Tops",
    "material": "Georgette",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 10015,
    "originalPrice": 15022,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?sig=w_97&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black"
    ],
    "inventory": 27,
    "occasionTags": [
      "Casual",
      "College",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 7
  },
  {
    "name": "Puma White Cotton Shirts 99",
    "description": "A beautifully styled women's Shirts perfect for your next look. Made from highly durable Cotton fabric in a stylish Oversized layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Puma",
    "category": "Formal",
    "subCategory": "Shirts",
    "material": "Cotton",
    "fit": "Oversized",
    "gender": "Women",
    "price": 10110,
    "originalPrice": 15165,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1509319117193-57bab727e09d?sig=w_98&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "White"
    ],
    "inventory": 28,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.8,
    "reviewsCount": 8
  },
  {
    "name": "StyleAI Premium Green Wool Blend Jeans 100",
    "description": "A beautifully styled women's Jeans perfect for your next look. Made from highly durable Wool Blend fabric in a stylish Loose Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "StyleAI Premium",
    "category": "Casual",
    "subCategory": "Jeans",
    "material": "Wool Blend",
    "fit": "Loose Fit",
    "gender": "Women",
    "price": 10205,
    "originalPrice": 15307,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?sig=w_99&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Green"
    ],
    "inventory": 29,
    "occasionTags": [
      "Casual",
      "College"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 9
  },
  {
    "name": "Urban Denim Red Polyester Blend Trousers 101",
    "description": "A beautifully styled women's Trousers perfect for your next look. Made from highly durable Polyester Blend fabric in a stylish Regular layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Urban Denim",
    "category": "Formal",
    "subCategory": "Trousers",
    "material": "Polyester Blend",
    "fit": "Regular",
    "gender": "Women",
    "price": 10300,
    "originalPrice": 15450,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?sig=w_100&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Red"
    ],
    "inventory": 30,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": true,
    "aiRecommended": true,
    "ratings": 4,
    "reviewsCount": 10
  },
  {
    "name": "Executive Wear Blue Denim Cotton Skirts 102",
    "description": "A beautifully styled women's Skirts perfect for your next look. Made from highly durable Denim Cotton fabric in a stylish Slim Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Executive Wear",
    "category": "Casual",
    "subCategory": "Skirts",
    "material": "Denim Cotton",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 10395,
    "originalPrice": 15592,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?sig=w_101&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Blue"
    ],
    "inventory": 31,
    "occasionTags": [
      "Casual",
      "Summer",
      "Vacation"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 11
  },
  {
    "name": "StyleAI Streetwear Navy Blue Cotton Fleece Shorts 103",
    "description": "A beautifully styled women's Shorts perfect for your next look. Made from highly durable Cotton Fleece fabric in a stylish Oversized layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "StyleAI Streetwear",
    "category": "Casual",
    "subCategory": "Shorts",
    "material": "Cotton Fleece",
    "fit": "Oversized",
    "gender": "Women",
    "price": 10490,
    "originalPrice": 15735,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?sig=w_102&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Navy Blue"
    ],
    "inventory": 32,
    "occasionTags": [
      "Casual",
      "Vacation",
      "Summer"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 12
  },
  {
    "name": "StyleAI Essentials Charcoal Grey Rayon Jumpsuits 104",
    "description": "A beautifully styled women's Jumpsuits perfect for your next look. Made from highly durable Rayon fabric in a stylish Loose Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "StyleAI Essentials",
    "category": "Casual",
    "subCategory": "Jumpsuits",
    "material": "Rayon",
    "fit": "Loose Fit",
    "gender": "Women",
    "price": 10585,
    "originalPrice": 15877,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?sig=w_103&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Charcoal Grey"
    ],
    "inventory": 33,
    "occasionTags": [
      "Casual",
      "Party",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 13
  },
  {
    "name": "Royal Heritage Light Blue Satin Silk Sarees 105",
    "description": "A beautifully styled women's Sarees perfect for your next look. Made from highly durable Satin Silk fabric in a stylish Regular layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Royal Heritage",
    "category": "Ethnic",
    "subCategory": "Sarees",
    "material": "Satin Silk",
    "fit": "Regular",
    "gender": "Women",
    "price": 10680,
    "originalPrice": 16020,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?sig=w_104&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Light Blue"
    ],
    "inventory": 34,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.4,
    "reviewsCount": 14
  },
  {
    "name": "Graceful Beige Polyester Sequin Lehengas 106",
    "description": "A beautifully styled women's Lehengas perfect for your next look. Made from highly durable Polyester Sequin fabric in a stylish Slim Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Graceful",
    "category": "Ethnic",
    "subCategory": "Lehengas",
    "material": "Polyester Sequin",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 10775,
    "originalPrice": 16162,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?sig=w_105&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Beige"
    ],
    "inventory": 35,
    "occasionTags": [
      "Wedding",
      "Reception",
      "Sangeet"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 0
  },
  {
    "name": "Urban Ethnic Burgundy Linen Kurtas 107",
    "description": "A beautifully styled women's Kurtas perfect for your next look. Made from highly durable Linen fabric in a stylish Oversized layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Urban Ethnic",
    "category": "Ethnic",
    "subCategory": "Kurtas",
    "material": "Linen",
    "fit": "Oversized",
    "gender": "Women",
    "price": 10870,
    "originalPrice": 16305,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?sig=w_106&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Burgundy"
    ],
    "inventory": 36,
    "occasionTags": [
      "Festive",
      "Traditional",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.6,
    "reviewsCount": 1
  },
  {
    "name": "Zara Yellow Acrylic Wool Dresses 108",
    "description": "A beautifully styled women's Dresses perfect for your next look. Made from highly durable Acrylic Wool fabric in a stylish Loose Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Zara",
    "category": "Casual",
    "subCategory": "Dresses",
    "material": "Acrylic Wool",
    "fit": "Loose Fit",
    "gender": "Women",
    "price": 10965,
    "originalPrice": 16447,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?sig=w_107&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Yellow"
    ],
    "inventory": 37,
    "occasionTags": [
      "Casual",
      "Summer",
      "Vacation",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 2
  },
  {
    "name": "Nike Peach Suede Leather Dresses 109",
    "description": "A beautifully styled women's Dresses perfect for your next look. Made from highly durable Suede Leather fabric in a stylish Regular layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Nike",
    "category": "Party",
    "subCategory": "Dresses",
    "material": "Suede Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 11060,
    "originalPrice": 16590,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?sig=w_108&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Peach"
    ],
    "inventory": 38,
    "occasionTags": [
      "Party",
      "Date Night",
      "Reception"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.8,
    "reviewsCount": 3
  },
  {
    "name": "Puma Orange Pique Cotton Co-ord Sets 110",
    "description": "A beautifully styled women's Co-ord Sets perfect for your next look. Made from highly durable Pique Cotton fabric in a stylish Slim Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Puma",
    "category": "Casual",
    "subCategory": "Co-ord Sets",
    "material": "Pique Cotton",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 11155,
    "originalPrice": 16732,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?sig=w_109&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Orange"
    ],
    "inventory": 39,
    "occasionTags": [
      "Casual",
      "Airport",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 4
  },
  {
    "name": "StyleAI Premium Maroon Synthetic Leather Tops 111",
    "description": "A beautifully styled women's Tops perfect for your next look. Made from highly durable Synthetic Leather fabric in a stylish Oversized layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "StyleAI Premium",
    "category": "Casual",
    "subCategory": "Tops",
    "material": "Synthetic Leather",
    "fit": "Oversized",
    "gender": "Women",
    "price": 11250,
    "originalPrice": 16875,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?sig=w_110&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Maroon"
    ],
    "inventory": 40,
    "occasionTags": [
      "Casual",
      "College",
      "Daily Wear"
    ],
    "featured": true,
    "aiRecommended": false,
    "ratings": 4,
    "reviewsCount": 5
  },
  {
    "name": "Urban Denim Khaki Genuine Leather Shirts 112",
    "description": "A beautifully styled women's Shirts perfect for your next look. Made from highly durable Genuine Leather fabric in a stylish Loose Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Urban Denim",
    "category": "Formal",
    "subCategory": "Shirts",
    "material": "Genuine Leather",
    "fit": "Loose Fit",
    "gender": "Women",
    "price": 11345,
    "originalPrice": 17017,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?sig=w_111&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Khaki"
    ],
    "inventory": 41,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 6
  },
  {
    "name": "Executive Wear Dark Brown Silk Jeans 113",
    "description": "A beautifully styled women's Jeans perfect for your next look. Made from highly durable Silk fabric in a stylish Regular layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Executive Wear",
    "category": "Casual",
    "subCategory": "Jeans",
    "material": "Silk",
    "fit": "Regular",
    "gender": "Women",
    "price": 11440,
    "originalPrice": 17160,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?sig=w_112&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Dark Brown"
    ],
    "inventory": 42,
    "occasionTags": [
      "Casual",
      "College"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.2,
    "reviewsCount": 7
  },
  {
    "name": "StyleAI Streetwear Silver Georgette Trousers 114",
    "description": "A beautifully styled women's Trousers perfect for your next look. Made from highly durable Georgette fabric in a stylish Slim Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "StyleAI Streetwear",
    "category": "Formal",
    "subCategory": "Trousers",
    "material": "Georgette",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 11535,
    "originalPrice": 17302,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?sig=w_113&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Silver"
    ],
    "inventory": 43,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 8
  },
  {
    "name": "StyleAI Essentials Pink Cotton Skirts 115",
    "description": "A beautifully styled women's Skirts perfect for your next look. Made from highly durable Cotton fabric in a stylish Oversized layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "StyleAI Essentials",
    "category": "Casual",
    "subCategory": "Skirts",
    "material": "Cotton",
    "fit": "Oversized",
    "gender": "Women",
    "price": 11630,
    "originalPrice": 17445,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?sig=w_114&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Pink"
    ],
    "inventory": 44,
    "occasionTags": [
      "Casual",
      "Summer",
      "Vacation"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.4,
    "reviewsCount": 9
  },
  {
    "name": "Royal Heritage Gold Wool Blend Shorts 116",
    "description": "A beautifully styled women's Shorts perfect for your next look. Made from highly durable Wool Blend fabric in a stylish Loose Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Royal Heritage",
    "category": "Casual",
    "subCategory": "Shorts",
    "material": "Wool Blend",
    "fit": "Loose Fit",
    "gender": "Women",
    "price": 11725,
    "originalPrice": 17587,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?sig=w_115&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Gold"
    ],
    "inventory": 45,
    "occasionTags": [
      "Casual",
      "Vacation",
      "Summer"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 10
  },
  {
    "name": "Graceful Black Polyester Blend Jumpsuits 117",
    "description": "A beautifully styled women's Jumpsuits perfect for your next look. Made from highly durable Polyester Blend fabric in a stylish Regular layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Graceful",
    "category": "Casual",
    "subCategory": "Jumpsuits",
    "material": "Polyester Blend",
    "fit": "Regular",
    "gender": "Women",
    "price": 820,
    "originalPrice": 1230,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?sig=w_116&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black"
    ],
    "inventory": 46,
    "occasionTags": [
      "Casual",
      "Party",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.6,
    "reviewsCount": 11
  },
  {
    "name": "Urban Ethnic White Denim Cotton Sarees 118",
    "description": "A beautifully styled women's Sarees perfect for your next look. Made from highly durable Denim Cotton fabric in a stylish Slim Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Urban Ethnic",
    "category": "Ethnic",
    "subCategory": "Sarees",
    "material": "Denim Cotton",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 915,
    "originalPrice": 1372,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?sig=w_117&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "White"
    ],
    "inventory": 47,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 12
  },
  {
    "name": "Zara Green Cotton Fleece Lehengas 119",
    "description": "A beautifully styled women's Lehengas perfect for your next look. Made from highly durable Cotton Fleece fabric in a stylish Oversized layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Zara",
    "category": "Ethnic",
    "subCategory": "Lehengas",
    "material": "Cotton Fleece",
    "fit": "Oversized",
    "gender": "Women",
    "price": 1010,
    "originalPrice": 1515,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?sig=w_118&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Green"
    ],
    "inventory": 48,
    "occasionTags": [
      "Wedding",
      "Reception",
      "Sangeet"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.8,
    "reviewsCount": 13
  },
  {
    "name": "Nike Red Rayon Kurtas 120",
    "description": "A beautifully styled women's Kurtas perfect for your next look. Made from highly durable Rayon fabric in a stylish Loose Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Nike",
    "category": "Ethnic",
    "subCategory": "Kurtas",
    "material": "Rayon",
    "fit": "Loose Fit",
    "gender": "Women",
    "price": 1105,
    "originalPrice": 1657,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?sig=w_119&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Red"
    ],
    "inventory": 49,
    "occasionTags": [
      "Festive",
      "Traditional",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 14
  },
  {
    "name": "Puma Blue Satin Silk Dresses 121",
    "description": "A beautifully styled women's Dresses perfect for your next look. Made from highly durable Satin Silk fabric in a stylish Regular layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Puma",
    "category": "Casual",
    "subCategory": "Dresses",
    "material": "Satin Silk",
    "fit": "Regular",
    "gender": "Women",
    "price": 1200,
    "originalPrice": 1800,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?sig=w_120&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Blue"
    ],
    "inventory": 10,
    "occasionTags": [
      "Casual",
      "Summer",
      "Vacation",
      "Daily Wear"
    ],
    "featured": true,
    "aiRecommended": true,
    "ratings": 4,
    "reviewsCount": 0
  },
  {
    "name": "StyleAI Premium Navy Blue Polyester Sequin Dresses 122",
    "description": "A beautifully styled women's Dresses perfect for your next look. Made from highly durable Polyester Sequin fabric in a stylish Slim Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "StyleAI Premium",
    "category": "Party",
    "subCategory": "Dresses",
    "material": "Polyester Sequin",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 1295,
    "originalPrice": 1942,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?sig=w_121&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Navy Blue"
    ],
    "inventory": 11,
    "occasionTags": [
      "Party",
      "Date Night",
      "Reception"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 1
  },
  {
    "name": "Urban Denim Charcoal Grey Linen Co-ord Sets 123",
    "description": "A beautifully styled women's Co-ord Sets perfect for your next look. Made from highly durable Linen fabric in a stylish Oversized layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Urban Denim",
    "category": "Casual",
    "subCategory": "Co-ord Sets",
    "material": "Linen",
    "fit": "Oversized",
    "gender": "Women",
    "price": 1390,
    "originalPrice": 2085,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?sig=w_122&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Charcoal Grey"
    ],
    "inventory": 12,
    "occasionTags": [
      "Casual",
      "Airport",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 2
  },
  {
    "name": "Executive Wear Light Blue Acrylic Wool Tops 124",
    "description": "A beautifully styled women's Tops perfect for your next look. Made from highly durable Acrylic Wool fabric in a stylish Loose Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Executive Wear",
    "category": "Casual",
    "subCategory": "Tops",
    "material": "Acrylic Wool",
    "fit": "Loose Fit",
    "gender": "Women",
    "price": 1485,
    "originalPrice": 2227,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1509319117193-57bab727e09d?sig=w_123&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Light Blue"
    ],
    "inventory": 13,
    "occasionTags": [
      "Casual",
      "College",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 3
  },
  {
    "name": "StyleAI Streetwear Beige Suede Leather Shirts 125",
    "description": "A beautifully styled women's Shirts perfect for your next look. Made from highly durable Suede Leather fabric in a stylish Regular layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "StyleAI Streetwear",
    "category": "Formal",
    "subCategory": "Shirts",
    "material": "Suede Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 1580,
    "originalPrice": 2370,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?sig=w_124&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Beige"
    ],
    "inventory": 14,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.4,
    "reviewsCount": 4
  },
  {
    "name": "StyleAI Essentials Burgundy Pique Cotton Jeans 126",
    "description": "A beautifully styled women's Jeans perfect for your next look. Made from highly durable Pique Cotton fabric in a stylish Slim Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "StyleAI Essentials",
    "category": "Casual",
    "subCategory": "Jeans",
    "material": "Pique Cotton",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 1675,
    "originalPrice": 2512,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?sig=w_125&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Burgundy"
    ],
    "inventory": 15,
    "occasionTags": [
      "Casual",
      "College"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 5
  },
  {
    "name": "Royal Heritage Yellow Synthetic Leather Trousers 127",
    "description": "A beautifully styled women's Trousers perfect for your next look. Made from highly durable Synthetic Leather fabric in a stylish Oversized layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Royal Heritage",
    "category": "Formal",
    "subCategory": "Trousers",
    "material": "Synthetic Leather",
    "fit": "Oversized",
    "gender": "Women",
    "price": 1770,
    "originalPrice": 2655,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?sig=w_126&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Yellow"
    ],
    "inventory": 16,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.6,
    "reviewsCount": 6
  },
  {
    "name": "Graceful Peach Genuine Leather Skirts 128",
    "description": "A beautifully styled women's Skirts perfect for your next look. Made from highly durable Genuine Leather fabric in a stylish Loose Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Graceful",
    "category": "Casual",
    "subCategory": "Skirts",
    "material": "Genuine Leather",
    "fit": "Loose Fit",
    "gender": "Women",
    "price": 1865,
    "originalPrice": 2797,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?sig=w_127&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Peach"
    ],
    "inventory": 17,
    "occasionTags": [
      "Casual",
      "Summer",
      "Vacation"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 7
  },
  {
    "name": "Urban Ethnic Orange Silk Shorts 129",
    "description": "A beautifully styled women's Shorts perfect for your next look. Made from highly durable Silk fabric in a stylish Regular layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Urban Ethnic",
    "category": "Casual",
    "subCategory": "Shorts",
    "material": "Silk",
    "fit": "Regular",
    "gender": "Women",
    "price": 1960,
    "originalPrice": 2940,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?sig=w_128&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Orange"
    ],
    "inventory": 18,
    "occasionTags": [
      "Casual",
      "Vacation",
      "Summer"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.8,
    "reviewsCount": 8
  },
  {
    "name": "Zara Maroon Georgette Jumpsuits 130",
    "description": "A beautifully styled women's Jumpsuits perfect for your next look. Made from highly durable Georgette fabric in a stylish Slim Fit layout. Features include matching stitching, premium colorways, and comfortable fit options.",
    "brand": "Zara",
    "category": "Casual",
    "subCategory": "Jumpsuits",
    "material": "Georgette",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 2055,
    "originalPrice": 3082,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?sig=w_129&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Maroon"
    ],
    "inventory": 19,
    "occasionTags": [
      "Casual",
      "Party",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 9
  },
  {
    "name": "StyleAI Streetwear Men's Black Polyester Blend Shirts 1",
    "description": "A sophisticated and tailored men's Shirts for style-focused shoppers. Designed using breathable Polyester Blend textile structure in a sharp Regular silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "StyleAI Streetwear",
    "category": "Casual",
    "subCategory": "Shirts",
    "material": "Polyester Blend",
    "fit": "Regular",
    "gender": "Men",
    "price": 600,
    "originalPrice": 840,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?sig=m_0&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Black"
    ],
    "inventory": 15,
    "occasionTags": [
      "Casual",
      "Vacation",
      "Daily Wear"
    ],
    "featured": true,
    "aiRecommended": true,
    "ratings": 4.1,
    "reviewsCount": 0
  },
  {
    "name": "StyleAI Essentials Men's White Denim Cotton Shirts 2",
    "description": "A sophisticated and tailored men's Shirts for style-focused shoppers. Designed using breathable Denim Cotton textile structure in a sharp Slim Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "StyleAI Essentials",
    "category": "Formal",
    "subCategory": "Shirts",
    "material": "Denim Cotton",
    "fit": "Slim Fit",
    "gender": "Men",
    "price": 725,
    "originalPrice": 1014,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?sig=m_1&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "White"
    ],
    "inventory": 16,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 1
  },
  {
    "name": "Royal Heritage Men's Green Cotton Fleece T-Shirts 3",
    "description": "A sophisticated and tailored men's T-Shirts for style-focused shoppers. Designed using breathable Cotton Fleece textile structure in a sharp Oversized silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Royal Heritage",
    "category": "Casual",
    "subCategory": "T-Shirts",
    "material": "Cotton Fleece",
    "fit": "Oversized",
    "gender": "Men",
    "price": 850,
    "originalPrice": 1190,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?sig=m_2&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Green"
    ],
    "inventory": 17,
    "occasionTags": [
      "Casual",
      "College",
      "Gym"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 2
  },
  {
    "name": "Graceful Men's Red Rayon Polo Shirts 4",
    "description": "A sophisticated and tailored men's Polo Shirts for style-focused shoppers. Designed using breathable Rayon textile structure in a sharp Loose Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Graceful",
    "category": "Casual",
    "subCategory": "Polo Shirts",
    "material": "Rayon",
    "fit": "Loose Fit",
    "gender": "Men",
    "price": 975,
    "originalPrice": 1365,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?sig=m_3&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Red"
    ],
    "inventory": 18,
    "occasionTags": [
      "Casual",
      "Office",
      "College"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.4,
    "reviewsCount": 3
  },
  {
    "name": "Urban Ethnic Men's Blue Satin Silk Jeans 5",
    "description": "A sophisticated and tailored men's Jeans for style-focused shoppers. Designed using breathable Satin Silk textile structure in a sharp Regular silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Urban Ethnic",
    "category": "Casual",
    "subCategory": "Jeans",
    "material": "Satin Silk",
    "fit": "Regular",
    "gender": "Men",
    "price": 1100,
    "originalPrice": 1540,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?sig=m_4&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Blue"
    ],
    "inventory": 19,
    "occasionTags": [
      "Casual",
      "College"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 4
  },
  {
    "name": "Zara Men's Navy Blue Polyester Sequin Chinos 6",
    "description": "A sophisticated and tailored men's Chinos for style-focused shoppers. Designed using breathable Polyester Sequin textile structure in a sharp Slim Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Zara",
    "category": "Casual",
    "subCategory": "Chinos",
    "material": "Polyester Sequin",
    "fit": "Slim Fit",
    "gender": "Men",
    "price": 1225,
    "originalPrice": 1715,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?sig=m_5&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Navy Blue"
    ],
    "inventory": 20,
    "occasionTags": [
      "Casual",
      "Office",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.6,
    "reviewsCount": 5
  },
  {
    "name": "Nike Men's Charcoal Grey Linen Cargo Pants 7",
    "description": "A sophisticated and tailored men's Cargo Pants for style-focused shoppers. Designed using breathable Linen textile structure in a sharp Oversized silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Nike",
    "category": "Casual",
    "subCategory": "Cargo Pants",
    "material": "Linen",
    "fit": "Oversized",
    "gender": "Men",
    "price": 1350,
    "originalPrice": 1889,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?sig=m_6&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Charcoal Grey"
    ],
    "inventory": 21,
    "occasionTags": [
      "Casual",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 6
  },
  {
    "name": "Puma Men's Light Blue Acrylic Wool Trousers 8",
    "description": "A sophisticated and tailored men's Trousers for style-focused shoppers. Designed using breathable Acrylic Wool textile structure in a sharp Loose Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Puma",
    "category": "Formal",
    "subCategory": "Trousers",
    "material": "Acrylic Wool",
    "fit": "Loose Fit",
    "gender": "Men",
    "price": 1475,
    "originalPrice": 2065,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?sig=m_7&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Light Blue"
    ],
    "inventory": 22,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.8,
    "reviewsCount": 7
  },
  {
    "name": "StyleAI Premium Men's Beige Suede Leather Suits 9",
    "description": "A sophisticated and tailored men's Suits for style-focused shoppers. Designed using breathable Suede Leather textile structure in a sharp Regular silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "StyleAI Premium",
    "category": "Formal",
    "subCategory": "Suits",
    "material": "Suede Leather",
    "fit": "Regular",
    "gender": "Men",
    "price": 1600,
    "originalPrice": 2240,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?sig=m_8&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Beige"
    ],
    "inventory": 23,
    "occasionTags": [
      "Wedding",
      "Reception",
      "Formal"
    ],
    "featured": true,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 8
  },
  {
    "name": "Urban Denim Men's Burgundy Pique Cotton Sherwanis 10",
    "description": "A sophisticated and tailored men's Sherwanis for style-focused shoppers. Designed using breathable Pique Cotton textile structure in a sharp Slim Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Urban Denim",
    "category": "Ethnic",
    "subCategory": "Sherwanis",
    "material": "Pique Cotton",
    "fit": "Slim Fit",
    "gender": "Men",
    "price": 1725,
    "originalPrice": 2415,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?sig=m_9&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Burgundy"
    ],
    "inventory": 24,
    "occasionTags": [
      "Wedding",
      "Reception"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 9
  },
  {
    "name": "Executive Wear Men's Yellow Synthetic Leather Kurtas 11",
    "description": "A sophisticated and tailored men's Kurtas for style-focused shoppers. Designed using breathable Synthetic Leather textile structure in a sharp Oversized silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Executive Wear",
    "category": "Ethnic",
    "subCategory": "Kurtas",
    "material": "Synthetic Leather",
    "fit": "Oversized",
    "gender": "Men",
    "price": 1850,
    "originalPrice": 2590,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?sig=m_10&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Yellow"
    ],
    "inventory": 25,
    "occasionTags": [
      "Festive",
      "Traditional",
      "Sangeet"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.2,
    "reviewsCount": 10
  },
  {
    "name": "StyleAI Streetwear Men's Peach Genuine Leather Sweatshirts 12",
    "description": "A sophisticated and tailored men's Sweatshirts for style-focused shoppers. Designed using breathable Genuine Leather textile structure in a sharp Loose Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "StyleAI Streetwear",
    "category": "Casual",
    "subCategory": "Sweatshirts",
    "material": "Genuine Leather",
    "fit": "Loose Fit",
    "gender": "Men",
    "price": 1975,
    "originalPrice": 2765,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?sig=m_11&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Peach"
    ],
    "inventory": 26,
    "occasionTags": [
      "Casual",
      "Winter"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 11
  },
  {
    "name": "StyleAI Essentials Men's Orange Silk Shirts 13",
    "description": "A sophisticated and tailored men's Shirts for style-focused shoppers. Designed using breathable Silk textile structure in a sharp Regular silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "StyleAI Essentials",
    "category": "Casual",
    "subCategory": "Shirts",
    "material": "Silk",
    "fit": "Regular",
    "gender": "Men",
    "price": 2100,
    "originalPrice": 2940,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?sig=m_12&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Orange"
    ],
    "inventory": 27,
    "occasionTags": [
      "Casual",
      "Vacation",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.4,
    "reviewsCount": 0
  },
  {
    "name": "Royal Heritage Men's Maroon Georgette Shirts 14",
    "description": "A sophisticated and tailored men's Shirts for style-focused shoppers. Designed using breathable Georgette textile structure in a sharp Slim Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Royal Heritage",
    "category": "Formal",
    "subCategory": "Shirts",
    "material": "Georgette",
    "fit": "Slim Fit",
    "gender": "Men",
    "price": 2225,
    "originalPrice": 3115,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?sig=m_13&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Maroon"
    ],
    "inventory": 28,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 1
  },
  {
    "name": "Graceful Men's Khaki Cotton T-Shirts 15",
    "description": "A sophisticated and tailored men's T-Shirts for style-focused shoppers. Designed using breathable Cotton textile structure in a sharp Oversized silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Graceful",
    "category": "Casual",
    "subCategory": "T-Shirts",
    "material": "Cotton",
    "fit": "Oversized",
    "gender": "Men",
    "price": 2350,
    "originalPrice": 3290,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?sig=m_14&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Khaki"
    ],
    "inventory": 29,
    "occasionTags": [
      "Casual",
      "College",
      "Gym"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.6,
    "reviewsCount": 2
  },
  {
    "name": "Urban Ethnic Men's Dark Brown Wool Blend Polo Shirts 16",
    "description": "A sophisticated and tailored men's Polo Shirts for style-focused shoppers. Designed using breathable Wool Blend textile structure in a sharp Loose Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Urban Ethnic",
    "category": "Casual",
    "subCategory": "Polo Shirts",
    "material": "Wool Blend",
    "fit": "Loose Fit",
    "gender": "Men",
    "price": 2475,
    "originalPrice": 3465,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?sig=m_15&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Dark Brown"
    ],
    "inventory": 30,
    "occasionTags": [
      "Casual",
      "Office",
      "College"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.7,
    "reviewsCount": 3
  },
  {
    "name": "Zara Men's Silver Polyester Blend Jeans 17",
    "description": "A sophisticated and tailored men's Jeans for style-focused shoppers. Designed using breathable Polyester Blend textile structure in a sharp Regular silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Zara",
    "category": "Casual",
    "subCategory": "Jeans",
    "material": "Polyester Blend",
    "fit": "Regular",
    "gender": "Men",
    "price": 2600,
    "originalPrice": 3639,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?sig=m_16&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Silver"
    ],
    "inventory": 31,
    "occasionTags": [
      "Casual",
      "College"
    ],
    "featured": true,
    "aiRecommended": false,
    "ratings": 4.8,
    "reviewsCount": 4
  },
  {
    "name": "Nike Men's Pink Denim Cotton Chinos 18",
    "description": "A sophisticated and tailored men's Chinos for style-focused shoppers. Designed using breathable Denim Cotton textile structure in a sharp Slim Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Nike",
    "category": "Casual",
    "subCategory": "Chinos",
    "material": "Denim Cotton",
    "fit": "Slim Fit",
    "gender": "Men",
    "price": 2725,
    "originalPrice": 3814,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?sig=m_17&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Pink"
    ],
    "inventory": 32,
    "occasionTags": [
      "Casual",
      "Office",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 5
  },
  {
    "name": "Puma Men's Gold Cotton Fleece Cargo Pants 19",
    "description": "A sophisticated and tailored men's Cargo Pants for style-focused shoppers. Designed using breathable Cotton Fleece textile structure in a sharp Oversized silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Puma",
    "category": "Casual",
    "subCategory": "Cargo Pants",
    "material": "Cotton Fleece",
    "fit": "Oversized",
    "gender": "Men",
    "price": 2850,
    "originalPrice": 3989,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?sig=m_18&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Gold"
    ],
    "inventory": 33,
    "occasionTags": [
      "Casual",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 6
  },
  {
    "name": "StyleAI Premium Men's Black Rayon Trousers 20",
    "description": "A sophisticated and tailored men's Trousers for style-focused shoppers. Designed using breathable Rayon textile structure in a sharp Loose Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "StyleAI Premium",
    "category": "Formal",
    "subCategory": "Trousers",
    "material": "Rayon",
    "fit": "Loose Fit",
    "gender": "Men",
    "price": 2975,
    "originalPrice": 4165,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?sig=m_19&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Black"
    ],
    "inventory": 34,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 7
  },
  {
    "name": "Urban Denim Men's White Satin Silk Suits 21",
    "description": "A sophisticated and tailored men's Suits for style-focused shoppers. Designed using breathable Satin Silk textile structure in a sharp Regular silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Urban Denim",
    "category": "Formal",
    "subCategory": "Suits",
    "material": "Satin Silk",
    "fit": "Regular",
    "gender": "Men",
    "price": 3100,
    "originalPrice": 4340,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?sig=m_20&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "White"
    ],
    "inventory": 35,
    "occasionTags": [
      "Wedding",
      "Reception",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.3,
    "reviewsCount": 8
  },
  {
    "name": "Executive Wear Men's Green Polyester Sequin Sherwanis 22",
    "description": "A sophisticated and tailored men's Sherwanis for style-focused shoppers. Designed using breathable Polyester Sequin textile structure in a sharp Slim Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Executive Wear",
    "category": "Ethnic",
    "subCategory": "Sherwanis",
    "material": "Polyester Sequin",
    "fit": "Slim Fit",
    "gender": "Men",
    "price": 3225,
    "originalPrice": 4515,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?sig=m_21&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Green"
    ],
    "inventory": 36,
    "occasionTags": [
      "Wedding",
      "Reception"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.4,
    "reviewsCount": 9
  },
  {
    "name": "StyleAI Streetwear Men's Red Linen Kurtas 23",
    "description": "A sophisticated and tailored men's Kurtas for style-focused shoppers. Designed using breathable Linen textile structure in a sharp Oversized silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "StyleAI Streetwear",
    "category": "Ethnic",
    "subCategory": "Kurtas",
    "material": "Linen",
    "fit": "Oversized",
    "gender": "Men",
    "price": 3350,
    "originalPrice": 4690,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?sig=m_22&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Red"
    ],
    "inventory": 37,
    "occasionTags": [
      "Festive",
      "Traditional",
      "Sangeet"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 10
  },
  {
    "name": "StyleAI Essentials Men's Blue Acrylic Wool Sweatshirts 24",
    "description": "A sophisticated and tailored men's Sweatshirts for style-focused shoppers. Designed using breathable Acrylic Wool textile structure in a sharp Loose Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "StyleAI Essentials",
    "category": "Casual",
    "subCategory": "Sweatshirts",
    "material": "Acrylic Wool",
    "fit": "Loose Fit",
    "gender": "Men",
    "price": 3475,
    "originalPrice": 4865,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?sig=m_23&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Blue"
    ],
    "inventory": 38,
    "occasionTags": [
      "Casual",
      "Winter"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.6,
    "reviewsCount": 11
  },
  {
    "name": "Royal Heritage Men's Navy Blue Suede Leather Shirts 25",
    "description": "A sophisticated and tailored men's Shirts for style-focused shoppers. Designed using breathable Suede Leather textile structure in a sharp Regular silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Royal Heritage",
    "category": "Casual",
    "subCategory": "Shirts",
    "material": "Suede Leather",
    "fit": "Regular",
    "gender": "Men",
    "price": 3600,
    "originalPrice": 5040,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?sig=m_24&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Navy Blue"
    ],
    "inventory": 39,
    "occasionTags": [
      "Casual",
      "Vacation",
      "Daily Wear"
    ],
    "featured": true,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 0
  },
  {
    "name": "Graceful Men's Charcoal Grey Pique Cotton Shirts 26",
    "description": "A sophisticated and tailored men's Shirts for style-focused shoppers. Designed using breathable Pique Cotton textile structure in a sharp Slim Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Graceful",
    "category": "Formal",
    "subCategory": "Shirts",
    "material": "Pique Cotton",
    "fit": "Slim Fit",
    "gender": "Men",
    "price": 3725,
    "originalPrice": 5215,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?sig=m_25&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Charcoal Grey"
    ],
    "inventory": 40,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.8,
    "reviewsCount": 1
  },
  {
    "name": "Urban Ethnic Men's Light Blue Synthetic Leather T-Shirts 27",
    "description": "A sophisticated and tailored men's T-Shirts for style-focused shoppers. Designed using breathable Synthetic Leather textile structure in a sharp Oversized silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Urban Ethnic",
    "category": "Casual",
    "subCategory": "T-Shirts",
    "material": "Synthetic Leather",
    "fit": "Oversized",
    "gender": "Men",
    "price": 3850,
    "originalPrice": 5390,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?sig=m_26&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Light Blue"
    ],
    "inventory": 41,
    "occasionTags": [
      "Casual",
      "College",
      "Gym"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 2
  },
  {
    "name": "Zara Men's Beige Genuine Leather Polo Shirts 28",
    "description": "A sophisticated and tailored men's Polo Shirts for style-focused shoppers. Designed using breathable Genuine Leather textile structure in a sharp Loose Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Zara",
    "category": "Casual",
    "subCategory": "Polo Shirts",
    "material": "Genuine Leather",
    "fit": "Loose Fit",
    "gender": "Men",
    "price": 3975,
    "originalPrice": 5565,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?sig=m_27&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Beige"
    ],
    "inventory": 42,
    "occasionTags": [
      "Casual",
      "Office",
      "College"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 3
  },
  {
    "name": "Nike Men's Burgundy Silk Jeans 29",
    "description": "A sophisticated and tailored men's Jeans for style-focused shoppers. Designed using breathable Silk textile structure in a sharp Regular silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Nike",
    "category": "Casual",
    "subCategory": "Jeans",
    "material": "Silk",
    "fit": "Regular",
    "gender": "Men",
    "price": 4100,
    "originalPrice": 5740,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?sig=m_28&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Burgundy"
    ],
    "inventory": 43,
    "occasionTags": [
      "Casual",
      "College"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 4
  },
  {
    "name": "Puma Men's Yellow Georgette Chinos 30",
    "description": "A sophisticated and tailored men's Chinos for style-focused shoppers. Designed using breathable Georgette textile structure in a sharp Slim Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Puma",
    "category": "Casual",
    "subCategory": "Chinos",
    "material": "Georgette",
    "fit": "Slim Fit",
    "gender": "Men",
    "price": 4225,
    "originalPrice": 5915,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?sig=m_29&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Yellow"
    ],
    "inventory": 44,
    "occasionTags": [
      "Casual",
      "Office",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 5
  },
  {
    "name": "StyleAI Premium Men's Peach Cotton Cargo Pants 31",
    "description": "A sophisticated and tailored men's Cargo Pants for style-focused shoppers. Designed using breathable Cotton textile structure in a sharp Oversized silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "StyleAI Premium",
    "category": "Casual",
    "subCategory": "Cargo Pants",
    "material": "Cotton",
    "fit": "Oversized",
    "gender": "Men",
    "price": 4350,
    "originalPrice": 6090,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?sig=m_30&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Peach"
    ],
    "inventory": 15,
    "occasionTags": [
      "Casual",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.4,
    "reviewsCount": 6
  },
  {
    "name": "Urban Denim Men's Orange Wool Blend Trousers 32",
    "description": "A sophisticated and tailored men's Trousers for style-focused shoppers. Designed using breathable Wool Blend textile structure in a sharp Loose Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Urban Denim",
    "category": "Formal",
    "subCategory": "Trousers",
    "material": "Wool Blend",
    "fit": "Loose Fit",
    "gender": "Men",
    "price": 4475,
    "originalPrice": 6265,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?sig=m_31&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Orange"
    ],
    "inventory": 16,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 7
  },
  {
    "name": "Executive Wear Men's Maroon Polyester Blend Suits 33",
    "description": "A sophisticated and tailored men's Suits for style-focused shoppers. Designed using breathable Polyester Blend textile structure in a sharp Regular silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Executive Wear",
    "category": "Formal",
    "subCategory": "Suits",
    "material": "Polyester Blend",
    "fit": "Regular",
    "gender": "Men",
    "price": 4600,
    "originalPrice": 6440,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?sig=m_32&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Maroon"
    ],
    "inventory": 17,
    "occasionTags": [
      "Wedding",
      "Reception",
      "Formal"
    ],
    "featured": true,
    "aiRecommended": false,
    "ratings": 4.6,
    "reviewsCount": 8
  },
  {
    "name": "StyleAI Streetwear Men's Khaki Denim Cotton Sherwanis 34",
    "description": "A sophisticated and tailored men's Sherwanis for style-focused shoppers. Designed using breathable Denim Cotton textile structure in a sharp Slim Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "StyleAI Streetwear",
    "category": "Ethnic",
    "subCategory": "Sherwanis",
    "material": "Denim Cotton",
    "fit": "Slim Fit",
    "gender": "Men",
    "price": 4725,
    "originalPrice": 6615,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?sig=m_33&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Khaki"
    ],
    "inventory": 18,
    "occasionTags": [
      "Wedding",
      "Reception"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 9
  },
  {
    "name": "StyleAI Essentials Men's Dark Brown Cotton Fleece Kurtas 35",
    "description": "A sophisticated and tailored men's Kurtas for style-focused shoppers. Designed using breathable Cotton Fleece textile structure in a sharp Oversized silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "StyleAI Essentials",
    "category": "Ethnic",
    "subCategory": "Kurtas",
    "material": "Cotton Fleece",
    "fit": "Oversized",
    "gender": "Men",
    "price": 4850,
    "originalPrice": 6790,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?sig=m_34&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Dark Brown"
    ],
    "inventory": 19,
    "occasionTags": [
      "Festive",
      "Traditional",
      "Sangeet"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.8,
    "reviewsCount": 10
  },
  {
    "name": "Royal Heritage Men's Silver Rayon Sweatshirts 36",
    "description": "A sophisticated and tailored men's Sweatshirts for style-focused shoppers. Designed using breathable Rayon textile structure in a sharp Loose Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Royal Heritage",
    "category": "Casual",
    "subCategory": "Sweatshirts",
    "material": "Rayon",
    "fit": "Loose Fit",
    "gender": "Men",
    "price": 4975,
    "originalPrice": 6965,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?sig=m_35&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Silver"
    ],
    "inventory": 20,
    "occasionTags": [
      "Casual",
      "Winter"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.9,
    "reviewsCount": 11
  },
  {
    "name": "Graceful Men's Pink Satin Silk Shirts 37",
    "description": "A sophisticated and tailored men's Shirts for style-focused shoppers. Designed using breathable Satin Silk textile structure in a sharp Regular silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Graceful",
    "category": "Casual",
    "subCategory": "Shirts",
    "material": "Satin Silk",
    "fit": "Regular",
    "gender": "Men",
    "price": 5100,
    "originalPrice": 7140,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?sig=m_36&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Pink"
    ],
    "inventory": 21,
    "occasionTags": [
      "Casual",
      "Vacation",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 0
  },
  {
    "name": "Urban Ethnic Men's Gold Polyester Sequin Shirts 38",
    "description": "A sophisticated and tailored men's Shirts for style-focused shoppers. Designed using breathable Polyester Sequin textile structure in a sharp Slim Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Urban Ethnic",
    "category": "Formal",
    "subCategory": "Shirts",
    "material": "Polyester Sequin",
    "fit": "Slim Fit",
    "gender": "Men",
    "price": 5225,
    "originalPrice": 7314,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?sig=m_37&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Gold"
    ],
    "inventory": 22,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 1
  },
  {
    "name": "Zara Men's Black Linen T-Shirts 39",
    "description": "A sophisticated and tailored men's T-Shirts for style-focused shoppers. Designed using breathable Linen textile structure in a sharp Oversized silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Zara",
    "category": "Casual",
    "subCategory": "T-Shirts",
    "material": "Linen",
    "fit": "Oversized",
    "gender": "Men",
    "price": 5350,
    "originalPrice": 7489,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?sig=m_38&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Black"
    ],
    "inventory": 23,
    "occasionTags": [
      "Casual",
      "College",
      "Gym"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 2
  },
  {
    "name": "Nike Men's White Acrylic Wool Polo Shirts 40",
    "description": "A sophisticated and tailored men's Polo Shirts for style-focused shoppers. Designed using breathable Acrylic Wool textile structure in a sharp Loose Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Nike",
    "category": "Casual",
    "subCategory": "Polo Shirts",
    "material": "Acrylic Wool",
    "fit": "Loose Fit",
    "gender": "Men",
    "price": 5475,
    "originalPrice": 7664,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?sig=m_39&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "White"
    ],
    "inventory": 24,
    "occasionTags": [
      "Casual",
      "Office",
      "College"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.4,
    "reviewsCount": 3
  },
  {
    "name": "Puma Men's Green Suede Leather Jeans 41",
    "description": "A sophisticated and tailored men's Jeans for style-focused shoppers. Designed using breathable Suede Leather textile structure in a sharp Regular silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Puma",
    "category": "Casual",
    "subCategory": "Jeans",
    "material": "Suede Leather",
    "fit": "Regular",
    "gender": "Men",
    "price": 5600,
    "originalPrice": 7839,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?sig=m_40&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Green"
    ],
    "inventory": 25,
    "occasionTags": [
      "Casual",
      "College"
    ],
    "featured": true,
    "aiRecommended": true,
    "ratings": 4.5,
    "reviewsCount": 4
  },
  {
    "name": "StyleAI Premium Men's Red Pique Cotton Chinos 42",
    "description": "A sophisticated and tailored men's Chinos for style-focused shoppers. Designed using breathable Pique Cotton textile structure in a sharp Slim Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "StyleAI Premium",
    "category": "Casual",
    "subCategory": "Chinos",
    "material": "Pique Cotton",
    "fit": "Slim Fit",
    "gender": "Men",
    "price": 5725,
    "originalPrice": 8014,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?sig=m_41&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Red"
    ],
    "inventory": 26,
    "occasionTags": [
      "Casual",
      "Office",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.6,
    "reviewsCount": 5
  },
  {
    "name": "Urban Denim Men's Blue Synthetic Leather Cargo Pants 43",
    "description": "A sophisticated and tailored men's Cargo Pants for style-focused shoppers. Designed using breathable Synthetic Leather textile structure in a sharp Oversized silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Urban Denim",
    "category": "Casual",
    "subCategory": "Cargo Pants",
    "material": "Synthetic Leather",
    "fit": "Oversized",
    "gender": "Men",
    "price": 5850,
    "originalPrice": 8189,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?sig=m_42&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Blue"
    ],
    "inventory": 27,
    "occasionTags": [
      "Casual",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 6
  },
  {
    "name": "Executive Wear Men's Navy Blue Genuine Leather Trousers 44",
    "description": "A sophisticated and tailored men's Trousers for style-focused shoppers. Designed using breathable Genuine Leather textile structure in a sharp Loose Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Executive Wear",
    "category": "Formal",
    "subCategory": "Trousers",
    "material": "Genuine Leather",
    "fit": "Loose Fit",
    "gender": "Men",
    "price": 5975,
    "originalPrice": 8365,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?sig=m_43&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Navy Blue"
    ],
    "inventory": 28,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.8,
    "reviewsCount": 7
  },
  {
    "name": "StyleAI Streetwear Men's Charcoal Grey Silk Suits 45",
    "description": "A sophisticated and tailored men's Suits for style-focused shoppers. Designed using breathable Silk textile structure in a sharp Regular silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "StyleAI Streetwear",
    "category": "Formal",
    "subCategory": "Suits",
    "material": "Silk",
    "fit": "Regular",
    "gender": "Men",
    "price": 6100,
    "originalPrice": 8540,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?sig=m_44&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Charcoal Grey"
    ],
    "inventory": 29,
    "occasionTags": [
      "Wedding",
      "Reception",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 8
  },
  {
    "name": "StyleAI Essentials Men's Light Blue Georgette Sherwanis 46",
    "description": "A sophisticated and tailored men's Sherwanis for style-focused shoppers. Designed using breathable Georgette textile structure in a sharp Slim Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "StyleAI Essentials",
    "category": "Ethnic",
    "subCategory": "Sherwanis",
    "material": "Georgette",
    "fit": "Slim Fit",
    "gender": "Men",
    "price": 6225,
    "originalPrice": 8715,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?sig=m_45&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Light Blue"
    ],
    "inventory": 30,
    "occasionTags": [
      "Wedding",
      "Reception"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.1,
    "reviewsCount": 9
  },
  {
    "name": "Royal Heritage Men's Beige Cotton Kurtas 47",
    "description": "A sophisticated and tailored men's Kurtas for style-focused shoppers. Designed using breathable Cotton textile structure in a sharp Oversized silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Royal Heritage",
    "category": "Ethnic",
    "subCategory": "Kurtas",
    "material": "Cotton",
    "fit": "Oversized",
    "gender": "Men",
    "price": 6350,
    "originalPrice": 8890,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?sig=m_46&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Beige"
    ],
    "inventory": 31,
    "occasionTags": [
      "Festive",
      "Traditional",
      "Sangeet"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 10
  },
  {
    "name": "Graceful Men's Burgundy Wool Blend Sweatshirts 48",
    "description": "A sophisticated and tailored men's Sweatshirts for style-focused shoppers. Designed using breathable Wool Blend textile structure in a sharp Loose Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Graceful",
    "category": "Casual",
    "subCategory": "Sweatshirts",
    "material": "Wool Blend",
    "fit": "Loose Fit",
    "gender": "Men",
    "price": 6475,
    "originalPrice": 9065,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?sig=m_47&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Burgundy"
    ],
    "inventory": 32,
    "occasionTags": [
      "Casual",
      "Winter"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 11
  },
  {
    "name": "Urban Ethnic Men's Yellow Polyester Blend Shirts 49",
    "description": "A sophisticated and tailored men's Shirts for style-focused shoppers. Designed using breathable Polyester Blend textile structure in a sharp Regular silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Urban Ethnic",
    "category": "Casual",
    "subCategory": "Shirts",
    "material": "Polyester Blend",
    "fit": "Regular",
    "gender": "Men",
    "price": 6600,
    "originalPrice": 9240,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?sig=m_48&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Yellow"
    ],
    "inventory": 33,
    "occasionTags": [
      "Casual",
      "Vacation",
      "Daily Wear"
    ],
    "featured": true,
    "aiRecommended": false,
    "ratings": 4.4,
    "reviewsCount": 0
  },
  {
    "name": "Zara Men's Peach Denim Cotton Shirts 50",
    "description": "A sophisticated and tailored men's Shirts for style-focused shoppers. Designed using breathable Denim Cotton textile structure in a sharp Slim Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Zara",
    "category": "Formal",
    "subCategory": "Shirts",
    "material": "Denim Cotton",
    "fit": "Slim Fit",
    "gender": "Men",
    "price": 6725,
    "originalPrice": 9415,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?sig=m_49&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Peach"
    ],
    "inventory": 34,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 1
  },
  {
    "name": "Nike Men's Orange Cotton Fleece T-Shirts 51",
    "description": "A sophisticated and tailored men's T-Shirts for style-focused shoppers. Designed using breathable Cotton Fleece textile structure in a sharp Oversized silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Nike",
    "category": "Casual",
    "subCategory": "T-Shirts",
    "material": "Cotton Fleece",
    "fit": "Oversized",
    "gender": "Men",
    "price": 6850,
    "originalPrice": 9590,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?sig=m_50&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Orange"
    ],
    "inventory": 35,
    "occasionTags": [
      "Casual",
      "College",
      "Gym"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.6,
    "reviewsCount": 2
  },
  {
    "name": "Puma Men's Maroon Rayon Polo Shirts 52",
    "description": "A sophisticated and tailored men's Polo Shirts for style-focused shoppers. Designed using breathable Rayon textile structure in a sharp Loose Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Puma",
    "category": "Casual",
    "subCategory": "Polo Shirts",
    "material": "Rayon",
    "fit": "Loose Fit",
    "gender": "Men",
    "price": 6975,
    "originalPrice": 9765,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?sig=m_51&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Maroon"
    ],
    "inventory": 36,
    "occasionTags": [
      "Casual",
      "Office",
      "College"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 3
  },
  {
    "name": "StyleAI Premium Men's Khaki Satin Silk Jeans 53",
    "description": "A sophisticated and tailored men's Jeans for style-focused shoppers. Designed using breathable Satin Silk textile structure in a sharp Regular silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "StyleAI Premium",
    "category": "Casual",
    "subCategory": "Jeans",
    "material": "Satin Silk",
    "fit": "Regular",
    "gender": "Men",
    "price": 7100,
    "originalPrice": 9940,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?sig=m_52&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Khaki"
    ],
    "inventory": 37,
    "occasionTags": [
      "Casual",
      "College"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.8,
    "reviewsCount": 4
  },
  {
    "name": "Urban Denim Men's Dark Brown Polyester Sequin Chinos 54",
    "description": "A sophisticated and tailored men's Chinos for style-focused shoppers. Designed using breathable Polyester Sequin textile structure in a sharp Slim Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Urban Denim",
    "category": "Casual",
    "subCategory": "Chinos",
    "material": "Polyester Sequin",
    "fit": "Slim Fit",
    "gender": "Men",
    "price": 7225,
    "originalPrice": 10115,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?sig=m_53&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Dark Brown"
    ],
    "inventory": 38,
    "occasionTags": [
      "Casual",
      "Office",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 5
  },
  {
    "name": "Executive Wear Men's Silver Linen Cargo Pants 55",
    "description": "A sophisticated and tailored men's Cargo Pants for style-focused shoppers. Designed using breathable Linen textile structure in a sharp Oversized silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Executive Wear",
    "category": "Casual",
    "subCategory": "Cargo Pants",
    "material": "Linen",
    "fit": "Oversized",
    "gender": "Men",
    "price": 7350,
    "originalPrice": 10290,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?sig=m_54&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Silver"
    ],
    "inventory": 39,
    "occasionTags": [
      "Casual",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 6
  },
  {
    "name": "StyleAI Streetwear Men's Pink Acrylic Wool Trousers 56",
    "description": "A sophisticated and tailored men's Trousers for style-focused shoppers. Designed using breathable Acrylic Wool textile structure in a sharp Loose Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "StyleAI Streetwear",
    "category": "Formal",
    "subCategory": "Trousers",
    "material": "Acrylic Wool",
    "fit": "Loose Fit",
    "gender": "Men",
    "price": 7475,
    "originalPrice": 10465,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?sig=m_55&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Pink"
    ],
    "inventory": 40,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.2,
    "reviewsCount": 7
  },
  {
    "name": "StyleAI Essentials Men's Gold Suede Leather Suits 57",
    "description": "A sophisticated and tailored men's Suits for style-focused shoppers. Designed using breathable Suede Leather textile structure in a sharp Regular silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "StyleAI Essentials",
    "category": "Formal",
    "subCategory": "Suits",
    "material": "Suede Leather",
    "fit": "Regular",
    "gender": "Men",
    "price": 7600,
    "originalPrice": 10640,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?sig=m_56&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Gold"
    ],
    "inventory": 41,
    "occasionTags": [
      "Wedding",
      "Reception",
      "Formal"
    ],
    "featured": true,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 8
  },
  {
    "name": "Royal Heritage Men's Black Pique Cotton Sherwanis 58",
    "description": "A sophisticated and tailored men's Sherwanis for style-focused shoppers. Designed using breathable Pique Cotton textile structure in a sharp Slim Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Royal Heritage",
    "category": "Ethnic",
    "subCategory": "Sherwanis",
    "material": "Pique Cotton",
    "fit": "Slim Fit",
    "gender": "Men",
    "price": 7725,
    "originalPrice": 10815,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?sig=m_57&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Black"
    ],
    "inventory": 42,
    "occasionTags": [
      "Wedding",
      "Reception"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.4,
    "reviewsCount": 9
  },
  {
    "name": "Graceful Men's White Synthetic Leather Kurtas 59",
    "description": "A sophisticated and tailored men's Kurtas for style-focused shoppers. Designed using breathable Synthetic Leather textile structure in a sharp Oversized silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Graceful",
    "category": "Ethnic",
    "subCategory": "Kurtas",
    "material": "Synthetic Leather",
    "fit": "Oversized",
    "gender": "Men",
    "price": 7850,
    "originalPrice": 10990,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?sig=m_58&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "White"
    ],
    "inventory": 43,
    "occasionTags": [
      "Festive",
      "Traditional",
      "Sangeet"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 10
  },
  {
    "name": "Urban Ethnic Men's Green Genuine Leather Sweatshirts 60",
    "description": "A sophisticated and tailored men's Sweatshirts for style-focused shoppers. Designed using breathable Genuine Leather textile structure in a sharp Loose Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Urban Ethnic",
    "category": "Casual",
    "subCategory": "Sweatshirts",
    "material": "Genuine Leather",
    "fit": "Loose Fit",
    "gender": "Men",
    "price": 7975,
    "originalPrice": 11165,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?sig=m_59&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Green"
    ],
    "inventory": 44,
    "occasionTags": [
      "Casual",
      "Winter"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.6,
    "reviewsCount": 11
  },
  {
    "name": "Zara Men's Red Silk Shirts 61",
    "description": "A sophisticated and tailored men's Shirts for style-focused shoppers. Designed using breathable Silk textile structure in a sharp Regular silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Zara",
    "category": "Casual",
    "subCategory": "Shirts",
    "material": "Silk",
    "fit": "Regular",
    "gender": "Men",
    "price": 8100,
    "originalPrice": 11340,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?sig=m_60&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Red"
    ],
    "inventory": 15,
    "occasionTags": [
      "Casual",
      "Vacation",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.7,
    "reviewsCount": 0
  },
  {
    "name": "Nike Men's Blue Georgette Shirts 62",
    "description": "A sophisticated and tailored men's Shirts for style-focused shoppers. Designed using breathable Georgette textile structure in a sharp Slim Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Nike",
    "category": "Formal",
    "subCategory": "Shirts",
    "material": "Georgette",
    "fit": "Slim Fit",
    "gender": "Men",
    "price": 8225,
    "originalPrice": 11515,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?sig=m_61&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Blue"
    ],
    "inventory": 16,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.8,
    "reviewsCount": 1
  },
  {
    "name": "Puma Men's Navy Blue Cotton T-Shirts 63",
    "description": "A sophisticated and tailored men's T-Shirts for style-focused shoppers. Designed using breathable Cotton textile structure in a sharp Oversized silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Puma",
    "category": "Casual",
    "subCategory": "T-Shirts",
    "material": "Cotton",
    "fit": "Oversized",
    "gender": "Men",
    "price": 8350,
    "originalPrice": 11690,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?sig=m_62&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Navy Blue"
    ],
    "inventory": 17,
    "occasionTags": [
      "Casual",
      "College",
      "Gym"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 2
  },
  {
    "name": "StyleAI Premium Men's Charcoal Grey Wool Blend Polo Shirts 64",
    "description": "A sophisticated and tailored men's Polo Shirts for style-focused shoppers. Designed using breathable Wool Blend textile structure in a sharp Loose Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "StyleAI Premium",
    "category": "Casual",
    "subCategory": "Polo Shirts",
    "material": "Wool Blend",
    "fit": "Loose Fit",
    "gender": "Men",
    "price": 8475,
    "originalPrice": 11865,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?sig=m_63&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Charcoal Grey"
    ],
    "inventory": 18,
    "occasionTags": [
      "Casual",
      "Office",
      "College"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 3
  },
  {
    "name": "Urban Denim Men's Light Blue Polyester Blend Jeans 65",
    "description": "A sophisticated and tailored men's Jeans for style-focused shoppers. Designed using breathable Polyester Blend textile structure in a sharp Regular silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Urban Denim",
    "category": "Casual",
    "subCategory": "Jeans",
    "material": "Polyester Blend",
    "fit": "Regular",
    "gender": "Men",
    "price": 8600,
    "originalPrice": 12040,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?sig=m_64&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Light Blue"
    ],
    "inventory": 19,
    "occasionTags": [
      "Casual",
      "College"
    ],
    "featured": true,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 4
  },
  {
    "name": "Executive Wear Men's Beige Denim Cotton Chinos 66",
    "description": "A sophisticated and tailored men's Chinos for style-focused shoppers. Designed using breathable Denim Cotton textile structure in a sharp Slim Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Executive Wear",
    "category": "Casual",
    "subCategory": "Chinos",
    "material": "Denim Cotton",
    "fit": "Slim Fit",
    "gender": "Men",
    "price": 8725,
    "originalPrice": 12215,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?sig=m_65&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Beige"
    ],
    "inventory": 20,
    "occasionTags": [
      "Casual",
      "Office",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.3,
    "reviewsCount": 5
  },
  {
    "name": "StyleAI Streetwear Men's Burgundy Cotton Fleece Cargo Pants 67",
    "description": "A sophisticated and tailored men's Cargo Pants for style-focused shoppers. Designed using breathable Cotton Fleece textile structure in a sharp Oversized silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "StyleAI Streetwear",
    "category": "Casual",
    "subCategory": "Cargo Pants",
    "material": "Cotton Fleece",
    "fit": "Oversized",
    "gender": "Men",
    "price": 8850,
    "originalPrice": 12390,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?sig=m_66&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Burgundy"
    ],
    "inventory": 21,
    "occasionTags": [
      "Casual",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.4,
    "reviewsCount": 6
  },
  {
    "name": "StyleAI Essentials Men's Yellow Rayon Trousers 68",
    "description": "A sophisticated and tailored men's Trousers for style-focused shoppers. Designed using breathable Rayon textile structure in a sharp Loose Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "StyleAI Essentials",
    "category": "Formal",
    "subCategory": "Trousers",
    "material": "Rayon",
    "fit": "Loose Fit",
    "gender": "Men",
    "price": 8975,
    "originalPrice": 12565,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?sig=m_67&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Yellow"
    ],
    "inventory": 22,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 7
  },
  {
    "name": "Royal Heritage Men's Peach Satin Silk Suits 69",
    "description": "A sophisticated and tailored men's Suits for style-focused shoppers. Designed using breathable Satin Silk textile structure in a sharp Regular silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Royal Heritage",
    "category": "Formal",
    "subCategory": "Suits",
    "material": "Satin Silk",
    "fit": "Regular",
    "gender": "Men",
    "price": 9100,
    "originalPrice": 12740,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?sig=m_68&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Peach"
    ],
    "inventory": 23,
    "occasionTags": [
      "Wedding",
      "Reception",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.6,
    "reviewsCount": 8
  },
  {
    "name": "Graceful Men's Orange Polyester Sequin Sherwanis 70",
    "description": "A sophisticated and tailored men's Sherwanis for style-focused shoppers. Designed using breathable Polyester Sequin textile structure in a sharp Slim Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Graceful",
    "category": "Ethnic",
    "subCategory": "Sherwanis",
    "material": "Polyester Sequin",
    "fit": "Slim Fit",
    "gender": "Men",
    "price": 9225,
    "originalPrice": 12915,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?sig=m_69&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Orange"
    ],
    "inventory": 24,
    "occasionTags": [
      "Wedding",
      "Reception"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 9
  },
  {
    "name": "Urban Ethnic Men's Maroon Linen Kurtas 71",
    "description": "A sophisticated and tailored men's Kurtas for style-focused shoppers. Designed using breathable Linen textile structure in a sharp Oversized silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Urban Ethnic",
    "category": "Ethnic",
    "subCategory": "Kurtas",
    "material": "Linen",
    "fit": "Oversized",
    "gender": "Men",
    "price": 9350,
    "originalPrice": 13090,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?sig=m_70&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Maroon"
    ],
    "inventory": 25,
    "occasionTags": [
      "Festive",
      "Traditional",
      "Sangeet"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.8,
    "reviewsCount": 10
  },
  {
    "name": "Zara Men's Khaki Acrylic Wool Sweatshirts 72",
    "description": "A sophisticated and tailored men's Sweatshirts for style-focused shoppers. Designed using breathable Acrylic Wool textile structure in a sharp Loose Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Zara",
    "category": "Casual",
    "subCategory": "Sweatshirts",
    "material": "Acrylic Wool",
    "fit": "Loose Fit",
    "gender": "Men",
    "price": 9475,
    "originalPrice": 13265,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?sig=m_71&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Khaki"
    ],
    "inventory": 26,
    "occasionTags": [
      "Casual",
      "Winter"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 11
  },
  {
    "name": "Nike Men's Dark Brown Suede Leather Shirts 73",
    "description": "A sophisticated and tailored men's Shirts for style-focused shoppers. Designed using breathable Suede Leather textile structure in a sharp Regular silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Nike",
    "category": "Casual",
    "subCategory": "Shirts",
    "material": "Suede Leather",
    "fit": "Regular",
    "gender": "Men",
    "price": 9600,
    "originalPrice": 13440,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?sig=m_72&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Dark Brown"
    ],
    "inventory": 27,
    "occasionTags": [
      "Casual",
      "Vacation",
      "Daily Wear"
    ],
    "featured": true,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 0
  },
  {
    "name": "Puma Men's Silver Pique Cotton Shirts 74",
    "description": "A sophisticated and tailored men's Shirts for style-focused shoppers. Designed using breathable Pique Cotton textile structure in a sharp Slim Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Puma",
    "category": "Formal",
    "subCategory": "Shirts",
    "material": "Pique Cotton",
    "fit": "Slim Fit",
    "gender": "Men",
    "price": 9725,
    "originalPrice": 13615,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?sig=m_73&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Silver"
    ],
    "inventory": 28,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 1
  },
  {
    "name": "StyleAI Premium Men's Pink Synthetic Leather T-Shirts 75",
    "description": "A sophisticated and tailored men's T-Shirts for style-focused shoppers. Designed using breathable Synthetic Leather textile structure in a sharp Oversized silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "StyleAI Premium",
    "category": "Casual",
    "subCategory": "T-Shirts",
    "material": "Synthetic Leather",
    "fit": "Oversized",
    "gender": "Men",
    "price": 9850,
    "originalPrice": 13790,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?sig=m_74&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Pink"
    ],
    "inventory": 29,
    "occasionTags": [
      "Casual",
      "College",
      "Gym"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 2
  },
  {
    "name": "Urban Denim Men's Gold Genuine Leather Polo Shirts 76",
    "description": "A sophisticated and tailored men's Polo Shirts for style-focused shoppers. Designed using breathable Genuine Leather textile structure in a sharp Loose Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Urban Denim",
    "category": "Casual",
    "subCategory": "Polo Shirts",
    "material": "Genuine Leather",
    "fit": "Loose Fit",
    "gender": "Men",
    "price": 9975,
    "originalPrice": 13965,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?sig=m_75&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Gold"
    ],
    "inventory": 30,
    "occasionTags": [
      "Casual",
      "Office",
      "College"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.4,
    "reviewsCount": 3
  },
  {
    "name": "Executive Wear Men's Black Silk Jeans 77",
    "description": "A sophisticated and tailored men's Jeans for style-focused shoppers. Designed using breathable Silk textile structure in a sharp Regular silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Executive Wear",
    "category": "Casual",
    "subCategory": "Jeans",
    "material": "Silk",
    "fit": "Regular",
    "gender": "Men",
    "price": 10100,
    "originalPrice": 14140,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?sig=m_76&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Black"
    ],
    "inventory": 31,
    "occasionTags": [
      "Casual",
      "College"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 4
  },
  {
    "name": "StyleAI Streetwear Men's White Georgette Chinos 78",
    "description": "A sophisticated and tailored men's Chinos for style-focused shoppers. Designed using breathable Georgette textile structure in a sharp Slim Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "StyleAI Streetwear",
    "category": "Casual",
    "subCategory": "Chinos",
    "material": "Georgette",
    "fit": "Slim Fit",
    "gender": "Men",
    "price": 10225,
    "originalPrice": 14315,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?sig=m_77&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "White"
    ],
    "inventory": 32,
    "occasionTags": [
      "Casual",
      "Office",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.6,
    "reviewsCount": 5
  },
  {
    "name": "StyleAI Essentials Men's Green Cotton Cargo Pants 79",
    "description": "A sophisticated and tailored men's Cargo Pants for style-focused shoppers. Designed using breathable Cotton textile structure in a sharp Oversized silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "StyleAI Essentials",
    "category": "Casual",
    "subCategory": "Cargo Pants",
    "material": "Cotton",
    "fit": "Oversized",
    "gender": "Men",
    "price": 10350,
    "originalPrice": 14489,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?sig=m_78&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Green"
    ],
    "inventory": 33,
    "occasionTags": [
      "Casual",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 6
  },
  {
    "name": "Royal Heritage Men's Red Wool Blend Trousers 80",
    "description": "A sophisticated and tailored men's Trousers for style-focused shoppers. Designed using breathable Wool Blend textile structure in a sharp Loose Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Royal Heritage",
    "category": "Formal",
    "subCategory": "Trousers",
    "material": "Wool Blend",
    "fit": "Loose Fit",
    "gender": "Men",
    "price": 10475,
    "originalPrice": 14664,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?sig=m_79&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Red"
    ],
    "inventory": 34,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.8,
    "reviewsCount": 7
  },
  {
    "name": "Graceful Men's Blue Polyester Blend Suits 81",
    "description": "A sophisticated and tailored men's Suits for style-focused shoppers. Designed using breathable Polyester Blend textile structure in a sharp Regular silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Graceful",
    "category": "Formal",
    "subCategory": "Suits",
    "material": "Polyester Blend",
    "fit": "Regular",
    "gender": "Men",
    "price": 10600,
    "originalPrice": 14839,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?sig=m_80&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Blue"
    ],
    "inventory": 35,
    "occasionTags": [
      "Wedding",
      "Reception",
      "Formal"
    ],
    "featured": true,
    "aiRecommended": true,
    "ratings": 4.9,
    "reviewsCount": 8
  },
  {
    "name": "Urban Ethnic Men's Navy Blue Denim Cotton Sherwanis 82",
    "description": "A sophisticated and tailored men's Sherwanis for style-focused shoppers. Designed using breathable Denim Cotton textile structure in a sharp Slim Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Urban Ethnic",
    "category": "Ethnic",
    "subCategory": "Sherwanis",
    "material": "Denim Cotton",
    "fit": "Slim Fit",
    "gender": "Men",
    "price": 10725,
    "originalPrice": 15014,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?sig=m_81&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Navy Blue"
    ],
    "inventory": 36,
    "occasionTags": [
      "Wedding",
      "Reception"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 9
  },
  {
    "name": "Zara Men's Charcoal Grey Cotton Fleece Kurtas 83",
    "description": "A sophisticated and tailored men's Kurtas for style-focused shoppers. Designed using breathable Cotton Fleece textile structure in a sharp Oversized silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Zara",
    "category": "Ethnic",
    "subCategory": "Kurtas",
    "material": "Cotton Fleece",
    "fit": "Oversized",
    "gender": "Men",
    "price": 10850,
    "originalPrice": 15189,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?sig=m_82&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Charcoal Grey"
    ],
    "inventory": 37,
    "occasionTags": [
      "Festive",
      "Traditional",
      "Sangeet"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 10
  },
  {
    "name": "Nike Men's Light Blue Rayon Sweatshirts 84",
    "description": "A sophisticated and tailored men's Sweatshirts for style-focused shoppers. Designed using breathable Rayon textile structure in a sharp Loose Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Nike",
    "category": "Casual",
    "subCategory": "Sweatshirts",
    "material": "Rayon",
    "fit": "Loose Fit",
    "gender": "Men",
    "price": 10975,
    "originalPrice": 15364,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?sig=m_83&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Light Blue"
    ],
    "inventory": 38,
    "occasionTags": [
      "Casual",
      "Winter"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 11
  },
  {
    "name": "Puma Men's Beige Satin Silk Shirts 85",
    "description": "A sophisticated and tailored men's Shirts for style-focused shoppers. Designed using breathable Satin Silk textile structure in a sharp Regular silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Puma",
    "category": "Casual",
    "subCategory": "Shirts",
    "material": "Satin Silk",
    "fit": "Regular",
    "gender": "Men",
    "price": 11100,
    "originalPrice": 15539,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?sig=m_84&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Beige"
    ],
    "inventory": 39,
    "occasionTags": [
      "Casual",
      "Vacation",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.4,
    "reviewsCount": 0
  },
  {
    "name": "StyleAI Premium Men's Burgundy Polyester Sequin Shirts 86",
    "description": "A sophisticated and tailored men's Shirts for style-focused shoppers. Designed using breathable Polyester Sequin textile structure in a sharp Slim Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "StyleAI Premium",
    "category": "Formal",
    "subCategory": "Shirts",
    "material": "Polyester Sequin",
    "fit": "Slim Fit",
    "gender": "Men",
    "price": 11225,
    "originalPrice": 15714,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?sig=m_85&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Burgundy"
    ],
    "inventory": 40,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.5,
    "reviewsCount": 1
  },
  {
    "name": "Urban Denim Men's Yellow Linen T-Shirts 87",
    "description": "A sophisticated and tailored men's T-Shirts for style-focused shoppers. Designed using breathable Linen textile structure in a sharp Oversized silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Urban Denim",
    "category": "Casual",
    "subCategory": "T-Shirts",
    "material": "Linen",
    "fit": "Oversized",
    "gender": "Men",
    "price": 11350,
    "originalPrice": 15889,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?sig=m_86&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Yellow"
    ],
    "inventory": 41,
    "occasionTags": [
      "Casual",
      "College",
      "Gym"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.6,
    "reviewsCount": 2
  },
  {
    "name": "Executive Wear Men's Peach Acrylic Wool Polo Shirts 88",
    "description": "A sophisticated and tailored men's Polo Shirts for style-focused shoppers. Designed using breathable Acrylic Wool textile structure in a sharp Loose Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Executive Wear",
    "category": "Casual",
    "subCategory": "Polo Shirts",
    "material": "Acrylic Wool",
    "fit": "Loose Fit",
    "gender": "Men",
    "price": 11475,
    "originalPrice": 16064,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?sig=m_87&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Peach"
    ],
    "inventory": 42,
    "occasionTags": [
      "Casual",
      "Office",
      "College"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 3
  },
  {
    "name": "StyleAI Streetwear Men's Orange Suede Leather Jeans 89",
    "description": "A sophisticated and tailored men's Jeans for style-focused shoppers. Designed using breathable Suede Leather textile structure in a sharp Regular silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "StyleAI Streetwear",
    "category": "Casual",
    "subCategory": "Jeans",
    "material": "Suede Leather",
    "fit": "Regular",
    "gender": "Men",
    "price": 11600,
    "originalPrice": 16239,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?sig=m_88&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Orange"
    ],
    "inventory": 43,
    "occasionTags": [
      "Casual",
      "College"
    ],
    "featured": true,
    "aiRecommended": false,
    "ratings": 4.8,
    "reviewsCount": 4
  },
  {
    "name": "StyleAI Essentials Men's Maroon Pique Cotton Chinos 90",
    "description": "A sophisticated and tailored men's Chinos for style-focused shoppers. Designed using breathable Pique Cotton textile structure in a sharp Slim Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "StyleAI Essentials",
    "category": "Casual",
    "subCategory": "Chinos",
    "material": "Pique Cotton",
    "fit": "Slim Fit",
    "gender": "Men",
    "price": 11725,
    "originalPrice": 16415,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?sig=m_89&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Maroon"
    ],
    "inventory": 44,
    "occasionTags": [
      "Casual",
      "Office",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 5
  },
  {
    "name": "Royal Heritage Men's Khaki Synthetic Leather Cargo Pants 91",
    "description": "A sophisticated and tailored men's Cargo Pants for style-focused shoppers. Designed using breathable Synthetic Leather textile structure in a sharp Oversized silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Royal Heritage",
    "category": "Casual",
    "subCategory": "Cargo Pants",
    "material": "Synthetic Leather",
    "fit": "Oversized",
    "gender": "Men",
    "price": 11850,
    "originalPrice": 16590,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?sig=m_90&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Khaki"
    ],
    "inventory": 15,
    "occasionTags": [
      "Casual",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.1,
    "reviewsCount": 6
  },
  {
    "name": "Graceful Men's Dark Brown Genuine Leather Trousers 92",
    "description": "A sophisticated and tailored men's Trousers for style-focused shoppers. Designed using breathable Genuine Leather textile structure in a sharp Loose Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Graceful",
    "category": "Formal",
    "subCategory": "Trousers",
    "material": "Genuine Leather",
    "fit": "Loose Fit",
    "gender": "Men",
    "price": 11975,
    "originalPrice": 16765,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?sig=m_91&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Dark Brown"
    ],
    "inventory": 16,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 7
  },
  {
    "name": "Urban Ethnic Men's Silver Silk Suits 93",
    "description": "A sophisticated and tailored men's Suits for style-focused shoppers. Designed using breathable Silk textile structure in a sharp Regular silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Urban Ethnic",
    "category": "Formal",
    "subCategory": "Suits",
    "material": "Silk",
    "fit": "Regular",
    "gender": "Men",
    "price": 12100,
    "originalPrice": 16940,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?sig=m_92&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Silver"
    ],
    "inventory": 17,
    "occasionTags": [
      "Wedding",
      "Reception",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 8
  },
  {
    "name": "Zara Men's Pink Georgette Sherwanis 94",
    "description": "A sophisticated and tailored men's Sherwanis for style-focused shoppers. Designed using breathable Georgette textile structure in a sharp Slim Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Zara",
    "category": "Ethnic",
    "subCategory": "Sherwanis",
    "material": "Georgette",
    "fit": "Slim Fit",
    "gender": "Men",
    "price": 12225,
    "originalPrice": 17115,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?sig=m_93&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Pink"
    ],
    "inventory": 18,
    "occasionTags": [
      "Wedding",
      "Reception"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.4,
    "reviewsCount": 9
  },
  {
    "name": "Nike Men's Gold Cotton Kurtas 95",
    "description": "A sophisticated and tailored men's Kurtas for style-focused shoppers. Designed using breathable Cotton textile structure in a sharp Oversized silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Nike",
    "category": "Ethnic",
    "subCategory": "Kurtas",
    "material": "Cotton",
    "fit": "Oversized",
    "gender": "Men",
    "price": 12350,
    "originalPrice": 17290,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?sig=m_94&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Gold"
    ],
    "inventory": 19,
    "occasionTags": [
      "Festive",
      "Traditional",
      "Sangeet"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 10
  },
  {
    "name": "Puma Men's Black Wool Blend Sweatshirts 96",
    "description": "A sophisticated and tailored men's Sweatshirts for style-focused shoppers. Designed using breathable Wool Blend textile structure in a sharp Loose Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Puma",
    "category": "Casual",
    "subCategory": "Sweatshirts",
    "material": "Wool Blend",
    "fit": "Loose Fit",
    "gender": "Men",
    "price": 12475,
    "originalPrice": 17465,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?sig=m_95&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Black"
    ],
    "inventory": 20,
    "occasionTags": [
      "Casual",
      "Winter"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.6,
    "reviewsCount": 11
  },
  {
    "name": "StyleAI Premium Men's White Polyester Blend Shirts 97",
    "description": "A sophisticated and tailored men's Shirts for style-focused shoppers. Designed using breathable Polyester Blend textile structure in a sharp Regular silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "StyleAI Premium",
    "category": "Casual",
    "subCategory": "Shirts",
    "material": "Polyester Blend",
    "fit": "Regular",
    "gender": "Men",
    "price": 12600,
    "originalPrice": 17640,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?sig=m_96&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "White"
    ],
    "inventory": 21,
    "occasionTags": [
      "Casual",
      "Vacation",
      "Daily Wear"
    ],
    "featured": true,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 0
  },
  {
    "name": "Urban Denim Men's Green Denim Cotton Shirts 98",
    "description": "A sophisticated and tailored men's Shirts for style-focused shoppers. Designed using breathable Denim Cotton textile structure in a sharp Slim Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Urban Denim",
    "category": "Formal",
    "subCategory": "Shirts",
    "material": "Denim Cotton",
    "fit": "Slim Fit",
    "gender": "Men",
    "price": 12725,
    "originalPrice": 17815,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?sig=m_97&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Green"
    ],
    "inventory": 22,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.8,
    "reviewsCount": 1
  },
  {
    "name": "Executive Wear Men's Red Cotton Fleece T-Shirts 99",
    "description": "A sophisticated and tailored men's T-Shirts for style-focused shoppers. Designed using breathable Cotton Fleece textile structure in a sharp Oversized silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Executive Wear",
    "category": "Casual",
    "subCategory": "T-Shirts",
    "material": "Cotton Fleece",
    "fit": "Oversized",
    "gender": "Men",
    "price": 12850,
    "originalPrice": 17990,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?sig=m_98&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Red"
    ],
    "inventory": 23,
    "occasionTags": [
      "Casual",
      "College",
      "Gym"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 2
  },
  {
    "name": "StyleAI Streetwear Men's Blue Rayon Polo Shirts 100",
    "description": "A sophisticated and tailored men's Polo Shirts for style-focused shoppers. Designed using breathable Rayon textile structure in a sharp Loose Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "StyleAI Streetwear",
    "category": "Casual",
    "subCategory": "Polo Shirts",
    "material": "Rayon",
    "fit": "Loose Fit",
    "gender": "Men",
    "price": 12975,
    "originalPrice": 18165,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?sig=m_99&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Blue"
    ],
    "inventory": 24,
    "occasionTags": [
      "Casual",
      "Office",
      "College"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 3
  },
  {
    "name": "StyleAI Essentials Men's Navy Blue Satin Silk Jeans 101",
    "description": "A sophisticated and tailored men's Jeans for style-focused shoppers. Designed using breathable Satin Silk textile structure in a sharp Regular silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "StyleAI Essentials",
    "category": "Casual",
    "subCategory": "Jeans",
    "material": "Satin Silk",
    "fit": "Regular",
    "gender": "Men",
    "price": 13100,
    "originalPrice": 18340,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?sig=m_100&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Navy Blue"
    ],
    "inventory": 25,
    "occasionTags": [
      "Casual",
      "College"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.2,
    "reviewsCount": 4
  },
  {
    "name": "Royal Heritage Men's Charcoal Grey Polyester Sequin Chinos 102",
    "description": "A sophisticated and tailored men's Chinos for style-focused shoppers. Designed using breathable Polyester Sequin textile structure in a sharp Slim Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Royal Heritage",
    "category": "Casual",
    "subCategory": "Chinos",
    "material": "Polyester Sequin",
    "fit": "Slim Fit",
    "gender": "Men",
    "price": 13225,
    "originalPrice": 18515,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?sig=m_101&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Charcoal Grey"
    ],
    "inventory": 26,
    "occasionTags": [
      "Casual",
      "Office",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 5
  },
  {
    "name": "Graceful Men's Light Blue Linen Cargo Pants 103",
    "description": "A sophisticated and tailored men's Cargo Pants for style-focused shoppers. Designed using breathable Linen textile structure in a sharp Oversized silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Graceful",
    "category": "Casual",
    "subCategory": "Cargo Pants",
    "material": "Linen",
    "fit": "Oversized",
    "gender": "Men",
    "price": 13350,
    "originalPrice": 18690,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?sig=m_102&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Light Blue"
    ],
    "inventory": 27,
    "occasionTags": [
      "Casual",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.4,
    "reviewsCount": 6
  },
  {
    "name": "Urban Ethnic Men's Beige Acrylic Wool Trousers 104",
    "description": "A sophisticated and tailored men's Trousers for style-focused shoppers. Designed using breathable Acrylic Wool textile structure in a sharp Loose Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Urban Ethnic",
    "category": "Formal",
    "subCategory": "Trousers",
    "material": "Acrylic Wool",
    "fit": "Loose Fit",
    "gender": "Men",
    "price": 13475,
    "originalPrice": 18865,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?sig=m_103&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Beige"
    ],
    "inventory": 28,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 7
  },
  {
    "name": "Zara Men's Burgundy Suede Leather Suits 105",
    "description": "A sophisticated and tailored men's Suits for style-focused shoppers. Designed using breathable Suede Leather textile structure in a sharp Regular silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Zara",
    "category": "Formal",
    "subCategory": "Suits",
    "material": "Suede Leather",
    "fit": "Regular",
    "gender": "Men",
    "price": 13600,
    "originalPrice": 19040,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?sig=m_104&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Burgundy"
    ],
    "inventory": 29,
    "occasionTags": [
      "Wedding",
      "Reception",
      "Formal"
    ],
    "featured": true,
    "aiRecommended": false,
    "ratings": 4.6,
    "reviewsCount": 8
  },
  {
    "name": "Nike Men's Yellow Pique Cotton Sherwanis 106",
    "description": "A sophisticated and tailored men's Sherwanis for style-focused shoppers. Designed using breathable Pique Cotton textile structure in a sharp Slim Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Nike",
    "category": "Ethnic",
    "subCategory": "Sherwanis",
    "material": "Pique Cotton",
    "fit": "Slim Fit",
    "gender": "Men",
    "price": 13725,
    "originalPrice": 19215,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?sig=m_105&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Yellow"
    ],
    "inventory": 30,
    "occasionTags": [
      "Wedding",
      "Reception"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.7,
    "reviewsCount": 9
  },
  {
    "name": "Puma Men's Peach Synthetic Leather Kurtas 107",
    "description": "A sophisticated and tailored men's Kurtas for style-focused shoppers. Designed using breathable Synthetic Leather textile structure in a sharp Oversized silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Puma",
    "category": "Ethnic",
    "subCategory": "Kurtas",
    "material": "Synthetic Leather",
    "fit": "Oversized",
    "gender": "Men",
    "price": 13850,
    "originalPrice": 19390,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?sig=m_106&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Peach"
    ],
    "inventory": 31,
    "occasionTags": [
      "Festive",
      "Traditional",
      "Sangeet"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.8,
    "reviewsCount": 10
  },
  {
    "name": "StyleAI Premium Men's Orange Genuine Leather Sweatshirts 108",
    "description": "A sophisticated and tailored men's Sweatshirts for style-focused shoppers. Designed using breathable Genuine Leather textile structure in a sharp Loose Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "StyleAI Premium",
    "category": "Casual",
    "subCategory": "Sweatshirts",
    "material": "Genuine Leather",
    "fit": "Loose Fit",
    "gender": "Men",
    "price": 13975,
    "originalPrice": 19565,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?sig=m_107&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Orange"
    ],
    "inventory": 32,
    "occasionTags": [
      "Casual",
      "Winter"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 11
  },
  {
    "name": "Urban Denim Men's Maroon Silk Shirts 109",
    "description": "A sophisticated and tailored men's Shirts for style-focused shoppers. Designed using breathable Silk textile structure in a sharp Regular silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Urban Denim",
    "category": "Casual",
    "subCategory": "Shirts",
    "material": "Silk",
    "fit": "Regular",
    "gender": "Men",
    "price": 14100,
    "originalPrice": 19740,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?sig=m_108&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Maroon"
    ],
    "inventory": 33,
    "occasionTags": [
      "Casual",
      "Vacation",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 0
  },
  {
    "name": "Executive Wear Men's Khaki Georgette Shirts 110",
    "description": "A sophisticated and tailored men's Shirts for style-focused shoppers. Designed using breathable Georgette textile structure in a sharp Slim Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Executive Wear",
    "category": "Formal",
    "subCategory": "Shirts",
    "material": "Georgette",
    "fit": "Slim Fit",
    "gender": "Men",
    "price": 14225,
    "originalPrice": 19915,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?sig=m_109&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Khaki"
    ],
    "inventory": 34,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 1
  },
  {
    "name": "StyleAI Streetwear Men's Dark Brown Cotton T-Shirts 111",
    "description": "A sophisticated and tailored men's T-Shirts for style-focused shoppers. Designed using breathable Cotton textile structure in a sharp Oversized silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "StyleAI Streetwear",
    "category": "Casual",
    "subCategory": "T-Shirts",
    "material": "Cotton",
    "fit": "Oversized",
    "gender": "Men",
    "price": 14350,
    "originalPrice": 20090,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?sig=m_110&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Dark Brown"
    ],
    "inventory": 35,
    "occasionTags": [
      "Casual",
      "College",
      "Gym"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.3,
    "reviewsCount": 2
  },
  {
    "name": "StyleAI Essentials Men's Silver Wool Blend Polo Shirts 112",
    "description": "A sophisticated and tailored men's Polo Shirts for style-focused shoppers. Designed using breathable Wool Blend textile structure in a sharp Loose Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "StyleAI Essentials",
    "category": "Casual",
    "subCategory": "Polo Shirts",
    "material": "Wool Blend",
    "fit": "Loose Fit",
    "gender": "Men",
    "price": 14475,
    "originalPrice": 20265,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?sig=m_111&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Silver"
    ],
    "inventory": 36,
    "occasionTags": [
      "Casual",
      "Office",
      "College"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.4,
    "reviewsCount": 3
  },
  {
    "name": "Royal Heritage Men's Pink Polyester Blend Jeans 113",
    "description": "A sophisticated and tailored men's Jeans for style-focused shoppers. Designed using breathable Polyester Blend textile structure in a sharp Regular silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Royal Heritage",
    "category": "Casual",
    "subCategory": "Jeans",
    "material": "Polyester Blend",
    "fit": "Regular",
    "gender": "Men",
    "price": 600,
    "originalPrice": 840,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?sig=m_112&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Pink"
    ],
    "inventory": 37,
    "occasionTags": [
      "Casual",
      "College"
    ],
    "featured": true,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 4
  },
  {
    "name": "Graceful Men's Gold Denim Cotton Chinos 114",
    "description": "A sophisticated and tailored men's Chinos for style-focused shoppers. Designed using breathable Denim Cotton textile structure in a sharp Slim Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Graceful",
    "category": "Casual",
    "subCategory": "Chinos",
    "material": "Denim Cotton",
    "fit": "Slim Fit",
    "gender": "Men",
    "price": 725,
    "originalPrice": 1014,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?sig=m_113&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Gold"
    ],
    "inventory": 38,
    "occasionTags": [
      "Casual",
      "Office",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.6,
    "reviewsCount": 5
  },
  {
    "name": "Urban Ethnic Men's Black Cotton Fleece Cargo Pants 115",
    "description": "A sophisticated and tailored men's Cargo Pants for style-focused shoppers. Designed using breathable Cotton Fleece textile structure in a sharp Oversized silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Urban Ethnic",
    "category": "Casual",
    "subCategory": "Cargo Pants",
    "material": "Cotton Fleece",
    "fit": "Oversized",
    "gender": "Men",
    "price": 850,
    "originalPrice": 1190,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?sig=m_114&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Black"
    ],
    "inventory": 39,
    "occasionTags": [
      "Casual",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 6
  },
  {
    "name": "Zara Men's White Rayon Trousers 116",
    "description": "A sophisticated and tailored men's Trousers for style-focused shoppers. Designed using breathable Rayon textile structure in a sharp Loose Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Zara",
    "category": "Formal",
    "subCategory": "Trousers",
    "material": "Rayon",
    "fit": "Loose Fit",
    "gender": "Men",
    "price": 975,
    "originalPrice": 1365,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?sig=m_115&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "White"
    ],
    "inventory": 40,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.8,
    "reviewsCount": 7
  },
  {
    "name": "Nike Men's Green Satin Silk Suits 117",
    "description": "A sophisticated and tailored men's Suits for style-focused shoppers. Designed using breathable Satin Silk textile structure in a sharp Regular silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Nike",
    "category": "Formal",
    "subCategory": "Suits",
    "material": "Satin Silk",
    "fit": "Regular",
    "gender": "Men",
    "price": 1100,
    "originalPrice": 1540,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?sig=m_116&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Green"
    ],
    "inventory": 41,
    "occasionTags": [
      "Wedding",
      "Reception",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 8
  },
  {
    "name": "Puma Men's Red Polyester Sequin Sherwanis 118",
    "description": "A sophisticated and tailored men's Sherwanis for style-focused shoppers. Designed using breathable Polyester Sequin textile structure in a sharp Slim Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Puma",
    "category": "Ethnic",
    "subCategory": "Sherwanis",
    "material": "Polyester Sequin",
    "fit": "Slim Fit",
    "gender": "Men",
    "price": 1225,
    "originalPrice": 1715,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?sig=m_117&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Red"
    ],
    "inventory": 42,
    "occasionTags": [
      "Wedding",
      "Reception"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 9
  },
  {
    "name": "StyleAI Premium Men's Blue Linen Kurtas 119",
    "description": "A sophisticated and tailored men's Kurtas for style-focused shoppers. Designed using breathable Linen textile structure in a sharp Oversized silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "StyleAI Premium",
    "category": "Ethnic",
    "subCategory": "Kurtas",
    "material": "Linen",
    "fit": "Oversized",
    "gender": "Men",
    "price": 1350,
    "originalPrice": 1889,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?sig=m_118&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Blue"
    ],
    "inventory": 43,
    "occasionTags": [
      "Festive",
      "Traditional",
      "Sangeet"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 10
  },
  {
    "name": "Urban Denim Men's Navy Blue Acrylic Wool Sweatshirts 120",
    "description": "A sophisticated and tailored men's Sweatshirts for style-focused shoppers. Designed using breathable Acrylic Wool textile structure in a sharp Loose Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Urban Denim",
    "category": "Casual",
    "subCategory": "Sweatshirts",
    "material": "Acrylic Wool",
    "fit": "Loose Fit",
    "gender": "Men",
    "price": 1475,
    "originalPrice": 2065,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?sig=m_119&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Navy Blue"
    ],
    "inventory": 44,
    "occasionTags": [
      "Casual",
      "Winter"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 11
  },
  {
    "name": "Executive Wear Men's Charcoal Grey Suede Leather Shirts 121",
    "description": "A sophisticated and tailored men's Shirts for style-focused shoppers. Designed using breathable Suede Leather textile structure in a sharp Regular silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Executive Wear",
    "category": "Casual",
    "subCategory": "Shirts",
    "material": "Suede Leather",
    "fit": "Regular",
    "gender": "Men",
    "price": 1600,
    "originalPrice": 2240,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?sig=m_120&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Charcoal Grey"
    ],
    "inventory": 15,
    "occasionTags": [
      "Casual",
      "Vacation",
      "Daily Wear"
    ],
    "featured": true,
    "aiRecommended": true,
    "ratings": 4.4,
    "reviewsCount": 0
  },
  {
    "name": "StyleAI Streetwear Men's Light Blue Pique Cotton Shirts 122",
    "description": "A sophisticated and tailored men's Shirts for style-focused shoppers. Designed using breathable Pique Cotton textile structure in a sharp Slim Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "StyleAI Streetwear",
    "category": "Formal",
    "subCategory": "Shirts",
    "material": "Pique Cotton",
    "fit": "Slim Fit",
    "gender": "Men",
    "price": 1725,
    "originalPrice": 2415,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?sig=m_121&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Light Blue"
    ],
    "inventory": 16,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 1
  },
  {
    "name": "StyleAI Essentials Men's Beige Synthetic Leather T-Shirts 123",
    "description": "A sophisticated and tailored men's T-Shirts for style-focused shoppers. Designed using breathable Synthetic Leather textile structure in a sharp Oversized silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "StyleAI Essentials",
    "category": "Casual",
    "subCategory": "T-Shirts",
    "material": "Synthetic Leather",
    "fit": "Oversized",
    "gender": "Men",
    "price": 1850,
    "originalPrice": 2590,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?sig=m_122&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Beige"
    ],
    "inventory": 17,
    "occasionTags": [
      "Casual",
      "College",
      "Gym"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.6,
    "reviewsCount": 2
  },
  {
    "name": "Royal Heritage Men's Burgundy Genuine Leather Polo Shirts 124",
    "description": "A sophisticated and tailored men's Polo Shirts for style-focused shoppers. Designed using breathable Genuine Leather textile structure in a sharp Loose Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Royal Heritage",
    "category": "Casual",
    "subCategory": "Polo Shirts",
    "material": "Genuine Leather",
    "fit": "Loose Fit",
    "gender": "Men",
    "price": 1975,
    "originalPrice": 2765,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?sig=m_123&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Burgundy"
    ],
    "inventory": 18,
    "occasionTags": [
      "Casual",
      "Office",
      "College"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 3
  },
  {
    "name": "Graceful Men's Yellow Silk Jeans 125",
    "description": "A sophisticated and tailored men's Jeans for style-focused shoppers. Designed using breathable Silk textile structure in a sharp Regular silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Graceful",
    "category": "Casual",
    "subCategory": "Jeans",
    "material": "Silk",
    "fit": "Regular",
    "gender": "Men",
    "price": 2100,
    "originalPrice": 2940,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?sig=m_124&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Yellow"
    ],
    "inventory": 19,
    "occasionTags": [
      "Casual",
      "College"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.8,
    "reviewsCount": 4
  },
  {
    "name": "Urban Ethnic Men's Peach Georgette Chinos 126",
    "description": "A sophisticated and tailored men's Chinos for style-focused shoppers. Designed using breathable Georgette textile structure in a sharp Slim Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Urban Ethnic",
    "category": "Casual",
    "subCategory": "Chinos",
    "material": "Georgette",
    "fit": "Slim Fit",
    "gender": "Men",
    "price": 2225,
    "originalPrice": 3115,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?sig=m_125&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Peach"
    ],
    "inventory": 20,
    "occasionTags": [
      "Casual",
      "Office",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.9,
    "reviewsCount": 5
  },
  {
    "name": "Zara Men's Orange Cotton Cargo Pants 127",
    "description": "A sophisticated and tailored men's Cargo Pants for style-focused shoppers. Designed using breathable Cotton textile structure in a sharp Oversized silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Zara",
    "category": "Casual",
    "subCategory": "Cargo Pants",
    "material": "Cotton",
    "fit": "Oversized",
    "gender": "Men",
    "price": 2350,
    "originalPrice": 3290,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?sig=m_126&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Orange"
    ],
    "inventory": 21,
    "occasionTags": [
      "Casual",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 6
  },
  {
    "name": "Nike Men's Maroon Wool Blend Trousers 128",
    "description": "A sophisticated and tailored men's Trousers for style-focused shoppers. Designed using breathable Wool Blend textile structure in a sharp Loose Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Nike",
    "category": "Formal",
    "subCategory": "Trousers",
    "material": "Wool Blend",
    "fit": "Loose Fit",
    "gender": "Men",
    "price": 2475,
    "originalPrice": 3465,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?sig=m_127&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Maroon"
    ],
    "inventory": 22,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 7
  },
  {
    "name": "Puma Men's Khaki Polyester Blend Suits 129",
    "description": "A sophisticated and tailored men's Suits for style-focused shoppers. Designed using breathable Polyester Blend textile structure in a sharp Regular silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "Puma",
    "category": "Formal",
    "subCategory": "Suits",
    "material": "Polyester Blend",
    "fit": "Regular",
    "gender": "Men",
    "price": 2600,
    "originalPrice": 3639,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?sig=m_128&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Khaki"
    ],
    "inventory": 23,
    "occasionTags": [
      "Wedding",
      "Reception",
      "Formal"
    ],
    "featured": true,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 8
  },
  {
    "name": "StyleAI Premium Men's Dark Brown Denim Cotton Sherwanis 130",
    "description": "A sophisticated and tailored men's Sherwanis for style-focused shoppers. Designed using breathable Denim Cotton textile structure in a sharp Slim Fit silhouette. Perfect combination of daily fashion and premium quality.",
    "brand": "StyleAI Premium",
    "category": "Ethnic",
    "subCategory": "Sherwanis",
    "material": "Denim Cotton",
    "fit": "Slim Fit",
    "gender": "Men",
    "price": 2725,
    "originalPrice": 3814,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?sig=m_129&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Dark Brown"
    ],
    "inventory": 24,
    "occasionTags": [
      "Wedding",
      "Reception"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.4,
    "reviewsCount": 9
  },
  {
    "name": "Graceful Premium Green Sneakers 1",
    "description": "Expertly handcrafted and designed men/women's Sneakers. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Graceful",
    "category": "Footwear",
    "subCategory": "Sneakers",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Unisex",
    "price": 900,
    "originalPrice": 1350,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?sig=f_0&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Green"
    ],
    "inventory": 8,
    "occasionTags": [
      "Casual",
      "College",
      "Airport",
      "Travel"
    ],
    "featured": true,
    "aiRecommended": true,
    "ratings": 4.2,
    "reviewsCount": 0
  },
  {
    "name": "Urban Ethnic Premium Red Running Shoes 2",
    "description": "Expertly handcrafted and designed men/women's Running Shoes. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Urban Ethnic",
    "category": "Footwear",
    "subCategory": "Running Shoes",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Men",
    "price": 1015,
    "originalPrice": 1522,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?sig=f_1&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Red"
    ],
    "inventory": 9,
    "occasionTags": [
      "Gym",
      "Casual",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 1
  },
  {
    "name": "Zara Premium Blue Loafers 3",
    "description": "Expertly handcrafted and designed men/women's Loafers. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Zara",
    "category": "Footwear",
    "subCategory": "Loafers",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Men",
    "price": 1130,
    "originalPrice": 1695,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?sig=f_2&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Blue"
    ],
    "inventory": 10,
    "occasionTags": [
      "Casual",
      "Office",
      "Date Night"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.4,
    "reviewsCount": 2
  },
  {
    "name": "Nike Premium Navy Blue Boots 4",
    "description": "Expertly handcrafted and designed men/women's Boots. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Nike",
    "category": "Footwear",
    "subCategory": "Boots",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Unisex",
    "price": 1245,
    "originalPrice": 1867,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1531310197839-ccf54634509e?sig=f_3&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Navy Blue"
    ],
    "inventory": 11,
    "occasionTags": [
      "Casual",
      "Winter",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.5,
    "reviewsCount": 3
  },
  {
    "name": "Puma Premium Charcoal Grey Sandals 5",
    "description": "Expertly handcrafted and designed men/women's Sandals. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Puma",
    "category": "Footwear",
    "subCategory": "Sandals",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 1360,
    "originalPrice": 2040,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?sig=f_4&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Charcoal Grey"
    ],
    "inventory": 12,
    "occasionTags": [
      "Casual",
      "Summer",
      "Vacation"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.6,
    "reviewsCount": 4
  },
  {
    "name": "StyleAI Premium Premium Light Blue Heels 6",
    "description": "Expertly handcrafted and designed men/women's Heels. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "StyleAI Premium",
    "category": "Footwear",
    "subCategory": "Heels",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 1475,
    "originalPrice": 2212,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?sig=f_5&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Light Blue"
    ],
    "inventory": 13,
    "occasionTags": [
      "Party",
      "Wedding",
      "Reception"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 5
  },
  {
    "name": "Urban Denim Premium Beige Flats 7",
    "description": "Expertly handcrafted and designed men/women's Flats. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Urban Denim",
    "category": "Footwear",
    "subCategory": "Flats",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 1590,
    "originalPrice": 2385,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?sig=f_6&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Beige"
    ],
    "inventory": 14,
    "occasionTags": [
      "Casual",
      "Daily Wear",
      "Summer"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.8,
    "reviewsCount": 6
  },
  {
    "name": "Executive Wear Premium Burgundy Juttis 8",
    "description": "Expertly handcrafted and designed men/women's Juttis. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Executive Wear",
    "category": "Footwear",
    "subCategory": "Juttis",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 1705,
    "originalPrice": 2557,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?sig=f_7&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Burgundy"
    ],
    "inventory": 15,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 7
  },
  {
    "name": "StyleAI Streetwear Premium Yellow Kolhapuris 9",
    "description": "Expertly handcrafted and designed men/women's Kolhapuris. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "StyleAI Streetwear",
    "category": "Footwear",
    "subCategory": "Kolhapuris",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Unisex",
    "price": 1820,
    "originalPrice": 2730,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?sig=f_8&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Yellow"
    ],
    "inventory": 16,
    "occasionTags": [
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 0
  },
  {
    "name": "StyleAI Essentials Premium Peach Formal Shoes 10",
    "description": "Expertly handcrafted and designed men/women's Formal Shoes. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "StyleAI Essentials",
    "category": "Footwear",
    "subCategory": "Formal Shoes",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 1935,
    "originalPrice": 2902,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1531310197839-ccf54634509e?sig=f_9&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Peach"
    ],
    "inventory": 17,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": true,
    "aiRecommended": true,
    "ratings": 4.3,
    "reviewsCount": 1
  },
  {
    "name": "Royal Heritage Premium Orange Sneakers 11",
    "description": "Expertly handcrafted and designed men/women's Sneakers. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Royal Heritage",
    "category": "Footwear",
    "subCategory": "Sneakers",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Unisex",
    "price": 2050,
    "originalPrice": 3075,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?sig=f_10&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Orange"
    ],
    "inventory": 18,
    "occasionTags": [
      "Casual",
      "College",
      "Airport",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.4,
    "reviewsCount": 2
  },
  {
    "name": "Graceful Premium Maroon Running Shoes 12",
    "description": "Expertly handcrafted and designed men/women's Running Shoes. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Graceful",
    "category": "Footwear",
    "subCategory": "Running Shoes",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Men",
    "price": 2165,
    "originalPrice": 3247,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?sig=f_11&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Maroon"
    ],
    "inventory": 19,
    "occasionTags": [
      "Gym",
      "Casual",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 3
  },
  {
    "name": "Urban Ethnic Premium Khaki Loafers 13",
    "description": "Expertly handcrafted and designed men/women's Loafers. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Urban Ethnic",
    "category": "Footwear",
    "subCategory": "Loafers",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Men",
    "price": 2280,
    "originalPrice": 3420,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?sig=f_12&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Khaki"
    ],
    "inventory": 20,
    "occasionTags": [
      "Casual",
      "Office",
      "Date Night"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.6,
    "reviewsCount": 4
  },
  {
    "name": "Zara Premium Dark Brown Boots 14",
    "description": "Expertly handcrafted and designed men/women's Boots. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Zara",
    "category": "Footwear",
    "subCategory": "Boots",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Unisex",
    "price": 2395,
    "originalPrice": 3592,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1531310197839-ccf54634509e?sig=f_13&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Dark Brown"
    ],
    "inventory": 21,
    "occasionTags": [
      "Casual",
      "Winter",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 5
  },
  {
    "name": "Nike Premium Silver Sandals 15",
    "description": "Expertly handcrafted and designed men/women's Sandals. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Nike",
    "category": "Footwear",
    "subCategory": "Sandals",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 2510,
    "originalPrice": 3765,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?sig=f_14&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Silver"
    ],
    "inventory": 22,
    "occasionTags": [
      "Casual",
      "Summer",
      "Vacation"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.8,
    "reviewsCount": 6
  },
  {
    "name": "Puma Premium Pink Heels 16",
    "description": "Expertly handcrafted and designed men/women's Heels. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Puma",
    "category": "Footwear",
    "subCategory": "Heels",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 2625,
    "originalPrice": 3937,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?sig=f_15&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Pink"
    ],
    "inventory": 23,
    "occasionTags": [
      "Party",
      "Wedding",
      "Reception"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.9,
    "reviewsCount": 7
  },
  {
    "name": "StyleAI Premium Premium Gold Flats 17",
    "description": "Expertly handcrafted and designed men/women's Flats. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "StyleAI Premium",
    "category": "Footwear",
    "subCategory": "Flats",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 2740,
    "originalPrice": 4110,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?sig=f_16&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Gold"
    ],
    "inventory": 24,
    "occasionTags": [
      "Casual",
      "Daily Wear",
      "Summer"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 0
  },
  {
    "name": "Urban Denim Premium Black Juttis 18",
    "description": "Expertly handcrafted and designed men/women's Juttis. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Urban Denim",
    "category": "Footwear",
    "subCategory": "Juttis",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 2855,
    "originalPrice": 4282,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?sig=f_17&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Black"
    ],
    "inventory": 25,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 1
  },
  {
    "name": "Executive Wear Premium White Kolhapuris 19",
    "description": "Expertly handcrafted and designed men/women's Kolhapuris. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Executive Wear",
    "category": "Footwear",
    "subCategory": "Kolhapuris",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Unisex",
    "price": 2970,
    "originalPrice": 4455,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?sig=f_18&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "White"
    ],
    "inventory": 26,
    "occasionTags": [
      "Festive",
      "Traditional"
    ],
    "featured": true,
    "aiRecommended": true,
    "ratings": 4.4,
    "reviewsCount": 2
  },
  {
    "name": "StyleAI Streetwear Premium Green Formal Shoes 20",
    "description": "Expertly handcrafted and designed men/women's Formal Shoes. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "StyleAI Streetwear",
    "category": "Footwear",
    "subCategory": "Formal Shoes",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 3085,
    "originalPrice": 4627,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1531310197839-ccf54634509e?sig=f_19&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Green"
    ],
    "inventory": 27,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 3
  },
  {
    "name": "StyleAI Essentials Premium Red Sneakers 21",
    "description": "Expertly handcrafted and designed men/women's Sneakers. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "StyleAI Essentials",
    "category": "Footwear",
    "subCategory": "Sneakers",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Unisex",
    "price": 3200,
    "originalPrice": 4800,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?sig=f_20&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Red"
    ],
    "inventory": 28,
    "occasionTags": [
      "Casual",
      "College",
      "Airport",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.6,
    "reviewsCount": 4
  },
  {
    "name": "Royal Heritage Premium Blue Running Shoes 22",
    "description": "Expertly handcrafted and designed men/women's Running Shoes. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Royal Heritage",
    "category": "Footwear",
    "subCategory": "Running Shoes",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Men",
    "price": 3315,
    "originalPrice": 4972,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?sig=f_21&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Blue"
    ],
    "inventory": 29,
    "occasionTags": [
      "Gym",
      "Casual",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.7,
    "reviewsCount": 5
  },
  {
    "name": "Graceful Premium Navy Blue Loafers 23",
    "description": "Expertly handcrafted and designed men/women's Loafers. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Graceful",
    "category": "Footwear",
    "subCategory": "Loafers",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Men",
    "price": 3430,
    "originalPrice": 5145,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?sig=f_22&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Navy Blue"
    ],
    "inventory": 30,
    "occasionTags": [
      "Casual",
      "Office",
      "Date Night"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.8,
    "reviewsCount": 6
  },
  {
    "name": "Urban Ethnic Premium Charcoal Grey Boots 24",
    "description": "Expertly handcrafted and designed men/women's Boots. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Urban Ethnic",
    "category": "Footwear",
    "subCategory": "Boots",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Unisex",
    "price": 3545,
    "originalPrice": 5317,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1531310197839-ccf54634509e?sig=f_23&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Charcoal Grey"
    ],
    "inventory": 31,
    "occasionTags": [
      "Casual",
      "Winter",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 7
  },
  {
    "name": "Zara Premium Light Blue Sandals 25",
    "description": "Expertly handcrafted and designed men/women's Sandals. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Zara",
    "category": "Footwear",
    "subCategory": "Sandals",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 3660,
    "originalPrice": 5490,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?sig=f_24&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Light Blue"
    ],
    "inventory": 32,
    "occasionTags": [
      "Casual",
      "Summer",
      "Vacation"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.2,
    "reviewsCount": 0
  },
  {
    "name": "Nike Premium Beige Heels 26",
    "description": "Expertly handcrafted and designed men/women's Heels. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Nike",
    "category": "Footwear",
    "subCategory": "Heels",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 3775,
    "originalPrice": 5662,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?sig=f_25&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Beige"
    ],
    "inventory": 8,
    "occasionTags": [
      "Party",
      "Wedding",
      "Reception"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 1
  },
  {
    "name": "Puma Premium Burgundy Flats 27",
    "description": "Expertly handcrafted and designed men/women's Flats. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Puma",
    "category": "Footwear",
    "subCategory": "Flats",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 3890,
    "originalPrice": 5835,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?sig=f_26&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Burgundy"
    ],
    "inventory": 9,
    "occasionTags": [
      "Casual",
      "Daily Wear",
      "Summer"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.4,
    "reviewsCount": 2
  },
  {
    "name": "StyleAI Premium Premium Yellow Juttis 28",
    "description": "Expertly handcrafted and designed men/women's Juttis. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "StyleAI Premium",
    "category": "Footwear",
    "subCategory": "Juttis",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 4005,
    "originalPrice": 6007,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?sig=f_27&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Yellow"
    ],
    "inventory": 10,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Traditional"
    ],
    "featured": true,
    "aiRecommended": true,
    "ratings": 4.5,
    "reviewsCount": 3
  },
  {
    "name": "Urban Denim Premium Peach Kolhapuris 29",
    "description": "Expertly handcrafted and designed men/women's Kolhapuris. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Urban Denim",
    "category": "Footwear",
    "subCategory": "Kolhapuris",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Unisex",
    "price": 4120,
    "originalPrice": 6180,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?sig=f_28&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Peach"
    ],
    "inventory": 11,
    "occasionTags": [
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.6,
    "reviewsCount": 4
  },
  {
    "name": "Executive Wear Premium Orange Formal Shoes 30",
    "description": "Expertly handcrafted and designed men/women's Formal Shoes. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Executive Wear",
    "category": "Footwear",
    "subCategory": "Formal Shoes",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 4235,
    "originalPrice": 6352,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1531310197839-ccf54634509e?sig=f_29&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Orange"
    ],
    "inventory": 12,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 5
  },
  {
    "name": "StyleAI Streetwear Premium Maroon Sneakers 31",
    "description": "Expertly handcrafted and designed men/women's Sneakers. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "StyleAI Streetwear",
    "category": "Footwear",
    "subCategory": "Sneakers",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Unisex",
    "price": 4350,
    "originalPrice": 6525,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?sig=f_30&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Maroon"
    ],
    "inventory": 13,
    "occasionTags": [
      "Casual",
      "College",
      "Airport",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.8,
    "reviewsCount": 6
  },
  {
    "name": "StyleAI Essentials Premium Khaki Running Shoes 32",
    "description": "Expertly handcrafted and designed men/women's Running Shoes. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "StyleAI Essentials",
    "category": "Footwear",
    "subCategory": "Running Shoes",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Men",
    "price": 4465,
    "originalPrice": 6697,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?sig=f_31&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Khaki"
    ],
    "inventory": 14,
    "occasionTags": [
      "Gym",
      "Casual",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 7
  },
  {
    "name": "Royal Heritage Premium Dark Brown Loafers 33",
    "description": "Expertly handcrafted and designed men/women's Loafers. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Royal Heritage",
    "category": "Footwear",
    "subCategory": "Loafers",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Men",
    "price": 4580,
    "originalPrice": 6870,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?sig=f_32&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Dark Brown"
    ],
    "inventory": 15,
    "occasionTags": [
      "Casual",
      "Office",
      "Date Night"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 0
  },
  {
    "name": "Graceful Premium Silver Boots 34",
    "description": "Expertly handcrafted and designed men/women's Boots. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Graceful",
    "category": "Footwear",
    "subCategory": "Boots",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Unisex",
    "price": 4695,
    "originalPrice": 7042,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1531310197839-ccf54634509e?sig=f_33&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Silver"
    ],
    "inventory": 16,
    "occasionTags": [
      "Casual",
      "Winter",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.3,
    "reviewsCount": 1
  },
  {
    "name": "Urban Ethnic Premium Pink Sandals 35",
    "description": "Expertly handcrafted and designed men/women's Sandals. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Urban Ethnic",
    "category": "Footwear",
    "subCategory": "Sandals",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 4810,
    "originalPrice": 7215,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?sig=f_34&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Pink"
    ],
    "inventory": 17,
    "occasionTags": [
      "Casual",
      "Summer",
      "Vacation"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.4,
    "reviewsCount": 2
  },
  {
    "name": "Zara Premium Gold Heels 36",
    "description": "Expertly handcrafted and designed men/women's Heels. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Zara",
    "category": "Footwear",
    "subCategory": "Heels",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 4925,
    "originalPrice": 7387,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?sig=f_35&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Gold"
    ],
    "inventory": 18,
    "occasionTags": [
      "Party",
      "Wedding",
      "Reception"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 3
  },
  {
    "name": "Nike Premium Black Flats 37",
    "description": "Expertly handcrafted and designed men/women's Flats. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Nike",
    "category": "Footwear",
    "subCategory": "Flats",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 5040,
    "originalPrice": 7560,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?sig=f_36&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Black"
    ],
    "inventory": 19,
    "occasionTags": [
      "Casual",
      "Daily Wear",
      "Summer"
    ],
    "featured": true,
    "aiRecommended": true,
    "ratings": 4.6,
    "reviewsCount": 4
  },
  {
    "name": "Puma Premium White Juttis 38",
    "description": "Expertly handcrafted and designed men/women's Juttis. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Puma",
    "category": "Footwear",
    "subCategory": "Juttis",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 5155,
    "originalPrice": 7732,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?sig=f_37&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "White"
    ],
    "inventory": 20,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 5
  },
  {
    "name": "StyleAI Premium Premium Green Kolhapuris 39",
    "description": "Expertly handcrafted and designed men/women's Kolhapuris. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "StyleAI Premium",
    "category": "Footwear",
    "subCategory": "Kolhapuris",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Unisex",
    "price": 5270,
    "originalPrice": 7905,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?sig=f_38&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Green"
    ],
    "inventory": 21,
    "occasionTags": [
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.8,
    "reviewsCount": 6
  },
  {
    "name": "Urban Denim Premium Red Formal Shoes 40",
    "description": "Expertly handcrafted and designed men/women's Formal Shoes. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Urban Denim",
    "category": "Footwear",
    "subCategory": "Formal Shoes",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 5385,
    "originalPrice": 8077,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1531310197839-ccf54634509e?sig=f_39&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Red"
    ],
    "inventory": 22,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.9,
    "reviewsCount": 7
  },
  {
    "name": "Executive Wear Premium Blue Sneakers 41",
    "description": "Expertly handcrafted and designed men/women's Sneakers. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Executive Wear",
    "category": "Footwear",
    "subCategory": "Sneakers",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Unisex",
    "price": 5500,
    "originalPrice": 8250,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?sig=f_40&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Blue"
    ],
    "inventory": 23,
    "occasionTags": [
      "Casual",
      "College",
      "Airport",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 0
  },
  {
    "name": "StyleAI Streetwear Premium Navy Blue Running Shoes 42",
    "description": "Expertly handcrafted and designed men/women's Running Shoes. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "StyleAI Streetwear",
    "category": "Footwear",
    "subCategory": "Running Shoes",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Men",
    "price": 5615,
    "originalPrice": 8422,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?sig=f_41&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Navy Blue"
    ],
    "inventory": 24,
    "occasionTags": [
      "Gym",
      "Casual",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 1
  },
  {
    "name": "StyleAI Essentials Premium Charcoal Grey Loafers 43",
    "description": "Expertly handcrafted and designed men/women's Loafers. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "StyleAI Essentials",
    "category": "Footwear",
    "subCategory": "Loafers",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Men",
    "price": 5730,
    "originalPrice": 8595,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?sig=f_42&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Charcoal Grey"
    ],
    "inventory": 25,
    "occasionTags": [
      "Casual",
      "Office",
      "Date Night"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.4,
    "reviewsCount": 2
  },
  {
    "name": "Royal Heritage Premium Light Blue Boots 44",
    "description": "Expertly handcrafted and designed men/women's Boots. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Royal Heritage",
    "category": "Footwear",
    "subCategory": "Boots",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Unisex",
    "price": 5845,
    "originalPrice": 8767,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1531310197839-ccf54634509e?sig=f_43&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Light Blue"
    ],
    "inventory": 26,
    "occasionTags": [
      "Casual",
      "Winter",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 3
  },
  {
    "name": "Graceful Premium Beige Sandals 45",
    "description": "Expertly handcrafted and designed men/women's Sandals. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Graceful",
    "category": "Footwear",
    "subCategory": "Sandals",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 5960,
    "originalPrice": 8940,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?sig=f_44&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Beige"
    ],
    "inventory": 27,
    "occasionTags": [
      "Casual",
      "Summer",
      "Vacation"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.6,
    "reviewsCount": 4
  },
  {
    "name": "Urban Ethnic Premium Burgundy Heels 46",
    "description": "Expertly handcrafted and designed men/women's Heels. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Urban Ethnic",
    "category": "Footwear",
    "subCategory": "Heels",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 6075,
    "originalPrice": 9112,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?sig=f_45&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Burgundy"
    ],
    "inventory": 28,
    "occasionTags": [
      "Party",
      "Wedding",
      "Reception"
    ],
    "featured": true,
    "aiRecommended": true,
    "ratings": 4.7,
    "reviewsCount": 5
  },
  {
    "name": "Zara Premium Yellow Flats 47",
    "description": "Expertly handcrafted and designed men/women's Flats. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Zara",
    "category": "Footwear",
    "subCategory": "Flats",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 6190,
    "originalPrice": 9285,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?sig=f_46&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Yellow"
    ],
    "inventory": 29,
    "occasionTags": [
      "Casual",
      "Daily Wear",
      "Summer"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.8,
    "reviewsCount": 6
  },
  {
    "name": "Nike Premium Peach Juttis 48",
    "description": "Expertly handcrafted and designed men/women's Juttis. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Nike",
    "category": "Footwear",
    "subCategory": "Juttis",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 6305,
    "originalPrice": 9457,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?sig=f_47&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Peach"
    ],
    "inventory": 30,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 7
  },
  {
    "name": "Puma Premium Orange Kolhapuris 49",
    "description": "Expertly handcrafted and designed men/women's Kolhapuris. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Puma",
    "category": "Footwear",
    "subCategory": "Kolhapuris",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Unisex",
    "price": 6420,
    "originalPrice": 9630,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?sig=f_48&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Orange"
    ],
    "inventory": 31,
    "occasionTags": [
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.2,
    "reviewsCount": 0
  },
  {
    "name": "StyleAI Premium Premium Maroon Formal Shoes 50",
    "description": "Expertly handcrafted and designed men/women's Formal Shoes. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "StyleAI Premium",
    "category": "Footwear",
    "subCategory": "Formal Shoes",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 6535,
    "originalPrice": 9802,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1531310197839-ccf54634509e?sig=f_49&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Maroon"
    ],
    "inventory": 32,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 1
  },
  {
    "name": "Urban Denim Premium Khaki Sneakers 51",
    "description": "Expertly handcrafted and designed men/women's Sneakers. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Urban Denim",
    "category": "Footwear",
    "subCategory": "Sneakers",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Unisex",
    "price": 6650,
    "originalPrice": 9975,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?sig=f_50&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Khaki"
    ],
    "inventory": 8,
    "occasionTags": [
      "Casual",
      "College",
      "Airport",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.4,
    "reviewsCount": 2
  },
  {
    "name": "Executive Wear Premium Dark Brown Running Shoes 52",
    "description": "Expertly handcrafted and designed men/women's Running Shoes. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Executive Wear",
    "category": "Footwear",
    "subCategory": "Running Shoes",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Men",
    "price": 6765,
    "originalPrice": 10147,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?sig=f_51&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Dark Brown"
    ],
    "inventory": 9,
    "occasionTags": [
      "Gym",
      "Casual",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.5,
    "reviewsCount": 3
  },
  {
    "name": "StyleAI Streetwear Premium Silver Loafers 53",
    "description": "Expertly handcrafted and designed men/women's Loafers. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "StyleAI Streetwear",
    "category": "Footwear",
    "subCategory": "Loafers",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Men",
    "price": 6880,
    "originalPrice": 10320,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?sig=f_52&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Silver"
    ],
    "inventory": 10,
    "occasionTags": [
      "Casual",
      "Office",
      "Date Night"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.6,
    "reviewsCount": 4
  },
  {
    "name": "StyleAI Essentials Premium Pink Boots 54",
    "description": "Expertly handcrafted and designed men/women's Boots. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "StyleAI Essentials",
    "category": "Footwear",
    "subCategory": "Boots",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Unisex",
    "price": 6995,
    "originalPrice": 10492,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1531310197839-ccf54634509e?sig=f_53&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Pink"
    ],
    "inventory": 11,
    "occasionTags": [
      "Casual",
      "Winter",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 5
  },
  {
    "name": "Royal Heritage Premium Gold Sandals 55",
    "description": "Expertly handcrafted and designed men/women's Sandals. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Royal Heritage",
    "category": "Footwear",
    "subCategory": "Sandals",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 7110,
    "originalPrice": 10665,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?sig=f_54&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Gold"
    ],
    "inventory": 12,
    "occasionTags": [
      "Casual",
      "Summer",
      "Vacation"
    ],
    "featured": true,
    "aiRecommended": true,
    "ratings": 4.8,
    "reviewsCount": 6
  },
  {
    "name": "Graceful Premium Black Heels 56",
    "description": "Expertly handcrafted and designed men/women's Heels. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Graceful",
    "category": "Footwear",
    "subCategory": "Heels",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 7225,
    "originalPrice": 10837,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?sig=f_55&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Black"
    ],
    "inventory": 13,
    "occasionTags": [
      "Party",
      "Wedding",
      "Reception"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 7
  },
  {
    "name": "Urban Ethnic Premium White Flats 57",
    "description": "Expertly handcrafted and designed men/women's Flats. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Urban Ethnic",
    "category": "Footwear",
    "subCategory": "Flats",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 7340,
    "originalPrice": 11010,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?sig=f_56&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "White"
    ],
    "inventory": 14,
    "occasionTags": [
      "Casual",
      "Daily Wear",
      "Summer"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 0
  },
  {
    "name": "Zara Premium Green Juttis 58",
    "description": "Expertly handcrafted and designed men/women's Juttis. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Zara",
    "category": "Footwear",
    "subCategory": "Juttis",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 7455,
    "originalPrice": 11182,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?sig=f_57&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Green"
    ],
    "inventory": 15,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.3,
    "reviewsCount": 1
  },
  {
    "name": "Nike Premium Red Kolhapuris 59",
    "description": "Expertly handcrafted and designed men/women's Kolhapuris. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Nike",
    "category": "Footwear",
    "subCategory": "Kolhapuris",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Unisex",
    "price": 7570,
    "originalPrice": 11355,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?sig=f_58&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Red"
    ],
    "inventory": 16,
    "occasionTags": [
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.4,
    "reviewsCount": 2
  },
  {
    "name": "Puma Premium Blue Formal Shoes 60",
    "description": "Expertly handcrafted and designed men/women's Formal Shoes. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Puma",
    "category": "Footwear",
    "subCategory": "Formal Shoes",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 7685,
    "originalPrice": 11527,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1531310197839-ccf54634509e?sig=f_59&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Blue"
    ],
    "inventory": 17,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 3
  },
  {
    "name": "StyleAI Premium Premium Navy Blue Sneakers 61",
    "description": "Expertly handcrafted and designed men/women's Sneakers. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "StyleAI Premium",
    "category": "Footwear",
    "subCategory": "Sneakers",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Unisex",
    "price": 7800,
    "originalPrice": 11700,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?sig=f_60&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Navy Blue"
    ],
    "inventory": 18,
    "occasionTags": [
      "Casual",
      "College",
      "Airport",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.6,
    "reviewsCount": 4
  },
  {
    "name": "Urban Denim Premium Charcoal Grey Running Shoes 62",
    "description": "Expertly handcrafted and designed men/women's Running Shoes. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Urban Denim",
    "category": "Footwear",
    "subCategory": "Running Shoes",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Men",
    "price": 915,
    "originalPrice": 1372,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?sig=f_61&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Charcoal Grey"
    ],
    "inventory": 19,
    "occasionTags": [
      "Gym",
      "Casual",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 5
  },
  {
    "name": "Executive Wear Premium Light Blue Loafers 63",
    "description": "Expertly handcrafted and designed men/women's Loafers. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Executive Wear",
    "category": "Footwear",
    "subCategory": "Loafers",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Men",
    "price": 1030,
    "originalPrice": 1545,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?sig=f_62&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Light Blue"
    ],
    "inventory": 20,
    "occasionTags": [
      "Casual",
      "Office",
      "Date Night"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.8,
    "reviewsCount": 6
  },
  {
    "name": "StyleAI Streetwear Premium Beige Boots 64",
    "description": "Expertly handcrafted and designed men/women's Boots. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "StyleAI Streetwear",
    "category": "Footwear",
    "subCategory": "Boots",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Unisex",
    "price": 1145,
    "originalPrice": 1717,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1531310197839-ccf54634509e?sig=f_63&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Beige"
    ],
    "inventory": 21,
    "occasionTags": [
      "Casual",
      "Winter",
      "Travel"
    ],
    "featured": true,
    "aiRecommended": true,
    "ratings": 4.9,
    "reviewsCount": 7
  },
  {
    "name": "StyleAI Essentials Premium Burgundy Sandals 65",
    "description": "Expertly handcrafted and designed men/women's Sandals. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "StyleAI Essentials",
    "category": "Footwear",
    "subCategory": "Sandals",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 1260,
    "originalPrice": 1890,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?sig=f_64&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Burgundy"
    ],
    "inventory": 22,
    "occasionTags": [
      "Casual",
      "Summer",
      "Vacation"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 0
  },
  {
    "name": "Royal Heritage Premium Yellow Heels 66",
    "description": "Expertly handcrafted and designed men/women's Heels. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Royal Heritage",
    "category": "Footwear",
    "subCategory": "Heels",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 1375,
    "originalPrice": 2062,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?sig=f_65&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Yellow"
    ],
    "inventory": 23,
    "occasionTags": [
      "Party",
      "Wedding",
      "Reception"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 1
  },
  {
    "name": "Graceful Premium Peach Flats 67",
    "description": "Expertly handcrafted and designed men/women's Flats. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Graceful",
    "category": "Footwear",
    "subCategory": "Flats",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 1490,
    "originalPrice": 2235,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?sig=f_66&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Peach"
    ],
    "inventory": 24,
    "occasionTags": [
      "Casual",
      "Daily Wear",
      "Summer"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.4,
    "reviewsCount": 2
  },
  {
    "name": "Urban Ethnic Premium Orange Juttis 68",
    "description": "Expertly handcrafted and designed men/women's Juttis. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Urban Ethnic",
    "category": "Footwear",
    "subCategory": "Juttis",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 1605,
    "originalPrice": 2407,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?sig=f_67&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Orange"
    ],
    "inventory": 25,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 3
  },
  {
    "name": "Zara Premium Maroon Kolhapuris 69",
    "description": "Expertly handcrafted and designed men/women's Kolhapuris. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Zara",
    "category": "Footwear",
    "subCategory": "Kolhapuris",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Unisex",
    "price": 1720,
    "originalPrice": 2580,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?sig=f_68&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Maroon"
    ],
    "inventory": 26,
    "occasionTags": [
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.6,
    "reviewsCount": 4
  },
  {
    "name": "Nike Premium Khaki Formal Shoes 70",
    "description": "Expertly handcrafted and designed men/women's Formal Shoes. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Nike",
    "category": "Footwear",
    "subCategory": "Formal Shoes",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 1835,
    "originalPrice": 2752,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1531310197839-ccf54634509e?sig=f_69&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Khaki"
    ],
    "inventory": 27,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.7,
    "reviewsCount": 5
  },
  {
    "name": "Puma Premium Dark Brown Sneakers 71",
    "description": "Expertly handcrafted and designed men/women's Sneakers. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Puma",
    "category": "Footwear",
    "subCategory": "Sneakers",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Unisex",
    "price": 1950,
    "originalPrice": 2925,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?sig=f_70&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Dark Brown"
    ],
    "inventory": 28,
    "occasionTags": [
      "Casual",
      "College",
      "Airport",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.8,
    "reviewsCount": 6
  },
  {
    "name": "StyleAI Premium Premium Silver Running Shoes 72",
    "description": "Expertly handcrafted and designed men/women's Running Shoes. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "StyleAI Premium",
    "category": "Footwear",
    "subCategory": "Running Shoes",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Men",
    "price": 2065,
    "originalPrice": 3097,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?sig=f_71&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Silver"
    ],
    "inventory": 29,
    "occasionTags": [
      "Gym",
      "Casual",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 7
  },
  {
    "name": "Urban Denim Premium Pink Loafers 73",
    "description": "Expertly handcrafted and designed men/women's Loafers. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Urban Denim",
    "category": "Footwear",
    "subCategory": "Loafers",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Men",
    "price": 2180,
    "originalPrice": 3270,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?sig=f_72&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Pink"
    ],
    "inventory": 30,
    "occasionTags": [
      "Casual",
      "Office",
      "Date Night"
    ],
    "featured": true,
    "aiRecommended": true,
    "ratings": 4.2,
    "reviewsCount": 0
  },
  {
    "name": "Executive Wear Premium Gold Boots 74",
    "description": "Expertly handcrafted and designed men/women's Boots. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Executive Wear",
    "category": "Footwear",
    "subCategory": "Boots",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Unisex",
    "price": 2295,
    "originalPrice": 3442,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1531310197839-ccf54634509e?sig=f_73&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Gold"
    ],
    "inventory": 31,
    "occasionTags": [
      "Casual",
      "Winter",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 1
  },
  {
    "name": "StyleAI Streetwear Premium Black Sandals 75",
    "description": "Expertly handcrafted and designed men/women's Sandals. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "StyleAI Streetwear",
    "category": "Footwear",
    "subCategory": "Sandals",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 2410,
    "originalPrice": 3615,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?sig=f_74&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Black"
    ],
    "inventory": 32,
    "occasionTags": [
      "Casual",
      "Summer",
      "Vacation"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.4,
    "reviewsCount": 2
  },
  {
    "name": "StyleAI Essentials Premium White Heels 76",
    "description": "Expertly handcrafted and designed men/women's Heels. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "StyleAI Essentials",
    "category": "Footwear",
    "subCategory": "Heels",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 2525,
    "originalPrice": 3787,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?sig=f_75&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "White"
    ],
    "inventory": 8,
    "occasionTags": [
      "Party",
      "Wedding",
      "Reception"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.5,
    "reviewsCount": 3
  },
  {
    "name": "Royal Heritage Premium Green Flats 77",
    "description": "Expertly handcrafted and designed men/women's Flats. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Royal Heritage",
    "category": "Footwear",
    "subCategory": "Flats",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 2640,
    "originalPrice": 3960,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?sig=f_76&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Green"
    ],
    "inventory": 9,
    "occasionTags": [
      "Casual",
      "Daily Wear",
      "Summer"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.6,
    "reviewsCount": 4
  },
  {
    "name": "Graceful Premium Red Juttis 78",
    "description": "Expertly handcrafted and designed men/women's Juttis. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Graceful",
    "category": "Footwear",
    "subCategory": "Juttis",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 2755,
    "originalPrice": 4132,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?sig=f_77&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Red"
    ],
    "inventory": 10,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 5
  },
  {
    "name": "Urban Ethnic Premium Blue Kolhapuris 79",
    "description": "Expertly handcrafted and designed men/women's Kolhapuris. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Urban Ethnic",
    "category": "Footwear",
    "subCategory": "Kolhapuris",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Unisex",
    "price": 2870,
    "originalPrice": 4305,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?sig=f_78&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Blue"
    ],
    "inventory": 11,
    "occasionTags": [
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.8,
    "reviewsCount": 6
  },
  {
    "name": "Zara Premium Navy Blue Formal Shoes 80",
    "description": "Expertly handcrafted and designed men/women's Formal Shoes. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Zara",
    "category": "Footwear",
    "subCategory": "Formal Shoes",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 2985,
    "originalPrice": 4477,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1531310197839-ccf54634509e?sig=f_79&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Navy Blue"
    ],
    "inventory": 12,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 7
  },
  {
    "name": "Nike Premium Charcoal Grey Sneakers 81",
    "description": "Expertly handcrafted and designed men/women's Sneakers. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Nike",
    "category": "Footwear",
    "subCategory": "Sneakers",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Unisex",
    "price": 3100,
    "originalPrice": 4650,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?sig=f_80&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Charcoal Grey"
    ],
    "inventory": 13,
    "occasionTags": [
      "Casual",
      "College",
      "Airport",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 0
  },
  {
    "name": "Puma Premium Light Blue Running Shoes 82",
    "description": "Expertly handcrafted and designed men/women's Running Shoes. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Puma",
    "category": "Footwear",
    "subCategory": "Running Shoes",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Men",
    "price": 3215,
    "originalPrice": 4822,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?sig=f_81&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Light Blue"
    ],
    "inventory": 14,
    "occasionTags": [
      "Gym",
      "Casual",
      "Daily Wear"
    ],
    "featured": true,
    "aiRecommended": true,
    "ratings": 4.3,
    "reviewsCount": 1
  },
  {
    "name": "StyleAI Premium Premium Beige Loafers 83",
    "description": "Expertly handcrafted and designed men/women's Loafers. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "StyleAI Premium",
    "category": "Footwear",
    "subCategory": "Loafers",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Men",
    "price": 3330,
    "originalPrice": 4995,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?sig=f_82&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Beige"
    ],
    "inventory": 15,
    "occasionTags": [
      "Casual",
      "Office",
      "Date Night"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.4,
    "reviewsCount": 2
  },
  {
    "name": "Urban Denim Premium Burgundy Boots 84",
    "description": "Expertly handcrafted and designed men/women's Boots. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Urban Denim",
    "category": "Footwear",
    "subCategory": "Boots",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Unisex",
    "price": 3445,
    "originalPrice": 5167,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1531310197839-ccf54634509e?sig=f_83&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Burgundy"
    ],
    "inventory": 16,
    "occasionTags": [
      "Casual",
      "Winter",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 3
  },
  {
    "name": "Executive Wear Premium Yellow Sandals 85",
    "description": "Expertly handcrafted and designed men/women's Sandals. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Executive Wear",
    "category": "Footwear",
    "subCategory": "Sandals",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 3560,
    "originalPrice": 5340,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?sig=f_84&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Yellow"
    ],
    "inventory": 17,
    "occasionTags": [
      "Casual",
      "Summer",
      "Vacation"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.6,
    "reviewsCount": 4
  },
  {
    "name": "StyleAI Streetwear Premium Peach Heels 86",
    "description": "Expertly handcrafted and designed men/women's Heels. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "StyleAI Streetwear",
    "category": "Footwear",
    "subCategory": "Heels",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 3675,
    "originalPrice": 5512,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?sig=f_85&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Peach"
    ],
    "inventory": 18,
    "occasionTags": [
      "Party",
      "Wedding",
      "Reception"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 5
  },
  {
    "name": "StyleAI Essentials Premium Orange Flats 87",
    "description": "Expertly handcrafted and designed men/women's Flats. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "StyleAI Essentials",
    "category": "Footwear",
    "subCategory": "Flats",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 3790,
    "originalPrice": 5685,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?sig=f_86&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Orange"
    ],
    "inventory": 19,
    "occasionTags": [
      "Casual",
      "Daily Wear",
      "Summer"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.8,
    "reviewsCount": 6
  },
  {
    "name": "Royal Heritage Premium Maroon Juttis 88",
    "description": "Expertly handcrafted and designed men/women's Juttis. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Royal Heritage",
    "category": "Footwear",
    "subCategory": "Juttis",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 3905,
    "originalPrice": 5857,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?sig=f_87&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Maroon"
    ],
    "inventory": 20,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.9,
    "reviewsCount": 7
  },
  {
    "name": "Graceful Premium Khaki Kolhapuris 89",
    "description": "Expertly handcrafted and designed men/women's Kolhapuris. Structured using rich Genuine Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Graceful",
    "category": "Footwear",
    "subCategory": "Kolhapuris",
    "material": "Genuine Leather",
    "fit": "Regular",
    "gender": "Unisex",
    "price": 4020,
    "originalPrice": 6030,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?sig=f_88&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "7",
      "8",
      "9",
      "10",
      "11"
    ],
    "colors": [
      "Khaki"
    ],
    "inventory": 21,
    "occasionTags": [
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 0
  },
  {
    "name": "Urban Ethnic Premium Dark Brown Formal Shoes 90",
    "description": "Expertly handcrafted and designed men/women's Formal Shoes. Structured using rich Synthetic Leather linings and durable outsoles for unparalleled walking comfort and style flexibility.",
    "brand": "Urban Ethnic",
    "category": "Footwear",
    "subCategory": "Formal Shoes",
    "material": "Synthetic Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 4135,
    "originalPrice": 6202,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1531310197839-ccf54634509e?sig=f_89&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "36",
      "37",
      "38",
      "39",
      "40"
    ],
    "colors": [
      "Dark Brown"
    ],
    "inventory": 22,
    "occasionTags": [
      "Office",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 1
  },
  {
    "name": "Executive Wear Elegant Red Watches 1",
    "description": "A beautifully detailed Watches featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "Executive Wear",
    "category": "Accessories",
    "subCategory": "Watches",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Unisex",
    "price": 400,
    "originalPrice": 560,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?sig=a_0&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Red"
    ],
    "inventory": 20,
    "occasionTags": [
      "Office",
      "Formal",
      "Daily Wear"
    ],
    "featured": true,
    "aiRecommended": true,
    "ratings": 4,
    "reviewsCount": 0
  },
  {
    "name": "StyleAI Streetwear Elegant Blue Handbags 2",
    "description": "A beautifully detailed Handbags featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "StyleAI Streetwear",
    "category": "Accessories",
    "subCategory": "Handbags",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Women",
    "price": 490,
    "originalPrice": 686,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?sig=a_1&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Blue"
    ],
    "inventory": 21,
    "occasionTags": [
      "Casual",
      "Office",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 1
  },
  {
    "name": "StyleAI Essentials Elegant Navy Blue Tote Bags 3",
    "description": "A beautifully detailed Tote Bags featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "StyleAI Essentials",
    "category": "Accessories",
    "subCategory": "Tote Bags",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Women",
    "price": 580,
    "originalPrice": 812,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?sig=a_2&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Navy Blue"
    ],
    "inventory": 22,
    "occasionTags": [
      "Casual",
      "Vacation",
      "College"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 2
  },
  {
    "name": "Royal Heritage Elegant Charcoal Grey Sling Bags 4",
    "description": "A beautifully detailed Sling Bags featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "Royal Heritage",
    "category": "Accessories",
    "subCategory": "Sling Bags",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Women",
    "price": 670,
    "originalPrice": 937,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?sig=a_3&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Charcoal Grey"
    ],
    "inventory": 23,
    "occasionTags": [
      "Casual",
      "Party",
      "Date Night"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 3
  },
  {
    "name": "Graceful Elegant Light Blue Clutches 5",
    "description": "A beautifully detailed Clutches featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "Graceful",
    "category": "Accessories",
    "subCategory": "Clutches",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Women",
    "price": 760,
    "originalPrice": 1064,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?sig=a_4&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Light Blue"
    ],
    "inventory": 24,
    "occasionTags": [
      "Wedding",
      "Reception",
      "Party"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.4,
    "reviewsCount": 4
  },
  {
    "name": "Urban Ethnic Elegant Beige Wallets 6",
    "description": "A beautifully detailed Wallets featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "Urban Ethnic",
    "category": "Accessories",
    "subCategory": "Wallets",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Men",
    "price": 850,
    "originalPrice": 1190,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?sig=a_5&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Beige"
    ],
    "inventory": 25,
    "occasionTags": [
      "Casual",
      "Office",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 5
  },
  {
    "name": "Zara Elegant Burgundy Sunglasses 7",
    "description": "A beautifully detailed Sunglasses featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "Zara",
    "category": "Accessories",
    "subCategory": "Sunglasses",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Unisex",
    "price": 940,
    "originalPrice": 1316,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?sig=a_6&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Burgundy"
    ],
    "inventory": 26,
    "occasionTags": [
      "Casual",
      "Vacation",
      "Airport"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.6,
    "reviewsCount": 0
  },
  {
    "name": "Nike Elegant Yellow Belts 8",
    "description": "A beautifully detailed Belts featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "Nike",
    "category": "Accessories",
    "subCategory": "Belts",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Men",
    "price": 1030,
    "originalPrice": 1442,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?sig=a_7&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Yellow"
    ],
    "inventory": 27,
    "occasionTags": [
      "Office",
      "Formal",
      "Casual"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 1
  },
  {
    "name": "Puma Elegant Peach Necklaces 9",
    "description": "A beautifully detailed Necklaces featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "Puma",
    "category": "Accessories",
    "subCategory": "Necklaces",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Women",
    "price": 1120,
    "originalPrice": 1568,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?sig=a_8&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Peach"
    ],
    "inventory": 28,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.8,
    "reviewsCount": 2
  },
  {
    "name": "StyleAI Premium Elegant Orange Earrings 10",
    "description": "A beautifully detailed Earrings featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "StyleAI Premium",
    "category": "Accessories",
    "subCategory": "Earrings",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Women",
    "price": 1210,
    "originalPrice": 1694,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?sig=a_9&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Orange"
    ],
    "inventory": 29,
    "occasionTags": [
      "Party",
      "Festive",
      "Date Night"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 3
  },
  {
    "name": "Urban Denim Elegant Maroon Bracelets 11",
    "description": "A beautifully detailed Bracelets featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "Urban Denim",
    "category": "Accessories",
    "subCategory": "Bracelets",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Unisex",
    "price": 1300,
    "originalPrice": 1819,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?sig=a_10&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Maroon"
    ],
    "inventory": 30,
    "occasionTags": [
      "Casual",
      "College"
    ],
    "featured": true,
    "aiRecommended": false,
    "ratings": 4,
    "reviewsCount": 4
  },
  {
    "name": "Executive Wear Elegant Khaki Rings 12",
    "description": "A beautifully detailed Rings featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "Executive Wear",
    "category": "Accessories",
    "subCategory": "Rings",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Unisex",
    "price": 1390,
    "originalPrice": 1945,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?sig=a_11&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Khaki"
    ],
    "inventory": 31,
    "occasionTags": [
      "Wedding",
      "Engagement",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 5
  },
  {
    "name": "StyleAI Streetwear Elegant Dark Brown Watches 13",
    "description": "A beautifully detailed Watches featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "StyleAI Streetwear",
    "category": "Accessories",
    "subCategory": "Watches",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Unisex",
    "price": 1480,
    "originalPrice": 2072,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?sig=a_12&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Dark Brown"
    ],
    "inventory": 32,
    "occasionTags": [
      "Office",
      "Formal",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.2,
    "reviewsCount": 0
  },
  {
    "name": "StyleAI Essentials Elegant Silver Handbags 14",
    "description": "A beautifully detailed Handbags featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "StyleAI Essentials",
    "category": "Accessories",
    "subCategory": "Handbags",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Women",
    "price": 1570,
    "originalPrice": 2198,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?sig=a_13&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Silver"
    ],
    "inventory": 33,
    "occasionTags": [
      "Casual",
      "Office",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 1
  },
  {
    "name": "Royal Heritage Elegant Pink Tote Bags 15",
    "description": "A beautifully detailed Tote Bags featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "Royal Heritage",
    "category": "Accessories",
    "subCategory": "Tote Bags",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Women",
    "price": 1660,
    "originalPrice": 2324,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?sig=a_14&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Pink"
    ],
    "inventory": 34,
    "occasionTags": [
      "Casual",
      "Vacation",
      "College"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.4,
    "reviewsCount": 2
  },
  {
    "name": "Graceful Elegant Gold Sling Bags 16",
    "description": "A beautifully detailed Sling Bags featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "Graceful",
    "category": "Accessories",
    "subCategory": "Sling Bags",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Women",
    "price": 1750,
    "originalPrice": 2450,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?sig=a_15&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Gold"
    ],
    "inventory": 35,
    "occasionTags": [
      "Casual",
      "Party",
      "Date Night"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 3
  },
  {
    "name": "Urban Ethnic Elegant Black Clutches 17",
    "description": "A beautifully detailed Clutches featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "Urban Ethnic",
    "category": "Accessories",
    "subCategory": "Clutches",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Women",
    "price": 1840,
    "originalPrice": 2576,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?sig=a_16&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Black"
    ],
    "inventory": 36,
    "occasionTags": [
      "Wedding",
      "Reception",
      "Party"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.6,
    "reviewsCount": 4
  },
  {
    "name": "Zara Elegant White Wallets 18",
    "description": "A beautifully detailed Wallets featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "Zara",
    "category": "Accessories",
    "subCategory": "Wallets",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Men",
    "price": 1930,
    "originalPrice": 2702,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?sig=a_17&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "White"
    ],
    "inventory": 37,
    "occasionTags": [
      "Casual",
      "Office",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 5
  },
  {
    "name": "Nike Elegant Green Sunglasses 19",
    "description": "A beautifully detailed Sunglasses featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "Nike",
    "category": "Accessories",
    "subCategory": "Sunglasses",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Unisex",
    "price": 2020,
    "originalPrice": 2828,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?sig=a_18&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Green"
    ],
    "inventory": 38,
    "occasionTags": [
      "Casual",
      "Vacation",
      "Airport"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.8,
    "reviewsCount": 0
  },
  {
    "name": "Puma Elegant Red Belts 20",
    "description": "A beautifully detailed Belts featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "Puma",
    "category": "Accessories",
    "subCategory": "Belts",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Men",
    "price": 2110,
    "originalPrice": 2954,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?sig=a_19&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Red"
    ],
    "inventory": 39,
    "occasionTags": [
      "Office",
      "Formal",
      "Casual"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 1
  },
  {
    "name": "StyleAI Premium Elegant Blue Necklaces 21",
    "description": "A beautifully detailed Necklaces featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "StyleAI Premium",
    "category": "Accessories",
    "subCategory": "Necklaces",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Women",
    "price": 2200,
    "originalPrice": 3080,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?sig=a_20&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Blue"
    ],
    "inventory": 40,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Traditional"
    ],
    "featured": true,
    "aiRecommended": true,
    "ratings": 4,
    "reviewsCount": 2
  },
  {
    "name": "Urban Denim Elegant Navy Blue Earrings 22",
    "description": "A beautifully detailed Earrings featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "Urban Denim",
    "category": "Accessories",
    "subCategory": "Earrings",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Women",
    "price": 2290,
    "originalPrice": 3206,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?sig=a_21&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Navy Blue"
    ],
    "inventory": 41,
    "occasionTags": [
      "Party",
      "Festive",
      "Date Night"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 3
  },
  {
    "name": "Executive Wear Elegant Charcoal Grey Bracelets 23",
    "description": "A beautifully detailed Bracelets featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "Executive Wear",
    "category": "Accessories",
    "subCategory": "Bracelets",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Unisex",
    "price": 2380,
    "originalPrice": 3332,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1635767798638-3e25273a8236?sig=a_22&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Charcoal Grey"
    ],
    "inventory": 42,
    "occasionTags": [
      "Casual",
      "College"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 4
  },
  {
    "name": "StyleAI Streetwear Elegant Light Blue Rings 24",
    "description": "A beautifully detailed Rings featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "StyleAI Streetwear",
    "category": "Accessories",
    "subCategory": "Rings",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Unisex",
    "price": 2470,
    "originalPrice": 3458,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?sig=a_23&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Light Blue"
    ],
    "inventory": 43,
    "occasionTags": [
      "Wedding",
      "Engagement",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 5
  },
  {
    "name": "StyleAI Essentials Elegant Beige Watches 25",
    "description": "A beautifully detailed Watches featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "StyleAI Essentials",
    "category": "Accessories",
    "subCategory": "Watches",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Unisex",
    "price": 2560,
    "originalPrice": 3584,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?sig=a_24&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Beige"
    ],
    "inventory": 44,
    "occasionTags": [
      "Office",
      "Formal",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.4,
    "reviewsCount": 0
  },
  {
    "name": "Royal Heritage Elegant Burgundy Handbags 26",
    "description": "A beautifully detailed Handbags featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "Royal Heritage",
    "category": "Accessories",
    "subCategory": "Handbags",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Women",
    "price": 2650,
    "originalPrice": 3709,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?sig=a_25&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Burgundy"
    ],
    "inventory": 45,
    "occasionTags": [
      "Casual",
      "Office",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 1
  },
  {
    "name": "Graceful Elegant Yellow Tote Bags 27",
    "description": "A beautifully detailed Tote Bags featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "Graceful",
    "category": "Accessories",
    "subCategory": "Tote Bags",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Women",
    "price": 2740,
    "originalPrice": 3835,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?sig=a_26&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Yellow"
    ],
    "inventory": 46,
    "occasionTags": [
      "Casual",
      "Vacation",
      "College"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.6,
    "reviewsCount": 2
  },
  {
    "name": "Urban Ethnic Elegant Peach Sling Bags 28",
    "description": "A beautifully detailed Sling Bags featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "Urban Ethnic",
    "category": "Accessories",
    "subCategory": "Sling Bags",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Women",
    "price": 2830,
    "originalPrice": 3961,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?sig=a_27&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Peach"
    ],
    "inventory": 47,
    "occasionTags": [
      "Casual",
      "Party",
      "Date Night"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 3
  },
  {
    "name": "Zara Elegant Orange Clutches 29",
    "description": "A beautifully detailed Clutches featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "Zara",
    "category": "Accessories",
    "subCategory": "Clutches",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Women",
    "price": 2920,
    "originalPrice": 4087,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?sig=a_28&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Orange"
    ],
    "inventory": 48,
    "occasionTags": [
      "Wedding",
      "Reception",
      "Party"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.8,
    "reviewsCount": 4
  },
  {
    "name": "Nike Elegant Maroon Wallets 30",
    "description": "A beautifully detailed Wallets featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "Nike",
    "category": "Accessories",
    "subCategory": "Wallets",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Men",
    "price": 3010,
    "originalPrice": 4214,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?sig=a_29&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Maroon"
    ],
    "inventory": 49,
    "occasionTags": [
      "Casual",
      "Office",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 5
  },
  {
    "name": "Puma Elegant Khaki Sunglasses 31",
    "description": "A beautifully detailed Sunglasses featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "Puma",
    "category": "Accessories",
    "subCategory": "Sunglasses",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Unisex",
    "price": 3100,
    "originalPrice": 4340,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?sig=a_30&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Khaki"
    ],
    "inventory": 50,
    "occasionTags": [
      "Casual",
      "Vacation",
      "Airport"
    ],
    "featured": true,
    "aiRecommended": false,
    "ratings": 4,
    "reviewsCount": 0
  },
  {
    "name": "StyleAI Premium Elegant Dark Brown Belts 32",
    "description": "A beautifully detailed Belts featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "StyleAI Premium",
    "category": "Accessories",
    "subCategory": "Belts",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Men",
    "price": 3190,
    "originalPrice": 4466,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?sig=a_31&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Dark Brown"
    ],
    "inventory": 51,
    "occasionTags": [
      "Office",
      "Formal",
      "Casual"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 1
  },
  {
    "name": "Urban Denim Elegant Silver Necklaces 33",
    "description": "A beautifully detailed Necklaces featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "Urban Denim",
    "category": "Accessories",
    "subCategory": "Necklaces",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Women",
    "price": 3280,
    "originalPrice": 4592,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1635767798638-3e25273a8236?sig=a_32&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Silver"
    ],
    "inventory": 52,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.2,
    "reviewsCount": 2
  },
  {
    "name": "Executive Wear Elegant Pink Earrings 34",
    "description": "A beautifully detailed Earrings featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "Executive Wear",
    "category": "Accessories",
    "subCategory": "Earrings",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Women",
    "price": 3370,
    "originalPrice": 4718,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?sig=a_33&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Pink"
    ],
    "inventory": 53,
    "occasionTags": [
      "Party",
      "Festive",
      "Date Night"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 3
  },
  {
    "name": "StyleAI Streetwear Elegant Gold Bracelets 35",
    "description": "A beautifully detailed Bracelets featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "StyleAI Streetwear",
    "category": "Accessories",
    "subCategory": "Bracelets",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Unisex",
    "price": 3460,
    "originalPrice": 4844,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?sig=a_34&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Gold"
    ],
    "inventory": 54,
    "occasionTags": [
      "Casual",
      "College"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.4,
    "reviewsCount": 4
  },
  {
    "name": "StyleAI Essentials Elegant Black Rings 36",
    "description": "A beautifully detailed Rings featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "StyleAI Essentials",
    "category": "Accessories",
    "subCategory": "Rings",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Unisex",
    "price": 3550,
    "originalPrice": 4970,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?sig=a_35&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Black"
    ],
    "inventory": 55,
    "occasionTags": [
      "Wedding",
      "Engagement",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 5
  },
  {
    "name": "Royal Heritage Elegant White Watches 37",
    "description": "A beautifully detailed Watches featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "Royal Heritage",
    "category": "Accessories",
    "subCategory": "Watches",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Unisex",
    "price": 3640,
    "originalPrice": 5096,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?sig=a_36&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "White"
    ],
    "inventory": 56,
    "occasionTags": [
      "Office",
      "Formal",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.6,
    "reviewsCount": 0
  },
  {
    "name": "Graceful Elegant Green Handbags 38",
    "description": "A beautifully detailed Handbags featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "Graceful",
    "category": "Accessories",
    "subCategory": "Handbags",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Women",
    "price": 3730,
    "originalPrice": 5222,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?sig=a_37&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Green"
    ],
    "inventory": 57,
    "occasionTags": [
      "Casual",
      "Office",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 1
  },
  {
    "name": "Urban Ethnic Elegant Red Tote Bags 39",
    "description": "A beautifully detailed Tote Bags featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "Urban Ethnic",
    "category": "Accessories",
    "subCategory": "Tote Bags",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Women",
    "price": 3820,
    "originalPrice": 5348,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?sig=a_38&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Red"
    ],
    "inventory": 58,
    "occasionTags": [
      "Casual",
      "Vacation",
      "College"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.8,
    "reviewsCount": 2
  },
  {
    "name": "Zara Elegant Blue Sling Bags 40",
    "description": "A beautifully detailed Sling Bags featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "Zara",
    "category": "Accessories",
    "subCategory": "Sling Bags",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Women",
    "price": 3910,
    "originalPrice": 5474,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?sig=a_39&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Blue"
    ],
    "inventory": 59,
    "occasionTags": [
      "Casual",
      "Party",
      "Date Night"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 3
  },
  {
    "name": "Nike Elegant Navy Blue Clutches 41",
    "description": "A beautifully detailed Clutches featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "Nike",
    "category": "Accessories",
    "subCategory": "Clutches",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Women",
    "price": 4000,
    "originalPrice": 5600,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?sig=a_40&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Navy Blue"
    ],
    "inventory": 60,
    "occasionTags": [
      "Wedding",
      "Reception",
      "Party"
    ],
    "featured": true,
    "aiRecommended": true,
    "ratings": 4,
    "reviewsCount": 4
  },
  {
    "name": "Puma Elegant Charcoal Grey Wallets 42",
    "description": "A beautifully detailed Wallets featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "Puma",
    "category": "Accessories",
    "subCategory": "Wallets",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Men",
    "price": 4090,
    "originalPrice": 5726,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?sig=a_41&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Charcoal Grey"
    ],
    "inventory": 61,
    "occasionTags": [
      "Casual",
      "Office",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 5
  },
  {
    "name": "StyleAI Premium Elegant Light Blue Sunglasses 43",
    "description": "A beautifully detailed Sunglasses featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "StyleAI Premium",
    "category": "Accessories",
    "subCategory": "Sunglasses",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Unisex",
    "price": 4180,
    "originalPrice": 5852,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?sig=a_42&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Light Blue"
    ],
    "inventory": 62,
    "occasionTags": [
      "Casual",
      "Vacation",
      "Airport"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 0
  },
  {
    "name": "Urban Denim Elegant Beige Belts 44",
    "description": "A beautifully detailed Belts featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "Urban Denim",
    "category": "Accessories",
    "subCategory": "Belts",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Men",
    "price": 4270,
    "originalPrice": 5978,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?sig=a_43&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Beige"
    ],
    "inventory": 63,
    "occasionTags": [
      "Office",
      "Formal",
      "Casual"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 1
  },
  {
    "name": "Executive Wear Elegant Burgundy Necklaces 45",
    "description": "A beautifully detailed Necklaces featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "Executive Wear",
    "category": "Accessories",
    "subCategory": "Necklaces",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Women",
    "price": 4360,
    "originalPrice": 6104,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?sig=a_44&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Burgundy"
    ],
    "inventory": 64,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.4,
    "reviewsCount": 2
  },
  {
    "name": "StyleAI Streetwear Elegant Yellow Earrings 46",
    "description": "A beautifully detailed Earrings featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "StyleAI Streetwear",
    "category": "Accessories",
    "subCategory": "Earrings",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Women",
    "price": 4450,
    "originalPrice": 6230,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?sig=a_45&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Yellow"
    ],
    "inventory": 65,
    "occasionTags": [
      "Party",
      "Festive",
      "Date Night"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 3
  },
  {
    "name": "StyleAI Essentials Elegant Peach Bracelets 47",
    "description": "A beautifully detailed Bracelets featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "StyleAI Essentials",
    "category": "Accessories",
    "subCategory": "Bracelets",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Unisex",
    "price": 4540,
    "originalPrice": 6356,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?sig=a_46&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Peach"
    ],
    "inventory": 66,
    "occasionTags": [
      "Casual",
      "College"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.6,
    "reviewsCount": 4
  },
  {
    "name": "Royal Heritage Elegant Orange Rings 48",
    "description": "A beautifully detailed Rings featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "Royal Heritage",
    "category": "Accessories",
    "subCategory": "Rings",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Unisex",
    "price": 4630,
    "originalPrice": 6482,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1635767798638-3e25273a8236?sig=a_47&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Orange"
    ],
    "inventory": 67,
    "occasionTags": [
      "Wedding",
      "Engagement",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 5
  },
  {
    "name": "Graceful Elegant Maroon Watches 49",
    "description": "A beautifully detailed Watches featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "Graceful",
    "category": "Accessories",
    "subCategory": "Watches",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Unisex",
    "price": 4720,
    "originalPrice": 6608,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?sig=a_48&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Maroon"
    ],
    "inventory": 68,
    "occasionTags": [
      "Office",
      "Formal",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.8,
    "reviewsCount": 0
  },
  {
    "name": "Urban Ethnic Elegant Khaki Handbags 50",
    "description": "A beautifully detailed Handbags featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "Urban Ethnic",
    "category": "Accessories",
    "subCategory": "Handbags",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Women",
    "price": 4810,
    "originalPrice": 6734,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?sig=a_49&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Khaki"
    ],
    "inventory": 69,
    "occasionTags": [
      "Casual",
      "Office",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 1
  },
  {
    "name": "Zara Elegant Dark Brown Tote Bags 51",
    "description": "A beautifully detailed Tote Bags featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "Zara",
    "category": "Accessories",
    "subCategory": "Tote Bags",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Women",
    "price": 4900,
    "originalPrice": 6860,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?sig=a_50&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Dark Brown"
    ],
    "inventory": 20,
    "occasionTags": [
      "Casual",
      "Vacation",
      "College"
    ],
    "featured": true,
    "aiRecommended": false,
    "ratings": 4,
    "reviewsCount": 2
  },
  {
    "name": "Nike Elegant Silver Sling Bags 52",
    "description": "A beautifully detailed Sling Bags featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "Nike",
    "category": "Accessories",
    "subCategory": "Sling Bags",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Women",
    "price": 4990,
    "originalPrice": 6986,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?sig=a_51&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Silver"
    ],
    "inventory": 21,
    "occasionTags": [
      "Casual",
      "Party",
      "Date Night"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 3
  },
  {
    "name": "Puma Elegant Pink Clutches 53",
    "description": "A beautifully detailed Clutches featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "Puma",
    "category": "Accessories",
    "subCategory": "Clutches",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Women",
    "price": 5080,
    "originalPrice": 7112,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?sig=a_52&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Pink"
    ],
    "inventory": 22,
    "occasionTags": [
      "Wedding",
      "Reception",
      "Party"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.2,
    "reviewsCount": 4
  },
  {
    "name": "StyleAI Premium Elegant Gold Wallets 54",
    "description": "A beautifully detailed Wallets featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "StyleAI Premium",
    "category": "Accessories",
    "subCategory": "Wallets",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Men",
    "price": 5170,
    "originalPrice": 7237,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?sig=a_53&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Gold"
    ],
    "inventory": 23,
    "occasionTags": [
      "Casual",
      "Office",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 5
  },
  {
    "name": "Urban Denim Elegant Black Sunglasses 55",
    "description": "A beautifully detailed Sunglasses featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "Urban Denim",
    "category": "Accessories",
    "subCategory": "Sunglasses",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Unisex",
    "price": 5260,
    "originalPrice": 7363,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?sig=a_54&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Black"
    ],
    "inventory": 24,
    "occasionTags": [
      "Casual",
      "Vacation",
      "Airport"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.4,
    "reviewsCount": 0
  },
  {
    "name": "Executive Wear Elegant White Belts 56",
    "description": "A beautifully detailed Belts featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "Executive Wear",
    "category": "Accessories",
    "subCategory": "Belts",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Men",
    "price": 5350,
    "originalPrice": 7489,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?sig=a_55&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "White"
    ],
    "inventory": 25,
    "occasionTags": [
      "Office",
      "Formal",
      "Casual"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 1
  },
  {
    "name": "StyleAI Streetwear Elegant Green Necklaces 57",
    "description": "A beautifully detailed Necklaces featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "StyleAI Streetwear",
    "category": "Accessories",
    "subCategory": "Necklaces",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Women",
    "price": 5440,
    "originalPrice": 7615,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?sig=a_56&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Green"
    ],
    "inventory": 26,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.6,
    "reviewsCount": 2
  },
  {
    "name": "StyleAI Essentials Elegant Red Earrings 58",
    "description": "A beautifully detailed Earrings featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "StyleAI Essentials",
    "category": "Accessories",
    "subCategory": "Earrings",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Women",
    "price": 5530,
    "originalPrice": 7741,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1635767798638-3e25273a8236?sig=a_57&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Red"
    ],
    "inventory": 27,
    "occasionTags": [
      "Party",
      "Festive",
      "Date Night"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 3
  },
  {
    "name": "Royal Heritage Elegant Blue Bracelets 59",
    "description": "A beautifully detailed Bracelets featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "Royal Heritage",
    "category": "Accessories",
    "subCategory": "Bracelets",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Unisex",
    "price": 5620,
    "originalPrice": 7867,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?sig=a_58&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Blue"
    ],
    "inventory": 28,
    "occasionTags": [
      "Casual",
      "College"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.8,
    "reviewsCount": 4
  },
  {
    "name": "Graceful Elegant Navy Blue Rings 60",
    "description": "A beautifully detailed Rings featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "Graceful",
    "category": "Accessories",
    "subCategory": "Rings",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Unisex",
    "price": 5710,
    "originalPrice": 7993,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?sig=a_59&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Navy Blue"
    ],
    "inventory": 29,
    "occasionTags": [
      "Wedding",
      "Engagement",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 5
  },
  {
    "name": "Urban Ethnic Elegant Charcoal Grey Watches 61",
    "description": "A beautifully detailed Watches featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "Urban Ethnic",
    "category": "Accessories",
    "subCategory": "Watches",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Unisex",
    "price": 5800,
    "originalPrice": 8119,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?sig=a_60&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Charcoal Grey"
    ],
    "inventory": 30,
    "occasionTags": [
      "Office",
      "Formal",
      "Daily Wear"
    ],
    "featured": true,
    "aiRecommended": true,
    "ratings": 4,
    "reviewsCount": 0
  },
  {
    "name": "Zara Elegant Light Blue Handbags 62",
    "description": "A beautifully detailed Handbags featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "Zara",
    "category": "Accessories",
    "subCategory": "Handbags",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Women",
    "price": 5890,
    "originalPrice": 8246,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?sig=a_61&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Light Blue"
    ],
    "inventory": 31,
    "occasionTags": [
      "Casual",
      "Office",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 1
  },
  {
    "name": "Nike Elegant Beige Tote Bags 63",
    "description": "A beautifully detailed Tote Bags featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "Nike",
    "category": "Accessories",
    "subCategory": "Tote Bags",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Women",
    "price": 480,
    "originalPrice": 672,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?sig=a_62&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Beige"
    ],
    "inventory": 32,
    "occasionTags": [
      "Casual",
      "Vacation",
      "College"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 2
  },
  {
    "name": "Puma Elegant Burgundy Sling Bags 64",
    "description": "A beautifully detailed Sling Bags featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "Puma",
    "category": "Accessories",
    "subCategory": "Sling Bags",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Women",
    "price": 570,
    "originalPrice": 798,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?sig=a_63&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Burgundy"
    ],
    "inventory": 33,
    "occasionTags": [
      "Casual",
      "Party",
      "Date Night"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 3
  },
  {
    "name": "StyleAI Premium Elegant Yellow Clutches 65",
    "description": "A beautifully detailed Clutches featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "StyleAI Premium",
    "category": "Accessories",
    "subCategory": "Clutches",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Women",
    "price": 660,
    "originalPrice": 923,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?sig=a_64&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Yellow"
    ],
    "inventory": 34,
    "occasionTags": [
      "Wedding",
      "Reception",
      "Party"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.4,
    "reviewsCount": 4
  },
  {
    "name": "Urban Denim Elegant Peach Wallets 66",
    "description": "A beautifully detailed Wallets featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "Urban Denim",
    "category": "Accessories",
    "subCategory": "Wallets",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Men",
    "price": 750,
    "originalPrice": 1050,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?sig=a_65&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Peach"
    ],
    "inventory": 35,
    "occasionTags": [
      "Casual",
      "Office",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 5
  },
  {
    "name": "Executive Wear Elegant Orange Sunglasses 67",
    "description": "A beautifully detailed Sunglasses featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "Executive Wear",
    "category": "Accessories",
    "subCategory": "Sunglasses",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Unisex",
    "price": 840,
    "originalPrice": 1176,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?sig=a_66&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Orange"
    ],
    "inventory": 36,
    "occasionTags": [
      "Casual",
      "Vacation",
      "Airport"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.6,
    "reviewsCount": 0
  },
  {
    "name": "StyleAI Streetwear Elegant Maroon Belts 68",
    "description": "A beautifully detailed Belts featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "StyleAI Streetwear",
    "category": "Accessories",
    "subCategory": "Belts",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Men",
    "price": 930,
    "originalPrice": 1302,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?sig=a_67&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Maroon"
    ],
    "inventory": 37,
    "occasionTags": [
      "Office",
      "Formal",
      "Casual"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 1
  },
  {
    "name": "StyleAI Essentials Elegant Khaki Necklaces 69",
    "description": "A beautifully detailed Necklaces featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "StyleAI Essentials",
    "category": "Accessories",
    "subCategory": "Necklaces",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Women",
    "price": 1020,
    "originalPrice": 1428,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?sig=a_68&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Khaki"
    ],
    "inventory": 38,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.8,
    "reviewsCount": 2
  },
  {
    "name": "Royal Heritage Elegant Dark Brown Earrings 70",
    "description": "A beautifully detailed Earrings featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "Royal Heritage",
    "category": "Accessories",
    "subCategory": "Earrings",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Women",
    "price": 1110,
    "originalPrice": 1554,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?sig=a_69&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Dark Brown"
    ],
    "inventory": 39,
    "occasionTags": [
      "Party",
      "Festive",
      "Date Night"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 3
  },
  {
    "name": "Graceful Elegant Silver Bracelets 71",
    "description": "A beautifully detailed Bracelets featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "Graceful",
    "category": "Accessories",
    "subCategory": "Bracelets",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Unisex",
    "price": 1200,
    "originalPrice": 1680,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?sig=a_70&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Silver"
    ],
    "inventory": 40,
    "occasionTags": [
      "Casual",
      "College"
    ],
    "featured": true,
    "aiRecommended": false,
    "ratings": 4,
    "reviewsCount": 4
  },
  {
    "name": "Urban Ethnic Elegant Pink Rings 72",
    "description": "A beautifully detailed Rings featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "Urban Ethnic",
    "category": "Accessories",
    "subCategory": "Rings",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Unisex",
    "price": 1290,
    "originalPrice": 1805,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?sig=a_71&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Pink"
    ],
    "inventory": 41,
    "occasionTags": [
      "Wedding",
      "Engagement",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 5
  },
  {
    "name": "Zara Elegant Gold Watches 73",
    "description": "A beautifully detailed Watches featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "Zara",
    "category": "Accessories",
    "subCategory": "Watches",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Unisex",
    "price": 1380,
    "originalPrice": 1931,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?sig=a_72&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Gold"
    ],
    "inventory": 42,
    "occasionTags": [
      "Office",
      "Formal",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.2,
    "reviewsCount": 0
  },
  {
    "name": "Nike Elegant Black Handbags 74",
    "description": "A beautifully detailed Handbags featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "Nike",
    "category": "Accessories",
    "subCategory": "Handbags",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Women",
    "price": 1470,
    "originalPrice": 2058,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?sig=a_73&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Black"
    ],
    "inventory": 43,
    "occasionTags": [
      "Casual",
      "Office",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 1
  },
  {
    "name": "Puma Elegant White Tote Bags 75",
    "description": "A beautifully detailed Tote Bags featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "Puma",
    "category": "Accessories",
    "subCategory": "Tote Bags",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Women",
    "price": 1560,
    "originalPrice": 2184,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?sig=a_74&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "White"
    ],
    "inventory": 44,
    "occasionTags": [
      "Casual",
      "Vacation",
      "College"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.4,
    "reviewsCount": 2
  },
  {
    "name": "StyleAI Premium Elegant Green Sling Bags 76",
    "description": "A beautifully detailed Sling Bags featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "StyleAI Premium",
    "category": "Accessories",
    "subCategory": "Sling Bags",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Women",
    "price": 1650,
    "originalPrice": 2310,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?sig=a_75&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Green"
    ],
    "inventory": 45,
    "occasionTags": [
      "Casual",
      "Party",
      "Date Night"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 3
  },
  {
    "name": "Urban Denim Elegant Red Clutches 77",
    "description": "A beautifully detailed Clutches featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "Urban Denim",
    "category": "Accessories",
    "subCategory": "Clutches",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Women",
    "price": 1740,
    "originalPrice": 2436,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?sig=a_76&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Red"
    ],
    "inventory": 46,
    "occasionTags": [
      "Wedding",
      "Reception",
      "Party"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.6,
    "reviewsCount": 4
  },
  {
    "name": "Executive Wear Elegant Blue Wallets 78",
    "description": "A beautifully detailed Wallets featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "Executive Wear",
    "category": "Accessories",
    "subCategory": "Wallets",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Men",
    "price": 1830,
    "originalPrice": 2562,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?sig=a_77&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Blue"
    ],
    "inventory": 47,
    "occasionTags": [
      "Casual",
      "Office",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 5
  },
  {
    "name": "StyleAI Streetwear Elegant Navy Blue Sunglasses 79",
    "description": "A beautifully detailed Sunglasses featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "StyleAI Streetwear",
    "category": "Accessories",
    "subCategory": "Sunglasses",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Unisex",
    "price": 1920,
    "originalPrice": 2688,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?sig=a_78&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Navy Blue"
    ],
    "inventory": 48,
    "occasionTags": [
      "Casual",
      "Vacation",
      "Airport"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.8,
    "reviewsCount": 0
  },
  {
    "name": "StyleAI Essentials Elegant Charcoal Grey Belts 80",
    "description": "A beautifully detailed Belts featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "StyleAI Essentials",
    "category": "Accessories",
    "subCategory": "Belts",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Men",
    "price": 2010,
    "originalPrice": 2814,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?sig=a_79&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Charcoal Grey"
    ],
    "inventory": 49,
    "occasionTags": [
      "Office",
      "Formal",
      "Casual"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 1
  },
  {
    "name": "Royal Heritage Elegant Light Blue Necklaces 81",
    "description": "A beautifully detailed Necklaces featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "Royal Heritage",
    "category": "Accessories",
    "subCategory": "Necklaces",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Women",
    "price": 2100,
    "originalPrice": 2940,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?sig=a_80&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Light Blue"
    ],
    "inventory": 50,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Traditional"
    ],
    "featured": true,
    "aiRecommended": true,
    "ratings": 4,
    "reviewsCount": 2
  },
  {
    "name": "Graceful Elegant Beige Earrings 82",
    "description": "A beautifully detailed Earrings featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "Graceful",
    "category": "Accessories",
    "subCategory": "Earrings",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Women",
    "price": 2190,
    "originalPrice": 3066,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?sig=a_81&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Beige"
    ],
    "inventory": 51,
    "occasionTags": [
      "Party",
      "Festive",
      "Date Night"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 3
  },
  {
    "name": "Urban Ethnic Elegant Burgundy Bracelets 83",
    "description": "A beautifully detailed Bracelets featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "Urban Ethnic",
    "category": "Accessories",
    "subCategory": "Bracelets",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Unisex",
    "price": 2280,
    "originalPrice": 3192,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1635767798638-3e25273a8236?sig=a_82&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Burgundy"
    ],
    "inventory": 52,
    "occasionTags": [
      "Casual",
      "College"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 4
  },
  {
    "name": "Zara Elegant Yellow Rings 84",
    "description": "A beautifully detailed Rings featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "Zara",
    "category": "Accessories",
    "subCategory": "Rings",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Unisex",
    "price": 2370,
    "originalPrice": 3318,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?sig=a_83&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Yellow"
    ],
    "inventory": 53,
    "occasionTags": [
      "Wedding",
      "Engagement",
      "Formal"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 5
  },
  {
    "name": "Nike Elegant Peach Watches 85",
    "description": "A beautifully detailed Watches featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "Nike",
    "category": "Accessories",
    "subCategory": "Watches",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Unisex",
    "price": 2460,
    "originalPrice": 3444,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?sig=a_84&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Peach"
    ],
    "inventory": 54,
    "occasionTags": [
      "Office",
      "Formal",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.4,
    "reviewsCount": 0
  },
  {
    "name": "Puma Elegant Orange Handbags 86",
    "description": "A beautifully detailed Handbags featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "Puma",
    "category": "Accessories",
    "subCategory": "Handbags",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Women",
    "price": 2550,
    "originalPrice": 3570,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?sig=a_85&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Orange"
    ],
    "inventory": 55,
    "occasionTags": [
      "Casual",
      "Office",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 1
  },
  {
    "name": "StyleAI Premium Elegant Maroon Tote Bags 87",
    "description": "A beautifully detailed Tote Bags featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "StyleAI Premium",
    "category": "Accessories",
    "subCategory": "Tote Bags",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Women",
    "price": 2640,
    "originalPrice": 3695,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?sig=a_86&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Maroon"
    ],
    "inventory": 56,
    "occasionTags": [
      "Casual",
      "Vacation",
      "College"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.6,
    "reviewsCount": 2
  },
  {
    "name": "Urban Denim Elegant Khaki Sling Bags 88",
    "description": "A beautifully detailed Sling Bags featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "Urban Denim",
    "category": "Accessories",
    "subCategory": "Sling Bags",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Women",
    "price": 2730,
    "originalPrice": 3821,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?sig=a_87&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Khaki"
    ],
    "inventory": 57,
    "occasionTags": [
      "Casual",
      "Party",
      "Date Night"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 3
  },
  {
    "name": "Executive Wear Elegant Dark Brown Clutches 89",
    "description": "A beautifully detailed Clutches featuring clean contours and reliable construction. Created from select Stainless Steel components. Perfect accessory option for modern styling coordinates.",
    "brand": "Executive Wear",
    "category": "Accessories",
    "subCategory": "Clutches",
    "material": "Stainless Steel",
    "fit": "One Size",
    "gender": "Women",
    "price": 2820,
    "originalPrice": 3947,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?sig=a_88&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Dark Brown"
    ],
    "inventory": 58,
    "occasionTags": [
      "Wedding",
      "Reception",
      "Party"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.8,
    "reviewsCount": 4
  },
  {
    "name": "StyleAI Streetwear Elegant Silver Wallets 90",
    "description": "A beautifully detailed Wallets featuring clean contours and reliable construction. Created from select Genuine Leather components. Perfect accessory option for modern styling coordinates.",
    "brand": "StyleAI Streetwear",
    "category": "Accessories",
    "subCategory": "Wallets",
    "material": "Genuine Leather",
    "fit": "One Size",
    "gender": "Men",
    "price": 2910,
    "originalPrice": 4073,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?sig=a_89&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "Free Size"
    ],
    "colors": [
      "Silver"
    ],
    "inventory": 59,
    "occasionTags": [
      "Casual",
      "Office",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 5
  },
  {
    "name": "Nike Cozy Navy Blue Cardigans 1",
    "description": "A warm and highly functional Cardigans layering option. Tailored using premium Silk fibres in a relaxed Regular profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Nike",
    "category": "Outerwear",
    "subCategory": "Cardigans",
    "material": "Silk",
    "fit": "Regular",
    "gender": "Women",
    "price": 1200,
    "originalPrice": 1800,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?sig=o_0&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Navy Blue"
    ],
    "inventory": 10,
    "occasionTags": [
      "Winter",
      "Casual",
      "Daily Wear"
    ],
    "featured": true,
    "aiRecommended": true,
    "ratings": 4.1,
    "reviewsCount": 0
  },
  {
    "name": "Puma Cozy Charcoal Grey Shawls 2",
    "description": "A warm and highly functional Shawls layering option. Tailored using premium Georgette fibres in a relaxed Slim Fit profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Puma",
    "category": "Outerwear",
    "subCategory": "Shawls",
    "material": "Georgette",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 1440,
    "originalPrice": 2160,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?sig=o_1&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Charcoal Grey"
    ],
    "inventory": 11,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 1
  },
  {
    "name": "StyleAI Premium Cozy Light Blue Leather Jackets 3",
    "description": "A warm and highly functional Leather Jackets layering option. Tailored using premium Cotton fibres in a relaxed Oversized profile. Designed to protect and elevate winter styling configurations.",
    "brand": "StyleAI Premium",
    "category": "Outerwear",
    "subCategory": "Leather Jackets",
    "material": "Cotton",
    "fit": "Oversized",
    "gender": "Men",
    "price": 1680,
    "originalPrice": 2520,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1544923246-77307dd654cb?sig=o_2&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Light Blue"
    ],
    "inventory": 12,
    "occasionTags": [
      "Party",
      "Casual",
      "Winter"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 2
  },
  {
    "name": "Urban Denim Cozy Beige Denim Jackets 4",
    "description": "A warm and highly functional Denim Jackets layering option. Tailored using premium Wool Blend fibres in a relaxed Loose Fit profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Urban Denim",
    "category": "Outerwear",
    "subCategory": "Denim Jackets",
    "material": "Wool Blend",
    "fit": "Loose Fit",
    "gender": "Unisex",
    "price": 1920,
    "originalPrice": 2880,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?sig=o_3&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Beige"
    ],
    "inventory": 13,
    "occasionTags": [
      "Casual",
      "College",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.4,
    "reviewsCount": 3
  },
  {
    "name": "Executive Wear Cozy Burgundy Bomber Jackets 5",
    "description": "A warm and highly functional Bomber Jackets layering option. Tailored using premium Polyester Blend fibres in a relaxed Regular profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Executive Wear",
    "category": "Outerwear",
    "subCategory": "Bomber Jackets",
    "material": "Polyester Blend",
    "fit": "Regular",
    "gender": "Men",
    "price": 2160,
    "originalPrice": 3240,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?sig=o_4&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Burgundy"
    ],
    "inventory": 14,
    "occasionTags": [
      "Casual",
      "Airport",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.5,
    "reviewsCount": 4
  },
  {
    "name": "StyleAI Streetwear Cozy Yellow Trench Coats 6",
    "description": "A warm and highly functional Trench Coats layering option. Tailored using premium Denim Cotton fibres in a relaxed Slim Fit profile. Designed to protect and elevate winter styling configurations.",
    "brand": "StyleAI Streetwear",
    "category": "Outerwear",
    "subCategory": "Trench Coats",
    "material": "Denim Cotton",
    "fit": "Slim Fit",
    "gender": "Unisex",
    "price": 2400,
    "originalPrice": 3600,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?sig=o_5&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Yellow"
    ],
    "inventory": 15,
    "occasionTags": [
      "Winter",
      "Formal",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.6,
    "reviewsCount": 5
  },
  {
    "name": "StyleAI Essentials Cozy Peach Cardigans 7",
    "description": "A warm and highly functional Cardigans layering option. Tailored using premium Cotton Fleece fibres in a relaxed Oversized profile. Designed to protect and elevate winter styling configurations.",
    "brand": "StyleAI Essentials",
    "category": "Outerwear",
    "subCategory": "Cardigans",
    "material": "Cotton Fleece",
    "fit": "Oversized",
    "gender": "Women",
    "price": 2640,
    "originalPrice": 3960,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1608228088998-57828365d486?sig=o_6&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Peach"
    ],
    "inventory": 16,
    "occasionTags": [
      "Winter",
      "Casual",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 6
  },
  {
    "name": "Royal Heritage Cozy Orange Shawls 8",
    "description": "A warm and highly functional Shawls layering option. Tailored using premium Rayon fibres in a relaxed Loose Fit profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Royal Heritage",
    "category": "Outerwear",
    "subCategory": "Shawls",
    "material": "Rayon",
    "fit": "Loose Fit",
    "gender": "Women",
    "price": 2880,
    "originalPrice": 4320,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?sig=o_7&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Orange"
    ],
    "inventory": 17,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.8,
    "reviewsCount": 7
  },
  {
    "name": "Graceful Cozy Maroon Leather Jackets 9",
    "description": "A warm and highly functional Leather Jackets layering option. Tailored using premium Satin Silk fibres in a relaxed Regular profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Graceful",
    "category": "Outerwear",
    "subCategory": "Leather Jackets",
    "material": "Satin Silk",
    "fit": "Regular",
    "gender": "Men",
    "price": 3120,
    "originalPrice": 4680,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?sig=o_8&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Maroon"
    ],
    "inventory": 18,
    "occasionTags": [
      "Party",
      "Casual",
      "Winter"
    ],
    "featured": true,
    "aiRecommended": true,
    "ratings": 4.9,
    "reviewsCount": 8
  },
  {
    "name": "Urban Ethnic Cozy Khaki Denim Jackets 10",
    "description": "A warm and highly functional Denim Jackets layering option. Tailored using premium Polyester Sequin fibres in a relaxed Slim Fit profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Urban Ethnic",
    "category": "Outerwear",
    "subCategory": "Denim Jackets",
    "material": "Polyester Sequin",
    "fit": "Slim Fit",
    "gender": "Unisex",
    "price": 3360,
    "originalPrice": 5040,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?sig=o_9&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Khaki"
    ],
    "inventory": 19,
    "occasionTags": [
      "Casual",
      "College",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 9
  },
  {
    "name": "Zara Cozy Dark Brown Bomber Jackets 11",
    "description": "A warm and highly functional Bomber Jackets layering option. Tailored using premium Linen fibres in a relaxed Oversized profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Zara",
    "category": "Outerwear",
    "subCategory": "Bomber Jackets",
    "material": "Linen",
    "fit": "Oversized",
    "gender": "Men",
    "price": 3600,
    "originalPrice": 5400,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1544923246-77307dd654cb?sig=o_10&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Dark Brown"
    ],
    "inventory": 20,
    "occasionTags": [
      "Casual",
      "Airport",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 0
  },
  {
    "name": "Nike Cozy Silver Trench Coats 12",
    "description": "A warm and highly functional Trench Coats layering option. Tailored using premium Acrylic Wool fibres in a relaxed Loose Fit profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Nike",
    "category": "Outerwear",
    "subCategory": "Trench Coats",
    "material": "Acrylic Wool",
    "fit": "Loose Fit",
    "gender": "Unisex",
    "price": 3840,
    "originalPrice": 5760,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?sig=o_11&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Silver"
    ],
    "inventory": 21,
    "occasionTags": [
      "Winter",
      "Formal",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 1
  },
  {
    "name": "Puma Cozy Pink Cardigans 13",
    "description": "A warm and highly functional Cardigans layering option. Tailored using premium Suede Leather fibres in a relaxed Regular profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Puma",
    "category": "Outerwear",
    "subCategory": "Cardigans",
    "material": "Suede Leather",
    "fit": "Regular",
    "gender": "Women",
    "price": 4080,
    "originalPrice": 6120,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?sig=o_12&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Pink"
    ],
    "inventory": 22,
    "occasionTags": [
      "Winter",
      "Casual",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.4,
    "reviewsCount": 2
  },
  {
    "name": "StyleAI Premium Cozy Gold Shawls 14",
    "description": "A warm and highly functional Shawls layering option. Tailored using premium Pique Cotton fibres in a relaxed Slim Fit profile. Designed to protect and elevate winter styling configurations.",
    "brand": "StyleAI Premium",
    "category": "Outerwear",
    "subCategory": "Shawls",
    "material": "Pique Cotton",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 4320,
    "originalPrice": 6480,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?sig=o_13&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Gold"
    ],
    "inventory": 23,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 3
  },
  {
    "name": "Urban Denim Cozy Black Leather Jackets 15",
    "description": "A warm and highly functional Leather Jackets layering option. Tailored using premium Synthetic Leather fibres in a relaxed Oversized profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Urban Denim",
    "category": "Outerwear",
    "subCategory": "Leather Jackets",
    "material": "Synthetic Leather",
    "fit": "Oversized",
    "gender": "Men",
    "price": 4560,
    "originalPrice": 6840,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1544923246-77307dd654cb?sig=o_14&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black"
    ],
    "inventory": 24,
    "occasionTags": [
      "Party",
      "Casual",
      "Winter"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.6,
    "reviewsCount": 4
  },
  {
    "name": "Executive Wear Cozy White Denim Jackets 16",
    "description": "A warm and highly functional Denim Jackets layering option. Tailored using premium Genuine Leather fibres in a relaxed Loose Fit profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Executive Wear",
    "category": "Outerwear",
    "subCategory": "Denim Jackets",
    "material": "Genuine Leather",
    "fit": "Loose Fit",
    "gender": "Unisex",
    "price": 4800,
    "originalPrice": 7200,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?sig=o_15&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "White"
    ],
    "inventory": 25,
    "occasionTags": [
      "Casual",
      "College",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 5
  },
  {
    "name": "StyleAI Streetwear Cozy Green Bomber Jackets 17",
    "description": "A warm and highly functional Bomber Jackets layering option. Tailored using premium Silk fibres in a relaxed Regular profile. Designed to protect and elevate winter styling configurations.",
    "brand": "StyleAI Streetwear",
    "category": "Outerwear",
    "subCategory": "Bomber Jackets",
    "material": "Silk",
    "fit": "Regular",
    "gender": "Men",
    "price": 5040,
    "originalPrice": 7560,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?sig=o_16&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Green"
    ],
    "inventory": 26,
    "occasionTags": [
      "Casual",
      "Airport",
      "Travel"
    ],
    "featured": true,
    "aiRecommended": true,
    "ratings": 4.8,
    "reviewsCount": 6
  },
  {
    "name": "StyleAI Essentials Cozy Red Trench Coats 18",
    "description": "A warm and highly functional Trench Coats layering option. Tailored using premium Georgette fibres in a relaxed Slim Fit profile. Designed to protect and elevate winter styling configurations.",
    "brand": "StyleAI Essentials",
    "category": "Outerwear",
    "subCategory": "Trench Coats",
    "material": "Georgette",
    "fit": "Slim Fit",
    "gender": "Unisex",
    "price": 5280,
    "originalPrice": 7920,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?sig=o_17&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Red"
    ],
    "inventory": 27,
    "occasionTags": [
      "Winter",
      "Formal",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 7
  },
  {
    "name": "Royal Heritage Cozy Blue Cardigans 19",
    "description": "A warm and highly functional Cardigans layering option. Tailored using premium Cotton fibres in a relaxed Oversized profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Royal Heritage",
    "category": "Outerwear",
    "subCategory": "Cardigans",
    "material": "Cotton",
    "fit": "Oversized",
    "gender": "Women",
    "price": 5520,
    "originalPrice": 8280,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1608228088998-57828365d486?sig=o_18&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Blue"
    ],
    "inventory": 28,
    "occasionTags": [
      "Winter",
      "Casual",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 8
  },
  {
    "name": "Graceful Cozy Navy Blue Shawls 20",
    "description": "A warm and highly functional Shawls layering option. Tailored using premium Wool Blend fibres in a relaxed Loose Fit profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Graceful",
    "category": "Outerwear",
    "subCategory": "Shawls",
    "material": "Wool Blend",
    "fit": "Loose Fit",
    "gender": "Women",
    "price": 5760,
    "originalPrice": 8640,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?sig=o_19&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Navy Blue"
    ],
    "inventory": 29,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 9
  },
  {
    "name": "Urban Ethnic Cozy Charcoal Grey Leather Jackets 21",
    "description": "A warm and highly functional Leather Jackets layering option. Tailored using premium Polyester Blend fibres in a relaxed Regular profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Urban Ethnic",
    "category": "Outerwear",
    "subCategory": "Leather Jackets",
    "material": "Polyester Blend",
    "fit": "Regular",
    "gender": "Men",
    "price": 6000,
    "originalPrice": 9000,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?sig=o_20&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Charcoal Grey"
    ],
    "inventory": 10,
    "occasionTags": [
      "Party",
      "Casual",
      "Winter"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.3,
    "reviewsCount": 0
  },
  {
    "name": "Zara Cozy Light Blue Denim Jackets 22",
    "description": "A warm and highly functional Denim Jackets layering option. Tailored using premium Denim Cotton fibres in a relaxed Slim Fit profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Zara",
    "category": "Outerwear",
    "subCategory": "Denim Jackets",
    "material": "Denim Cotton",
    "fit": "Slim Fit",
    "gender": "Unisex",
    "price": 6240,
    "originalPrice": 9360,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?sig=o_21&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Light Blue"
    ],
    "inventory": 11,
    "occasionTags": [
      "Casual",
      "College",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.4,
    "reviewsCount": 1
  },
  {
    "name": "Nike Cozy Beige Bomber Jackets 23",
    "description": "A warm and highly functional Bomber Jackets layering option. Tailored using premium Cotton Fleece fibres in a relaxed Oversized profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Nike",
    "category": "Outerwear",
    "subCategory": "Bomber Jackets",
    "material": "Cotton Fleece",
    "fit": "Oversized",
    "gender": "Men",
    "price": 6480,
    "originalPrice": 9720,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1544923246-77307dd654cb?sig=o_22&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Beige"
    ],
    "inventory": 12,
    "occasionTags": [
      "Casual",
      "Airport",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 2
  },
  {
    "name": "Puma Cozy Burgundy Trench Coats 24",
    "description": "A warm and highly functional Trench Coats layering option. Tailored using premium Rayon fibres in a relaxed Loose Fit profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Puma",
    "category": "Outerwear",
    "subCategory": "Trench Coats",
    "material": "Rayon",
    "fit": "Loose Fit",
    "gender": "Unisex",
    "price": 6720,
    "originalPrice": 10080,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?sig=o_23&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Burgundy"
    ],
    "inventory": 13,
    "occasionTags": [
      "Winter",
      "Formal",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.6,
    "reviewsCount": 3
  },
  {
    "name": "StyleAI Premium Cozy Yellow Cardigans 25",
    "description": "A warm and highly functional Cardigans layering option. Tailored using premium Satin Silk fibres in a relaxed Regular profile. Designed to protect and elevate winter styling configurations.",
    "brand": "StyleAI Premium",
    "category": "Outerwear",
    "subCategory": "Cardigans",
    "material": "Satin Silk",
    "fit": "Regular",
    "gender": "Women",
    "price": 6960,
    "originalPrice": 10440,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?sig=o_24&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Yellow"
    ],
    "inventory": 14,
    "occasionTags": [
      "Winter",
      "Casual",
      "Daily Wear"
    ],
    "featured": true,
    "aiRecommended": true,
    "ratings": 4.7,
    "reviewsCount": 4
  },
  {
    "name": "Urban Denim Cozy Peach Shawls 26",
    "description": "A warm and highly functional Shawls layering option. Tailored using premium Polyester Sequin fibres in a relaxed Slim Fit profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Urban Denim",
    "category": "Outerwear",
    "subCategory": "Shawls",
    "material": "Polyester Sequin",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 7200,
    "originalPrice": 10800,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?sig=o_25&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Peach"
    ],
    "inventory": 15,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.8,
    "reviewsCount": 5
  },
  {
    "name": "Executive Wear Cozy Orange Leather Jackets 27",
    "description": "A warm and highly functional Leather Jackets layering option. Tailored using premium Linen fibres in a relaxed Oversized profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Executive Wear",
    "category": "Outerwear",
    "subCategory": "Leather Jackets",
    "material": "Linen",
    "fit": "Oversized",
    "gender": "Men",
    "price": 7440,
    "originalPrice": 11160,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1544923246-77307dd654cb?sig=o_26&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Orange"
    ],
    "inventory": 16,
    "occasionTags": [
      "Party",
      "Casual",
      "Winter"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 6
  },
  {
    "name": "StyleAI Streetwear Cozy Maroon Denim Jackets 28",
    "description": "A warm and highly functional Denim Jackets layering option. Tailored using premium Acrylic Wool fibres in a relaxed Loose Fit profile. Designed to protect and elevate winter styling configurations.",
    "brand": "StyleAI Streetwear",
    "category": "Outerwear",
    "subCategory": "Denim Jackets",
    "material": "Acrylic Wool",
    "fit": "Loose Fit",
    "gender": "Unisex",
    "price": 7680,
    "originalPrice": 11520,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?sig=o_27&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Maroon"
    ],
    "inventory": 17,
    "occasionTags": [
      "Casual",
      "College",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 7
  },
  {
    "name": "StyleAI Essentials Cozy Khaki Bomber Jackets 29",
    "description": "A warm and highly functional Bomber Jackets layering option. Tailored using premium Suede Leather fibres in a relaxed Regular profile. Designed to protect and elevate winter styling configurations.",
    "brand": "StyleAI Essentials",
    "category": "Outerwear",
    "subCategory": "Bomber Jackets",
    "material": "Suede Leather",
    "fit": "Regular",
    "gender": "Men",
    "price": 7920,
    "originalPrice": 11880,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?sig=o_28&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Khaki"
    ],
    "inventory": 18,
    "occasionTags": [
      "Casual",
      "Airport",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.2,
    "reviewsCount": 8
  },
  {
    "name": "Royal Heritage Cozy Dark Brown Trench Coats 30",
    "description": "A warm and highly functional Trench Coats layering option. Tailored using premium Pique Cotton fibres in a relaxed Slim Fit profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Royal Heritage",
    "category": "Outerwear",
    "subCategory": "Trench Coats",
    "material": "Pique Cotton",
    "fit": "Slim Fit",
    "gender": "Unisex",
    "price": 8160,
    "originalPrice": 12240,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?sig=o_29&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Dark Brown"
    ],
    "inventory": 19,
    "occasionTags": [
      "Winter",
      "Formal",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 9
  },
  {
    "name": "Graceful Cozy Silver Cardigans 31",
    "description": "A warm and highly functional Cardigans layering option. Tailored using premium Synthetic Leather fibres in a relaxed Oversized profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Graceful",
    "category": "Outerwear",
    "subCategory": "Cardigans",
    "material": "Synthetic Leather",
    "fit": "Oversized",
    "gender": "Women",
    "price": 8400,
    "originalPrice": 12600,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1608228088998-57828365d486?sig=o_30&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Silver"
    ],
    "inventory": 20,
    "occasionTags": [
      "Winter",
      "Casual",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.4,
    "reviewsCount": 0
  },
  {
    "name": "Urban Ethnic Cozy Pink Shawls 32",
    "description": "A warm and highly functional Shawls layering option. Tailored using premium Genuine Leather fibres in a relaxed Loose Fit profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Urban Ethnic",
    "category": "Outerwear",
    "subCategory": "Shawls",
    "material": "Genuine Leather",
    "fit": "Loose Fit",
    "gender": "Women",
    "price": 8640,
    "originalPrice": 12960,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?sig=o_31&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Pink"
    ],
    "inventory": 21,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 1
  },
  {
    "name": "Zara Cozy Gold Leather Jackets 33",
    "description": "A warm and highly functional Leather Jackets layering option. Tailored using premium Silk fibres in a relaxed Regular profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Zara",
    "category": "Outerwear",
    "subCategory": "Leather Jackets",
    "material": "Silk",
    "fit": "Regular",
    "gender": "Men",
    "price": 8880,
    "originalPrice": 13320,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?sig=o_32&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Gold"
    ],
    "inventory": 22,
    "occasionTags": [
      "Party",
      "Casual",
      "Winter"
    ],
    "featured": true,
    "aiRecommended": true,
    "ratings": 4.6,
    "reviewsCount": 2
  },
  {
    "name": "Nike Cozy Black Denim Jackets 34",
    "description": "A warm and highly functional Denim Jackets layering option. Tailored using premium Georgette fibres in a relaxed Slim Fit profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Nike",
    "category": "Outerwear",
    "subCategory": "Denim Jackets",
    "material": "Georgette",
    "fit": "Slim Fit",
    "gender": "Unisex",
    "price": 9120,
    "originalPrice": 13680,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?sig=o_33&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black"
    ],
    "inventory": 23,
    "occasionTags": [
      "Casual",
      "College",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 3
  },
  {
    "name": "Puma Cozy White Bomber Jackets 35",
    "description": "A warm and highly functional Bomber Jackets layering option. Tailored using premium Cotton fibres in a relaxed Oversized profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Puma",
    "category": "Outerwear",
    "subCategory": "Bomber Jackets",
    "material": "Cotton",
    "fit": "Oversized",
    "gender": "Men",
    "price": 1360,
    "originalPrice": 2040,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1544923246-77307dd654cb?sig=o_34&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "White"
    ],
    "inventory": 24,
    "occasionTags": [
      "Casual",
      "Airport",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.8,
    "reviewsCount": 4
  },
  {
    "name": "StyleAI Premium Cozy Green Trench Coats 36",
    "description": "A warm and highly functional Trench Coats layering option. Tailored using premium Wool Blend fibres in a relaxed Loose Fit profile. Designed to protect and elevate winter styling configurations.",
    "brand": "StyleAI Premium",
    "category": "Outerwear",
    "subCategory": "Trench Coats",
    "material": "Wool Blend",
    "fit": "Loose Fit",
    "gender": "Unisex",
    "price": 1600,
    "originalPrice": 2400,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?sig=o_35&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Green"
    ],
    "inventory": 25,
    "occasionTags": [
      "Winter",
      "Formal",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 5
  },
  {
    "name": "Urban Denim Cozy Red Cardigans 37",
    "description": "A warm and highly functional Cardigans layering option. Tailored using premium Polyester Blend fibres in a relaxed Regular profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Urban Denim",
    "category": "Outerwear",
    "subCategory": "Cardigans",
    "material": "Polyester Blend",
    "fit": "Regular",
    "gender": "Women",
    "price": 1840,
    "originalPrice": 2760,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?sig=o_36&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Red"
    ],
    "inventory": 26,
    "occasionTags": [
      "Winter",
      "Casual",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.1,
    "reviewsCount": 6
  },
  {
    "name": "Executive Wear Cozy Blue Shawls 38",
    "description": "A warm and highly functional Shawls layering option. Tailored using premium Denim Cotton fibres in a relaxed Slim Fit profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Executive Wear",
    "category": "Outerwear",
    "subCategory": "Shawls",
    "material": "Denim Cotton",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 2080,
    "originalPrice": 3120,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?sig=o_37&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Blue"
    ],
    "inventory": 27,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 7
  },
  {
    "name": "StyleAI Streetwear Cozy Navy Blue Leather Jackets 39",
    "description": "A warm and highly functional Leather Jackets layering option. Tailored using premium Cotton Fleece fibres in a relaxed Oversized profile. Designed to protect and elevate winter styling configurations.",
    "brand": "StyleAI Streetwear",
    "category": "Outerwear",
    "subCategory": "Leather Jackets",
    "material": "Cotton Fleece",
    "fit": "Oversized",
    "gender": "Men",
    "price": 2320,
    "originalPrice": 3480,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1544923246-77307dd654cb?sig=o_38&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Navy Blue"
    ],
    "inventory": 28,
    "occasionTags": [
      "Party",
      "Casual",
      "Winter"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 8
  },
  {
    "name": "StyleAI Essentials Cozy Charcoal Grey Denim Jackets 40",
    "description": "A warm and highly functional Denim Jackets layering option. Tailored using premium Rayon fibres in a relaxed Loose Fit profile. Designed to protect and elevate winter styling configurations.",
    "brand": "StyleAI Essentials",
    "category": "Outerwear",
    "subCategory": "Denim Jackets",
    "material": "Rayon",
    "fit": "Loose Fit",
    "gender": "Unisex",
    "price": 2560,
    "originalPrice": 3840,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?sig=o_39&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Charcoal Grey"
    ],
    "inventory": 29,
    "occasionTags": [
      "Casual",
      "College",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.4,
    "reviewsCount": 9
  },
  {
    "name": "Royal Heritage Cozy Light Blue Bomber Jackets 41",
    "description": "A warm and highly functional Bomber Jackets layering option. Tailored using premium Satin Silk fibres in a relaxed Regular profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Royal Heritage",
    "category": "Outerwear",
    "subCategory": "Bomber Jackets",
    "material": "Satin Silk",
    "fit": "Regular",
    "gender": "Men",
    "price": 2800,
    "originalPrice": 4200,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?sig=o_40&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Light Blue"
    ],
    "inventory": 10,
    "occasionTags": [
      "Casual",
      "Airport",
      "Travel"
    ],
    "featured": true,
    "aiRecommended": true,
    "ratings": 4.5,
    "reviewsCount": 0
  },
  {
    "name": "Graceful Cozy Beige Trench Coats 42",
    "description": "A warm and highly functional Trench Coats layering option. Tailored using premium Polyester Sequin fibres in a relaxed Slim Fit profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Graceful",
    "category": "Outerwear",
    "subCategory": "Trench Coats",
    "material": "Polyester Sequin",
    "fit": "Slim Fit",
    "gender": "Unisex",
    "price": 3040,
    "originalPrice": 4560,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?sig=o_41&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Beige"
    ],
    "inventory": 11,
    "occasionTags": [
      "Winter",
      "Formal",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.6,
    "reviewsCount": 1
  },
  {
    "name": "Urban Ethnic Cozy Burgundy Cardigans 43",
    "description": "A warm and highly functional Cardigans layering option. Tailored using premium Linen fibres in a relaxed Oversized profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Urban Ethnic",
    "category": "Outerwear",
    "subCategory": "Cardigans",
    "material": "Linen",
    "fit": "Oversized",
    "gender": "Women",
    "price": 3280,
    "originalPrice": 4920,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1608228088998-57828365d486?sig=o_42&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Burgundy"
    ],
    "inventory": 12,
    "occasionTags": [
      "Winter",
      "Casual",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 2
  },
  {
    "name": "Zara Cozy Yellow Shawls 44",
    "description": "A warm and highly functional Shawls layering option. Tailored using premium Acrylic Wool fibres in a relaxed Loose Fit profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Zara",
    "category": "Outerwear",
    "subCategory": "Shawls",
    "material": "Acrylic Wool",
    "fit": "Loose Fit",
    "gender": "Women",
    "price": 3520,
    "originalPrice": 5280,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?sig=o_43&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Yellow"
    ],
    "inventory": 13,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.8,
    "reviewsCount": 3
  },
  {
    "name": "Nike Cozy Peach Leather Jackets 45",
    "description": "A warm and highly functional Leather Jackets layering option. Tailored using premium Suede Leather fibres in a relaxed Regular profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Nike",
    "category": "Outerwear",
    "subCategory": "Leather Jackets",
    "material": "Suede Leather",
    "fit": "Regular",
    "gender": "Men",
    "price": 3760,
    "originalPrice": 5640,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?sig=o_44&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Peach"
    ],
    "inventory": 14,
    "occasionTags": [
      "Party",
      "Casual",
      "Winter"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.9,
    "reviewsCount": 4
  },
  {
    "name": "Puma Cozy Orange Denim Jackets 46",
    "description": "A warm and highly functional Denim Jackets layering option. Tailored using premium Pique Cotton fibres in a relaxed Slim Fit profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Puma",
    "category": "Outerwear",
    "subCategory": "Denim Jackets",
    "material": "Pique Cotton",
    "fit": "Slim Fit",
    "gender": "Unisex",
    "price": 4000,
    "originalPrice": 6000,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?sig=o_45&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Orange"
    ],
    "inventory": 15,
    "occasionTags": [
      "Casual",
      "College",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 5
  },
  {
    "name": "StyleAI Premium Cozy Maroon Bomber Jackets 47",
    "description": "A warm and highly functional Bomber Jackets layering option. Tailored using premium Synthetic Leather fibres in a relaxed Oversized profile. Designed to protect and elevate winter styling configurations.",
    "brand": "StyleAI Premium",
    "category": "Outerwear",
    "subCategory": "Bomber Jackets",
    "material": "Synthetic Leather",
    "fit": "Oversized",
    "gender": "Men",
    "price": 4240,
    "originalPrice": 6360,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1544923246-77307dd654cb?sig=o_46&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Maroon"
    ],
    "inventory": 16,
    "occasionTags": [
      "Casual",
      "Airport",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 6
  },
  {
    "name": "Urban Denim Cozy Khaki Trench Coats 48",
    "description": "A warm and highly functional Trench Coats layering option. Tailored using premium Genuine Leather fibres in a relaxed Loose Fit profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Urban Denim",
    "category": "Outerwear",
    "subCategory": "Trench Coats",
    "material": "Genuine Leather",
    "fit": "Loose Fit",
    "gender": "Unisex",
    "price": 4480,
    "originalPrice": 6720,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?sig=o_47&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Khaki"
    ],
    "inventory": 17,
    "occasionTags": [
      "Winter",
      "Formal",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.3,
    "reviewsCount": 7
  },
  {
    "name": "Executive Wear Cozy Dark Brown Cardigans 49",
    "description": "A warm and highly functional Cardigans layering option. Tailored using premium Silk fibres in a relaxed Regular profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Executive Wear",
    "category": "Outerwear",
    "subCategory": "Cardigans",
    "material": "Silk",
    "fit": "Regular",
    "gender": "Women",
    "price": 4720,
    "originalPrice": 7080,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?sig=o_48&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Dark Brown"
    ],
    "inventory": 18,
    "occasionTags": [
      "Winter",
      "Casual",
      "Daily Wear"
    ],
    "featured": true,
    "aiRecommended": true,
    "ratings": 4.4,
    "reviewsCount": 8
  },
  {
    "name": "StyleAI Streetwear Cozy Silver Shawls 50",
    "description": "A warm and highly functional Shawls layering option. Tailored using premium Georgette fibres in a relaxed Slim Fit profile. Designed to protect and elevate winter styling configurations.",
    "brand": "StyleAI Streetwear",
    "category": "Outerwear",
    "subCategory": "Shawls",
    "material": "Georgette",
    "fit": "Slim Fit",
    "gender": "Women",
    "price": 4960,
    "originalPrice": 7440,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?sig=o_49&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Silver"
    ],
    "inventory": 19,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 9
  },
  {
    "name": "StyleAI Essentials Cozy Pink Leather Jackets 51",
    "description": "A warm and highly functional Leather Jackets layering option. Tailored using premium Cotton fibres in a relaxed Oversized profile. Designed to protect and elevate winter styling configurations.",
    "brand": "StyleAI Essentials",
    "category": "Outerwear",
    "subCategory": "Leather Jackets",
    "material": "Cotton",
    "fit": "Oversized",
    "gender": "Men",
    "price": 5200,
    "originalPrice": 7800,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1544923246-77307dd654cb?sig=o_50&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Pink"
    ],
    "inventory": 20,
    "occasionTags": [
      "Party",
      "Casual",
      "Winter"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.6,
    "reviewsCount": 0
  },
  {
    "name": "Royal Heritage Cozy Gold Denim Jackets 52",
    "description": "A warm and highly functional Denim Jackets layering option. Tailored using premium Wool Blend fibres in a relaxed Loose Fit profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Royal Heritage",
    "category": "Outerwear",
    "subCategory": "Denim Jackets",
    "material": "Wool Blend",
    "fit": "Loose Fit",
    "gender": "Unisex",
    "price": 5440,
    "originalPrice": 8160,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?sig=o_51&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Gold"
    ],
    "inventory": 21,
    "occasionTags": [
      "Casual",
      "College",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.7,
    "reviewsCount": 1
  },
  {
    "name": "Graceful Cozy Black Bomber Jackets 53",
    "description": "A warm and highly functional Bomber Jackets layering option. Tailored using premium Polyester Blend fibres in a relaxed Regular profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Graceful",
    "category": "Outerwear",
    "subCategory": "Bomber Jackets",
    "material": "Polyester Blend",
    "fit": "Regular",
    "gender": "Men",
    "price": 5680,
    "originalPrice": 8520,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?sig=o_52&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black"
    ],
    "inventory": 22,
    "occasionTags": [
      "Casual",
      "Airport",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": true,
    "ratings": 4.8,
    "reviewsCount": 2
  },
  {
    "name": "Urban Ethnic Cozy White Trench Coats 54",
    "description": "A warm and highly functional Trench Coats layering option. Tailored using premium Denim Cotton fibres in a relaxed Slim Fit profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Urban Ethnic",
    "category": "Outerwear",
    "subCategory": "Trench Coats",
    "material": "Denim Cotton",
    "fit": "Slim Fit",
    "gender": "Unisex",
    "price": 5920,
    "originalPrice": 8880,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?sig=o_53&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "White"
    ],
    "inventory": 23,
    "occasionTags": [
      "Winter",
      "Formal",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.9,
    "reviewsCount": 3
  },
  {
    "name": "Zara Cozy Green Cardigans 55",
    "description": "A warm and highly functional Cardigans layering option. Tailored using premium Cotton Fleece fibres in a relaxed Oversized profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Zara",
    "category": "Outerwear",
    "subCategory": "Cardigans",
    "material": "Cotton Fleece",
    "fit": "Oversized",
    "gender": "Women",
    "price": 6160,
    "originalPrice": 9240,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1608228088998-57828365d486?sig=o_54&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Green"
    ],
    "inventory": 24,
    "occasionTags": [
      "Winter",
      "Casual",
      "Daily Wear"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.1,
    "reviewsCount": 4
  },
  {
    "name": "Nike Cozy Red Shawls 56",
    "description": "A warm and highly functional Shawls layering option. Tailored using premium Rayon fibres in a relaxed Loose Fit profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Nike",
    "category": "Outerwear",
    "subCategory": "Shawls",
    "material": "Rayon",
    "fit": "Loose Fit",
    "gender": "Women",
    "price": 6400,
    "originalPrice": 9600,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?sig=o_55&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Red"
    ],
    "inventory": 25,
    "occasionTags": [
      "Wedding",
      "Festive",
      "Traditional"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.2,
    "reviewsCount": 5
  },
  {
    "name": "Puma Cozy Blue Leather Jackets 57",
    "description": "A warm and highly functional Leather Jackets layering option. Tailored using premium Satin Silk fibres in a relaxed Regular profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Puma",
    "category": "Outerwear",
    "subCategory": "Leather Jackets",
    "material": "Satin Silk",
    "fit": "Regular",
    "gender": "Men",
    "price": 6640,
    "originalPrice": 9960,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?sig=o_56&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Blue"
    ],
    "inventory": 26,
    "occasionTags": [
      "Party",
      "Casual",
      "Winter"
    ],
    "featured": true,
    "aiRecommended": true,
    "ratings": 4.3,
    "reviewsCount": 6
  },
  {
    "name": "StyleAI Premium Cozy Navy Blue Denim Jackets 58",
    "description": "A warm and highly functional Denim Jackets layering option. Tailored using premium Polyester Sequin fibres in a relaxed Slim Fit profile. Designed to protect and elevate winter styling configurations.",
    "brand": "StyleAI Premium",
    "category": "Outerwear",
    "subCategory": "Denim Jackets",
    "material": "Polyester Sequin",
    "fit": "Slim Fit",
    "gender": "Unisex",
    "price": 6880,
    "originalPrice": 10320,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?sig=o_57&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Navy Blue"
    ],
    "inventory": 27,
    "occasionTags": [
      "Casual",
      "College",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.4,
    "reviewsCount": 7
  },
  {
    "name": "Urban Denim Cozy Charcoal Grey Bomber Jackets 59",
    "description": "A warm and highly functional Bomber Jackets layering option. Tailored using premium Linen fibres in a relaxed Oversized profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Urban Denim",
    "category": "Outerwear",
    "subCategory": "Bomber Jackets",
    "material": "Linen",
    "fit": "Oversized",
    "gender": "Men",
    "price": 7120,
    "originalPrice": 10680,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1544923246-77307dd654cb?sig=o_58&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Charcoal Grey"
    ],
    "inventory": 28,
    "occasionTags": [
      "Casual",
      "Airport",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.5,
    "reviewsCount": 8
  },
  {
    "name": "Executive Wear Cozy Light Blue Trench Coats 60",
    "description": "A warm and highly functional Trench Coats layering option. Tailored using premium Acrylic Wool fibres in a relaxed Loose Fit profile. Designed to protect and elevate winter styling configurations.",
    "brand": "Executive Wear",
    "category": "Outerwear",
    "subCategory": "Trench Coats",
    "material": "Acrylic Wool",
    "fit": "Loose Fit",
    "gender": "Unisex",
    "price": 7360,
    "originalPrice": 11040,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?sig=o_59&w=600&auto=format&fit=crop&q=80"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Light Blue"
    ],
    "inventory": 29,
    "occasionTags": [
      "Winter",
      "Formal",
      "Travel"
    ],
    "featured": false,
    "aiRecommended": false,
    "ratings": 4.6,
    "reviewsCount": 9
  }
];

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
    console.log(`${createdProducts.length} Products Seeded successfully!`.green);

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
    console.error(`Error seeding data: ${error.message}`.red.bold);
    process.exit(1);
  }
};

seedData();
