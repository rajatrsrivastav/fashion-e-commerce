const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyAdmin } = require('../middleware/auth');

router.post('/login', adminController.login);

router.post('/register', adminController.register);

router.post('/products', verifyAdmin, adminController.addProduct);

router.put('/products/:id', verifyAdmin, adminController.updateProduct);

router.delete('/products/:id', verifyAdmin, adminController.deleteProduct);

router.get('/products', verifyAdmin, adminController.getAllProducts);

router.post('/categories', verifyAdmin, adminController.addCategory);

router.get('/categories', verifyAdmin, adminController.getAllCategories);

module.exports = router;
