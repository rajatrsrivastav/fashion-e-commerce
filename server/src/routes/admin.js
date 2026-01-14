// Admin routes - protected routes for admin actions
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyAdmin } = require('../middleware/auth');

// Public routes (no authentication needed)
// POST /admin/login - Admin login
router.post('/login', adminController.login);

// POST /admin/register - Register new admin (you might want to protect this in production)
router.post('/register', adminController.register);

// Protected routes (need authentication token)
// These routes require admin to be logged in

// POST /admin/products - Add a new product
router.post('/products', verifyAdmin, adminController.addProduct);

// PUT /admin/products/:id - Update existing product
router.put('/products/:id', verifyAdmin, adminController.updateProduct);

// DELETE /admin/products/:id - Delete a product
router.delete('/products/:id', verifyAdmin, adminController.deleteProduct);

// GET /admin/products - Get all products (admin view)
router.get('/products', verifyAdmin, adminController.getAllProducts);

// POST /admin/categories - Add a new category
router.post('/categories', verifyAdmin, adminController.addCategory);

// GET /admin/categories - Get all categories
router.get('/categories', verifyAdmin, adminController.getAllCategories);

module.exports = router;
