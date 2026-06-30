import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { uploadProducts, parseMultipartProductForm } from '../middleware/upload.js';

import {
  getDashboardStats,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getUsers,
  uploadPlaceholder,
  updateUserRole,
  globalSearch,
  updateProductInventory,
  getAllBuyerConnectContent,
  deleteAbusiveQuestion,
  deleteAbusiveAnswer,
  deleteAbusivePhoto
} from '../controllers/adminController.js';
import {
  productCreateValidator,
  productUpdateValidator,
  orderStatusValidator,
  userRoleUpdateValidator,
  inventoryUpdateValidator
} from '../validators/adminValidator.js';

const router = express.Router();

// ── Role Authorization Guard ──────────────────────────────────────────────────
// Enforce admin-only access for all subsequent routes
router.use(protect);
router.use(restrictTo('admin'));

// ── Dashboard Statistics ──────────────────────────────────────────────────────
router.get('/dashboard', getDashboardStats);

// ── Global Search ─────────────────────────────────────────────────────────────
router.get('/search', globalSearch);

// ── Product Management CRUD ────────────────────────────────────────────────────
router.get('/products', getProducts);
router.post('/products', uploadProducts.array('images', 10), parseMultipartProductForm, productCreateValidator, createProduct);
router.put('/products/:id', uploadProducts.array('images', 10), parseMultipartProductForm, productUpdateValidator, updateProduct);
router.delete('/products/:id', deleteProduct); // soft delete
router.patch('/products/:id/inventory', inventoryUpdateValidator, updateProductInventory);

// ── Order Management ───────────────────────────────────────────────────────────
router.get('/orders', getOrders);
router.get('/orders/:id', getOrderById);
router.patch('/orders/:id/status', orderStatusValidator, updateOrderStatus);

// ── User Management ────────────────────────────────────────────────────────────
router.get('/users', getUsers);
router.patch('/users/:id/role', userRoleUpdateValidator, updateUserRole);

// ── Image Upload Placeholder ───────────────────────────────────────────────────
router.post('/upload', uploadProducts.single('image'), uploadPlaceholder);

// ── Buyer Connect Moderation ───────────────────────────────────────────────────
router.get('/buyer-connect/content', getAllBuyerConnectContent);
router.delete('/buyer-connect/questions/:id', deleteAbusiveQuestion);
router.delete('/buyer-connect/questions/:id/answer', deleteAbusiveAnswer);
router.delete('/buyer-connect/photos/:id', deleteAbusivePhoto);

export default router;
