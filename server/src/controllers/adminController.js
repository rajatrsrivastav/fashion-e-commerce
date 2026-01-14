// Import Prisma client to interact with database
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Create a new Prisma client instance
const prisma = new PrismaClient();

// Admin Login
// This function checks if admin exists and password is correct
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find admin by email in database
    const admin = await prisma.admin.findUnique({
      where: { email }
    });

    // If admin doesn't exist, return error
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare provided password with hashed password in database
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create a JWT token for authentication
    const token = jwt.sign(
      { adminId: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send success response with token
    res.json({
      message: 'Login successful',
      token,
      admin: { id: admin.id, email: admin.email }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// Register Admin (Optional - for creating first admin)
// In production, you might want to remove this or add more security
const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email }
    });

    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin in database
    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword
      }
    });

    // Send success response (without password)
    res.status(201).json({
      message: 'Admin registered successfully',
      admin: { id: admin.id, email: admin.email }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

// Add a new product (Admin only)
const addProduct = async (req, res) => {
  try {
    const { name, description, price, images, stock, categoryId } = req.body;

    // Validate required fields
    if (!name || !description || !price || !images || !stock || !categoryId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate images array
    if (!Array.isArray(images) || images.length < 3) {
      return res.status(400).json({ error: 'At least 3 images are required' });
    }

    // Create product in database
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        images,
        stock: parseInt(stock),
        categoryId: parseInt(categoryId)
      },
      include: {
        category: true // Include category details in response
      }
    });

    res.status(201).json({
      message: 'Product added successfully',
      product
    });

  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ error: 'Server error while adding product' });
  }
};

// Update an existing product (Admin only)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, images, stock, categoryId } = req.body;

    // Update product in database
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        price: parseFloat(price),
        images,
        stock: parseInt(stock),
        categoryId: parseInt(categoryId)
      },
      include: {
        category: true
      }
    });

    res.json({
      message: 'Product updated successfully',
      product
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Server error while updating product' });
  }
};

// Delete a product (Admin only)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete product from database
    await prisma.product.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Product deleted successfully' });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Server error while deleting product' });
  }
};

// Get all products (Admin view)
const getAllProducts = async (req, res) => {
  try {
    // Fetch all products from database
    const products = await prisma.product.findMany({
      include: {
        category: true // Include category details
      },
      orderBy: {
        createdAt: 'desc' // Newest first
      }
    });

    res.json({ products });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Server error while fetching products' });
  }
};

// Add a new category (Admin only)
const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    // Create category in database
    const category = await prisma.category.create({
      data: { name }
    });

    res.status(201).json({
      message: 'Category added successfully',
      category
    });

  } catch (error) {
    console.error('Add category error:', error);
    res.status(500).json({ error: 'Server error while adding category' });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    // Fetch all categories from database
    const categories = await prisma.category.findMany();

    res.json({ categories });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Server error while fetching categories' });
  }
};

// Export all functions so they can be used in routes
module.exports = {
  login,
  register,
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  addCategory,
  getAllCategories
};
