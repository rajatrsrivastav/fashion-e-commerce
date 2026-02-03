// Main server file - This is where everything starts!
// Import required packages
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

// Import routes
const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const wishlistRoutes = require('./routes/wishlist');
const orderRoutes = require('./routes/orders');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// cors() - Allows frontend to make requests to backend
app.use(cors());

// express.json() - Allows server to understand JSON data in requests
app.use(express.json());

// Log all incoming requests (helpful for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
// When someone visits /admin/..., use admin routes
app.use('/admin', adminRoutes);

// When someone visits /products/..., use product routes
app.use('/products', productRoutes);

// When someone visits /categories/..., use category routes
app.use('/categories', categoryRoutes);

// When someone visits /auth/..., use auth routes
app.use('/auth', authRoutes);

// When someone visits /cart/..., use cart routes
app.use('/cart', cartRoutes);

// When someone visits /wishlist/..., use wishlist routes
app.use('/wishlist', wishlistRoutes);

// When someone visits /orders/..., use order routes
app.use('/orders', orderRoutes);

// Health check route - to verify server is running
app.get('/', (req, res) => {
  res.json({ 
    message: 'E-commerce API is running!'
  });
});

// 404 handler - if route doesn't exist
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler - catches any errors
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
  ✅ Server is running!
  🌐 URL: http://localhost:${PORT}
  `);
});
