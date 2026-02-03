const prisma = require('../lib/prisma');

const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

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

const toggleWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const existingWishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: userId,
          productId: parseInt(productId)
        }
      }
    });

    if (existingWishlistItem) {
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