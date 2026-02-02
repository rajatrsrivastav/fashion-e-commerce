// Wishlist management routes
const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { verifyUser } = require('../middleware/auth');

// All wishlist routes require user authentication
// POST /wishlist - Add item to wishlist
router.post('/', verifyUser, wishlistController.addToWishlist);

// PUT /wishlist/toggle - Toggle wishlist status (add/remove)
router.put('/toggle', verifyUser, wishlistController.toggleWishlist);

// GET /wishlist - Get user's wishlist
router.get('/', verifyUser, wishlistController.getWishlist);

// DELETE /wishlist/:productId - Remove item from wishlist
router.delete('/:productId', verifyUser, wishlistController.removeFromWishlist);

// GET /wishlist/:productId/check - Check if product is in wishlist
router.get('/:productId/check', verifyUser, wishlistController.checkWishlistStatus);

module.exports = router;