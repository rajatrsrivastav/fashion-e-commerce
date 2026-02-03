const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const admin = await prisma.admin.findUnique({
      where: { email }
    });

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { adminId: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

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

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existingAdmin = await prisma.admin.findUnique({
      where: { email }
    });

    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword
      }
    });

    res.status(201).json({
      message: 'Admin registered successfully',
      admin: { id: admin.id, email: admin.email }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

const addProduct = async (req, res) => {
  try {
    const { name, description, price, images, stock, categoryId } = req.body;

    if (!name || !description || !price || !images || !stock || !categoryId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!Array.isArray(images) || images.length < 3) {
      return res.status(400).json({ error: 'At least 3 images are required' });
    }

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
        category: true
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

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, images, stock, categoryId } = req.body;

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

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Product deleted successfully' });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Server error while deleting product' });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({ products });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Server error while fetching products' });
  }
};

const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

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

const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();

    res.json({ categories });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Server error while fetching categories' });
  }
};

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
