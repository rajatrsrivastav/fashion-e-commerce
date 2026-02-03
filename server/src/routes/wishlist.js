const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { verifyUser } = require('../middleware/auth');

router.post('/', verifyUser, wishlistController.addToWishlist);

router.put('/:productId', verifyUser, wishlistController.toggleWishlist);

router.get('/', verifyUser, wishlistController.getWishlist);

router.delete('/:productId', verifyUser, wishlistController.removeFromWishlist);

router.get('/:productId/check', verifyUser, wishlistController.checkWishlistStatus);

module.exports = router;