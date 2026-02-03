const prisma = require('../lib/prisma');

const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    const existingCartItem = await prisma.cart.findUnique({
      where: {
        userId_productId: {
          userId: userId,
          productId: parseInt(productId)
        }
      }
    });

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + parseInt(quantity);
      if (newQuantity > product.stock) {
        return res.status(400).json({ error: 'Insufficient stock' });
      }

      const cartItem = await prisma.cart.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity },
        include: { product: true }
      });

      return res.json({
        message: 'Cart updated successfully',
        cartItem
      });
    } else {
      const cartItem = await prisma.cart.create({
        data: {
          userId: userId,
          productId: parseInt(productId),
          quantity: parseInt(quantity)
        },
        include: { product: true }
      });

      return res.json({
        message: 'Item added to cart successfully',
        cartItem
      });
    }

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cartItems = await prisma.cart.findMany({
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

    res.json({ cartItems });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Valid quantity is required' });
    }

    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    const cartItem = await prisma.cart.updateMany({
      where: {
        userId: userId,
        productId: parseInt(productId)
      },
      data: { quantity: parseInt(quantity) }
    });

    if (cartItem.count === 0) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    res.json({ message: 'Cart item updated successfully' });

  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    const result = await prisma.cart.deleteMany({
      where: {
        userId: userId,
        productId: parseInt(productId)
      }
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    res.json({ message: 'Item removed from cart successfully' });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    await prisma.cart.deleteMany({
      where: { userId: userId }
    });

    res.json({ message: 'Cart cleared successfully' });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart
};