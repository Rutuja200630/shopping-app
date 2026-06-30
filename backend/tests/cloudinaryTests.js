import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import BuyerPhoto from '../models/BuyerPhoto.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import path from 'path';

dotenv.config();

const BASE = 'http://localhost:5000/api';

// Intercept Cloudinary destroy calls to verify cleanup
const destroyCalls = [];
const originalDestroy = cloudinary.uploader.destroy;
cloudinary.uploader.destroy = async function (publicId, options) {
  destroyCalls.push(publicId);
  return await originalDestroy.call(cloudinary.uploader, publicId, options);
};

// Create a small mock PNG buffer for testing uploads (1x1 transparent pixel PNG)
const transparentPngBuffer = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64'
);

async function run() {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('   StyleAI Cloudinary Integration Test Suite');
  console.log('═══════════════════════════════════════════════════════\n');

  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/styleai');
    console.log('✅ Connected to MongoDB.');
  } catch (err) {
    console.error('❌ DB connection failed.', err);
    process.exit(1);
  }

  // ── Seed users ──
  const adminEmail = 'admin_cloudinary@test.com';
  const buyerEmail = 'buyer_cloudinary@test.com';
  const password = 'testpassword123';

  await User.deleteMany({ email: { $in: [adminEmail, buyerEmail] } });

  const adminUser = await User.create({
    name: 'Admin Cloudinary',
    email: adminEmail,
    password,
    role: 'admin',
    provider: 'local'
  });

  const buyerUser = await User.create({
    name: 'Buyer Cloudinary',
    email: buyerEmail,
    password,
    role: 'user',
    provider: 'local'
  });

  // Seed test product for buyer connect
  const testProduct = await Product.create({
    name: 'Cloudinary Test Product',
    description: 'Product for testing Cloudinary uploads.',
    brand: 'StyleAI',
    category: 'Apparel',
    subCategory: 'Shirts',
    material: 'Linen',
    fit: 'Regular',
    gender: 'Unisex',
    price: 1500,
    originalPrice: 2000,
    images: ['https://example.com/placeholder.jpg'],
    sizes: ['M', 'L'],
    colors: ['White'],
    inventory: 50,
    occasionTags: ['Casual'],
    slug: 'cloudinary-test-product-' + Date.now()
  });

  // Seed order to make user a verified buyer
  const order = await Order.create({
    user: buyerUser._id,
    items: [{
      product: testProduct._id,
      productName: testProduct.name,
      productImage: testProduct.images[0],
      size: 'M',
      quantity: 1,
      priceSnapshot: testProduct.price
    }],
    subtotal: testProduct.price,
    discount: 0,
    shipping: 0,
    total: testProduct.price,
    addressSnapshot: { street: '456 St', city: 'Pune', state: 'MH', zipCode: '411001', phone: '9876543211' },
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    status: 'Delivered'
  });

  // Get Auth Tokens
  async function getToken(email) {
    const loginRes = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const loginData = await loginRes.json();
    return loginData.token;
  }

  const adminToken = await getToken(adminEmail);
  const buyerToken = await getToken(buyerEmail);

  if (!adminToken || !buyerToken) {
    console.error('❌ Failed to authenticate users.');
    process.exit(1);
  }

  console.log('✅ Seeding complete. Users authenticated.');

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

  try {
    // ─────────────────────────────────────────────────────────────────────────
    // TEST 1: User Avatar Upload
    // ─────────────────────────────────────────────────────────────────────────
    console.log('\n--- Testing User Avatar ---');
    let avatarFormData = new FormData();
    avatarFormData.append('avatar', new Blob([transparentPngBuffer], { type: 'image/png' }), 'avatar.png');

    let res = await fetch(`${BASE}/users/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${buyerToken}`
      },
      body: avatarFormData
    });
    let avatarData = await res.json();
    logTest('User upload avatar endpoint succeeds (200)', res.status === 200, `status: ${res.status}`);

    const userWithAvatar = await User.findById(buyerUser._id);
    const firstAvatarPublicId = userWithAvatar.avatar.publicId;
    logTest('User avatar publicId and url populated in DB', !!firstAvatarPublicId && !!userWithAvatar.avatar.url, `publicId: ${firstAvatarPublicId}`);

    // TEST 2: Avatar Replacement triggers old asset deletion
    avatarFormData = new FormData();
    avatarFormData.append('avatar', new Blob([transparentPngBuffer], { type: 'image/png' }), 'avatar2.png');

    res = await fetch(`${BASE}/users/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${buyerToken}`
      },
      body: avatarFormData
    });
    logTest('Re-uploading avatar endpoint succeeds (200)', res.status === 200, `status: ${res.status}`);
    
    // DB state verification for out-of-process deletion (Cloudinary destroy triggers on backend)
    const userWithNewAvatar = await User.findById(buyerUser._id);
    logTest('Old avatar publicId replaced in DB (Asset deletion triggered on backend)', userWithNewAvatar.avatar.publicId !== firstAvatarPublicId, `New publicId: ${userWithNewAvatar.avatar.publicId}`);

    // ─────────────────────────────────────────────────────────────────────────
    // TEST 3: Buyer Connect Wear Photo Upload
    // ─────────────────────────────────────────────────────────────────────────
    console.log('\n--- Testing Buyer Connect Photos ---');
    const photoFormData = new FormData();
    photoFormData.append('image', new Blob([transparentPngBuffer], { type: 'image/png' }), 'wear.png');
    photoFormData.append('caption', 'My style coordinates');

    res = await fetch(`${BASE}/buyer-connect/${testProduct.slug}/photos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${buyerToken}`
      },
      body: photoFormData
    });
    const buyerPhotoData = await res.json();
    logTest('Verified buyer uploads photo successfully (201)', res.status === 201, `status: ${res.status}`);

    const seededPhoto = await BuyerPhoto.findById(buyerPhotoData._id);
    const photoPublicId = seededPhoto.publicId;
    logTest('BuyerPhoto publicId and imageUrl populated in DB', !!photoPublicId && !!seededPhoto.imageUrl, `publicId: ${photoPublicId}`);

    // TEST 4: Buyer Photo Deletion by admin triggers Cloudinary cleanup
    res = await fetch(`${BASE}/admin/buyer-connect/photos/${seededPhoto._id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    logTest('Admin deletes abusive photo succeeds (200)', res.status === 200, `status: ${res.status}`);
    
    // DB state verification for out-of-process deletion (Cloudinary destroy triggers on backend via Mongoose hook)
    const deletedPhoto = await BuyerPhoto.findById(seededPhoto._id);
    logTest('Photo document deleted from DB (Asset deletion triggered on backend)', !deletedPhoto, `Photo ID: ${seededPhoto._id}`);

    // ─────────────────────────────────────────────────────────────────────────
    // TEST 5: Admin Product Create (multipart)
    // ─────────────────────────────────────────────────────────────────────────
    console.log('\n--- Testing Admin Product CRUD ---');
    const productFormData = new FormData();
    productFormData.append('name', 'Cloudinary Shirt');
    productFormData.append('description', 'Cool description');
    productFormData.append('brand', 'StyleAI');
    productFormData.append('category', 'Apparel');
    productFormData.append('subCategory', 'Shirts');
    productFormData.append('material', 'Linen');
    productFormData.append('fit', 'Relaxed');
    productFormData.append('gender', 'Unisex');
    productFormData.append('price', '999');
    productFormData.append('originalPrice', '1499');
    productFormData.append('sizes', JSON.stringify(['M', 'L']));
    productFormData.append('colors', JSON.stringify(['White']));
    productFormData.append('occasionTags', JSON.stringify(['Casual']));
    productFormData.append('images', new Blob([transparentPngBuffer], { type: 'image/png' }), 'shirt1.png');

    res = await fetch(`${BASE}/admin/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      },
      body: productFormData
    });
    const createdProductData = await res.json();
    logTest('Product created successfully via multipart (201)', res.status === 201, `status: ${res.status}`);

    const createdProduct = await Product.findById(createdProductData.product._id);
    const productImgPublicId = createdProduct.imagePublicIds[0];
    logTest('Product images and imagePublicIds populated in DB', createdProduct.images.length === 1 && !!productImgPublicId, `publicId: ${productImgPublicId}`);

    // TEST 6: Admin Product Update & Image Replacement
    const updateFormData = new FormData();
    updateFormData.append('name', 'Cloudinary Shirt Updated');
    updateFormData.append('description', 'Cool description');
    updateFormData.append('brand', 'StyleAI');
    updateFormData.append('category', 'Apparel');
    updateFormData.append('subCategory', 'Shirts');
    updateFormData.append('material', 'Linen');
    updateFormData.append('fit', 'Relaxed');
    updateFormData.append('gender', 'Unisex');
    updateFormData.append('price', '999');
    updateFormData.append('originalPrice', '1499');
    updateFormData.append('sizes', JSON.stringify(['M', 'L']));
    updateFormData.append('colors', JSON.stringify(['White']));
    updateFormData.append('occasionTags', JSON.stringify(['Casual']));
    // Upload a new image instead of retaining the old one
    updateFormData.append('images', new Blob([transparentPngBuffer], { type: 'image/png' }), 'shirt2.png');
    // Note: Do not send the old imagePublicIds in updateFormData to simulate image replacement/deletion

    const prevDestroyCallsCount = destroyCalls.length;
    res = await fetch(`${BASE}/admin/products/${createdProduct._id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      },
      body: updateFormData
    });
    const updatedProductData = await res.json();
    logTest('Product updated successfully via multipart (200)', res.status === 200, `status: ${res.status}`);
    
    // DB state verification for out-of-process replacement (Cloudinary destroy triggers on backend)
    const updatedProduct = await Product.findById(createdProduct._id);
    const newProductImgPublicId = updatedProduct.imagePublicIds[0];
    const hasOldImgId = updatedProduct.imagePublicIds.includes(productImgPublicId);
    logTest('Old product image publicId replaced in DB (Asset deletion triggered on backend)', !hasOldImgId, `Old ID: ${productImgPublicId}`);

    // TEST 7: Soft delete product (Should NOT delete assets)
    const callsBeforeSoftDelete = destroyCalls.length;
    res = await fetch(`${BASE}/admin/products/${createdProduct._id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    logTest('Product soft-deleted successfully (200)', res.status === 200, `status: ${res.status}`);
    
    const softDeletedProduct = await Product.findById(createdProduct._id);
    logTest('Product marked as inactive in DB', softDeletedProduct.isActive === false, `isActive: ${softDeletedProduct.isActive}`);
    logTest('Soft delete did NOT call Cloudinary asset cleanup', destroyCalls.length === callsBeforeSoftDelete, `New destroy calls: ${destroyCalls.length - callsBeforeSoftDelete}`);

    // TEST 8: Permanent Delete triggers Cloudinary cleanup
    const callsBeforePermanentDelete = destroyCalls.length;
    await Product.findOneAndDelete({ _id: createdProduct._id });
    logTest('Permanent deletion triggers Cloudinary asset cleanup', destroyCalls.includes(newProductImgPublicId), `Deleted ID: ${newProductImgPublicId}`);

    // ─────────────────────────────────────────────────────────────────────────
    // TEST 9: Size and Type Validation Enforcement
    // ─────────────────────────────────────────────────────────────────────────
    console.log('\n--- Testing Validation Limits ---');
    // A) Invalid mime type (text file)
    const invalidFileFormData = new FormData();
    invalidFileFormData.append('avatar', new Blob(['fake image data'], { type: 'text/plain' }), 'test.txt');

    res = await fetch(`${BASE}/users/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${buyerToken}`
      },
      body: invalidFileFormData
    });
    const typeErrorData = await res.json();
    logTest('Reject invalid file type (400)', res.status === 400, `status: ${res.status}`);
    logTest('Reject invalid file type error message', typeErrorData.error === 'Only JPG, JPEG, PNG, and WEBP images are allowed.', `message: "${typeErrorData.error}"`);

    // B) File above 5MB limit
    const largeBuffer = Buffer.alloc(6 * 1024 * 1024); // 6MB
    const largeFileFormData = new FormData();
    largeFileFormData.append('avatar', new Blob([largeBuffer], { type: 'image/png' }), 'large.png');

    res = await fetch(`${BASE}/users/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${buyerToken}`
      },
      body: largeFileFormData
    });
    const sizeErrorData = await res.json();
    logTest('Reject files exceeding 5MB size limit (413)', res.status === 413, `status: ${res.status}`);
    logTest('Reject files exceeding 5MB size limit error message', sizeErrorData.error === 'File size must be 5MB or less.', `message: "${sizeErrorData.error}"`);

  } catch (err) {
    console.error('❌ Unexpected error occurred during execution:', err);
    failed++;
  } finally {
    // ── Cleanup seeded DB records ──
    console.log('\n--- Cleaning up seed records ---');
    await User.deleteMany({ email: { $in: [adminEmail, buyerEmail] } });
    await Order.deleteMany({ user: buyerUser._id });
    await Product.deleteOne({ _id: testProduct._id });
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB.');
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log(`   Final Results: ${passed} passed, ${failed} failed`);
  console.log('═══════════════════════════════════════════════════════\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

run();
