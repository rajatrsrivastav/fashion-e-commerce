const express = require('express');
const router = express.Router();
const { getUserOrders, createOrder } = require('../controllers/orderController');
const { verifyUser } = require('../middleware/auth');

// All order routes require user authentication
router.use(verifyUser);

// Get user's orders
router.get('/', getUserOrders);

// Create order from cart
router.post('/', createOrder);

module.exports = router;