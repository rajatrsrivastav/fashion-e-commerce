const prisma = require('../lib/prisma');

const getAllProducts = async (req, res) => {
  try {
    const { category } = req.query;

    const where = {};
    if (category) {
      if (!isNaN(category)) {
        where.categoryId = parseInt(category);
      } else {
        where.category = {
          name: category
        };
      }
    }

    const products = await prisma.product.findMany({
      where,
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

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Server error while fetching product' });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    res.json({ categories });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Server error while fetching categories' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getAllCategories
};
