const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyUser } = require('../middleware/auth');

router.post('/register', userController.register);

router.post('/login', userController.login);

router.get('/profile', verifyUser, userController.getProfile);

router.put('/profile', verifyUser, userController.updateProfile);

module.exports = router;