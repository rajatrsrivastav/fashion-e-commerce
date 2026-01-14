// User authentication routes
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyUser } = require('../middleware/auth');

// Public routes (no authentication needed)
// POST /auth/register - Register new user
router.post('/register', userController.register);

// POST /auth/login - User login
router.post('/login', userController.login);

// Protected routes (need authentication token)
// GET /auth/profile - Get user profile
router.get('/profile', verifyUser, userController.getProfile);

// PUT /auth/profile - Update user profile
router.put('/profile', verifyUser, userController.updateProfile);

module.exports = router;