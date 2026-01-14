// Product routes - public routes for users to view products
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// All these routes are public (no authentication required)

// GET /products - Get all products (can filter by category using ?category=1)
router.get('/', productController.getAllProducts);

// GET /products/:id - Get single product details
router.get('/:id', productController.getProductById);

// GET /categories - Get all categories
router.get('/categories', productController.getAllCategories);

module.exports = router;
