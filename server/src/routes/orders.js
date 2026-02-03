const express = require('express');
const router = express.Router();
const { getUserOrders, createOrder, createDirectOrder } = require('../controllers/orderController');
const { verifyUser } = require('../middleware/auth');

router.use(verifyUser);

router.get('/', getUserOrders);

router.post('/', createOrder);

router.post('/direct', createDirectOrder);

module.exports = router;