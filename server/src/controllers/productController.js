// Import Prisma client to interact with database
const { PrismaClient } = require('@prisma/client');

// Create a new Prisma client instance
const prisma = new PrismaClient();

// Get all products (Public - no auth required)
// This is what users see on the shop page
const getAllProducts = async (req, res) => {
  try {
    // Check if filtering by category
    const { category } = req.query;

    // Build query conditions
    const where = {};
    if (category) {
      // If it's a number, filter by categoryId
      if (!isNaN(category)) {
        where.categoryId = parseInt(category);
      } else {
        // If it's a string, filter by category name
        where.category = {
          name: category
        };
      }
    }

    // Fetch products from database
    const products = await prisma.product.findMany({
      where,
      include: {
        category: true // Include category name with each product
      },
      orderBy: {
        createdAt: 'desc' // Show newest products first
      }
    });

    res.json({ products });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Server error while fetching products' });
  }
};

// Get single product by ID (Public)
// This is for the product detail page
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find product by ID in database
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true // Include category details
      }
    });

    // If product doesn't exist
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Server error while fetching product' });
  }
};

// Get all categories (Public)
// Used for showing category filters
const getAllCategories = async (req, res) => {
  try {
    // Fetch all categories from database
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true } // Count products in each category
        }
      }
    });

    res.json({ categories });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Server error while fetching categories' });
  }
};

// Export all functions so they can be used in routes
module.exports = {
  getAllProducts,
  getProductById,
  getAllCategories
};
