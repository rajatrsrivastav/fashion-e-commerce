// Category routes - public routes for getting categories
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /categories - Get all categories with product count
router.get('/', productController.getAllCategories);

module.exports = router;
