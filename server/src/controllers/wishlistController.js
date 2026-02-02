// Wishlist management controller
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Add item to wishlist
const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if item already in wishlist
    const existingWishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: userId,
          productId: parseInt(productId)
        }
      }
    });

    if (existingWishlistItem) {
      return res.status(400).json({ error: 'Item already in wishlist' });
    }

    // Add item to wishlist
    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId: userId,
        productId: parseInt(productId)
      },
      include: { product: true }
    });

    res.json({
      message: 'Item added to wishlist successfully',
      wishlistItem
    });

  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user's wishlist
const getWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;

    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId: userId },
      include: {
        product: {
          include: {
            category: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ wishlistItems });

  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Remove item from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    const result = await prisma.wishlist.deleteMany({
      where: {
        userId: userId,
        productId: parseInt(productId)
      }
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Item not found in wishlist' });
    }

    res.json({ message: 'Item removed from wishlist successfully' });

  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Check if product is in wishlist
const checkWishlistStatus = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    const wishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: userId,
          productId: parseInt(productId)
        }
      }
    });

    res.json({ isInWishlist: !!wishlistItem });

  } catch (error) {
    console.error('Check wishlist status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Toggle wishlist status (add if not exists, remove if exists)
const toggleWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if item is in wishlist
    const existingWishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: userId,
          productId: parseInt(productId)
        }
      }
    });

    if (existingWishlistItem) {
      // Remove from wishlist
      await prisma.wishlist.delete({
        where: {
          userId_productId: {
            userId: userId,
            productId: parseInt(productId)
          }
        }
      });

      res.json({
        message: 'Item removed from wishlist',
        isInWishlist: false
      });
    } else {
      // Add to wishlist
      await prisma.wishlist.create({
        data: {
          userId: userId,
          productId: parseInt(productId)
        }
      });

      res.json({
        message: 'Item added to wishlist',
        isInWishlist: true
      });
    }

  } catch (error) {
    console.error('Toggle wishlist error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  checkWishlistStatus,
  toggleWishlist
};