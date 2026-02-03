const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { verifyUser } = require('../middleware/auth');

router.post('/', verifyUser, cartController.addToCart);

router.get('/', verifyUser, cartController.getCart);

router.put('/:productId', verifyUser, cartController.updateCartItem);

router.delete('/:productId', verifyUser, cartController.removeFromCart);

router.delete('/', verifyUser, cartController.clearCart);

module.exports = router;