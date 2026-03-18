const express = require('express');
const cors = require('cors');
require('dotenv').config();

const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const wishlistRoutes = require('./routes/wishlist');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = (process.env.FRONTEND_URLS || '')
        .split(',')
        .map((url) => url.trim());
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['ETag', 'Last-Modified'],
  })
);

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use('/admin', adminRoutes);

app.use('/products', productRoutes);

app.use('/categories', categoryRoutes);

app.use('/auth', authRoutes);

app.use('/cart', cartRoutes);

app.use('/wishlist', wishlistRoutes);

app.use('/orders', orderRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Fashion E-commerce API is running!',
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`
  ✅ Server is running!
  URL: http://localhost:${PORT}
  `);
});
