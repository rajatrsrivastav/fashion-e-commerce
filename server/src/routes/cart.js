// Cart management routes
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { verifyUser } = require('../middleware/auth');

// All cart routes require user authentication
// POST /cart - Add item to cart
router.post('/', verifyUser, cartController.addToCart);

// GET /cart - Get user's cart
router.get('/', verifyUser, cartController.getCart);

// PUT /cart/:productId - Update cart item quantity
router.put('/:productId', verifyUser, cartController.updateCartItem);

// DELETE /cart/:productId - Remove item from cart
router.delete('/:productId', verifyUser, cartController.removeFromCart);

// DELETE /cart - Clear entire cart
router.delete('/', verifyUser, cartController.clearCart);

module.exports = router;