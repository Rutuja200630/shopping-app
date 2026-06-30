import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

/**
 * Helper to build dynamic CloudinaryStorage configurations
 * @param {string} folderName - Target folder on Cloudinary
 * @returns {CloudinaryStorage} Configured storage instance
 */
const createStorage = (folderName) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folderName,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ quality: 'auto' }]
    }
  });
};

/**
 * File filter to ensure only valid images are uploaded
 */
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, PNG, and WEBP images are allowed.'), false);
  }
};

// 5MB max file size limit
const limits = {
  fileSize: 5 * 1024 * 1024
};

// Reusable upload middlewares for different scopes
export const uploadProducts = multer({
  storage: createStorage('products'),
  fileFilter,
  limits
});

export const uploadBuyerConnect = multer({
  storage: createStorage('buyer-connect'),
  fileFilter,
  limits
});

export const uploadAvatars = multer({
  storage: createStorage('avatars'),
  fileFilter,
  limits
});

/**
 * Middleware to parse text fields from multipart/form-data into arrays/objects
 * before express-validator checks them.
 */
export const parseMultipartProductForm = (req, res, next) => {
  if (typeof req.body.sizes === 'string') {
    try {
      req.body.sizes = JSON.parse(req.body.sizes);
    } catch {
      req.body.sizes = req.body.sizes.split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  if (typeof req.body.colors === 'string') {
    try {
      req.body.colors = JSON.parse(req.body.colors);
    } catch {
      req.body.colors = req.body.colors.split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  if (typeof req.body.occasionTags === 'string') {
    try {
      req.body.occasionTags = JSON.parse(req.body.occasionTags);
    } catch {
      req.body.occasionTags = req.body.occasionTags.split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  if (typeof req.body.images === 'string') {
    try {
      req.body.images = JSON.parse(req.body.images);
    } catch {
      req.body.images = req.body.images.split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  if (typeof req.body.imagePublicIds === 'string') {
    try {
      req.body.imagePublicIds = JSON.parse(req.body.imagePublicIds);
    } catch {
      req.body.imagePublicIds = req.body.imagePublicIds.split(',').map(s => s.trim()).filter(Boolean);
    }
  }

  // Ensure arrays only if multipart/form-data request
  const contentType = req.headers['content-type'] || '';
  const isMultipart = contentType.includes('multipart/form-data');

  if (isMultipart) {
    if (!req.body.images) req.body.images = [];
    if (!req.body.imagePublicIds) req.body.imagePublicIds = [];

    if (req.files && req.files.length > 0) {
      const urls = req.files.map(f => f.path);
      const publicIds = req.files.map(f => f.filename);
      req.body.images = [...req.body.images, ...urls];
      req.body.imagePublicIds = [...req.body.imagePublicIds, ...publicIds];
    }
  } else {
    if (req.files && req.files.length > 0) {
      if (!req.body.images) req.body.images = [];
      if (!req.body.imagePublicIds) req.body.imagePublicIds = [];
      const urls = req.files.map(f => f.path);
      const publicIds = req.files.map(f => f.filename);
      req.body.images = [...req.body.images, ...urls];
      req.body.imagePublicIds = [...req.body.imagePublicIds, ...publicIds];
    }
  }

  next();
};
