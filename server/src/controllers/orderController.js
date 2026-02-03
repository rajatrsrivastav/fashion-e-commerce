const prisma = require('../lib/prisma');

const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedOrders = orders.map(order => ({
      id: `VYR-${order.createdAt.getFullYear()}-${String(order.id).padStart(6, '0')}`,
      date: order.createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      status: order.status.toLowerCase(),
      total: order.totalAmount,
      items: order.items.map(item => ({
        id: item.id.toString(),
        title: item.product.name,
        image: item.product.images[0] || '',
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.price
      })),
      address: order.shippingAddress,
      trackingSteps: generateTrackingSteps(order.status, order.createdAt)
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ error: 'Shipping address is required' });
    }

    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: { product: true }
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    for (const item of cartItems) {
      if (item.quantity > item.product.stock) {
        return res.status(400).json({
          error: `Insufficient stock for ${item.product.name}. Available: ${item.product.stock}`
        });
      }
    }

    const totalAmount = cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    const result = await prisma.$transaction(async (prisma) => {
      const order = await prisma.order.create({
        data: {
          userId,
          totalAmount,
          shippingAddress,
          status: 'PENDING',
          items: {
            create: cartItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
              size: item.size,
              color: item.color
            }))
          }
        },
        include: {
          items: {
            include: { product: true }
          }
        }
      });

      for (const item of cartItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      await prisma.cart.deleteMany({
        where: { userId }
      });

      return order;
    });

    const formattedOrder = {
      id: `VYR-${result.createdAt.getFullYear()}-${String(result.id).padStart(6, '0')}`,
      date: result.createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      status: result.status.toLowerCase(),
      total: result.totalAmount,
      items: result.items.map(item => ({
        id: item.id.toString(),
        title: item.product.name,
        image: item.product.images[0] || '',
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.price
      })),
      address: result.shippingAddress,
      trackingSteps: generateTrackingSteps(result.status, result.createdAt)
    };

    res.status(201).json(formattedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

function generateTrackingSteps(status, createdAt) {
  const steps = [
    { status: 'Order Placed', date: createdAt.toLocaleDateString(), completed: true },
    { status: 'Processing', date: createdAt.toLocaleDateString(), completed: false },
    { status: 'Shipped', date: '', completed: false },
    { status: 'Out for Delivery', date: '', completed: false },
    { status: 'Delivered', date: '', completed: false }
  ];

  const statusIndex = {
    'PENDING': 0,
    'PROCESSING': 1,
    'SHIPPED': 2,
    'DELIVERED': 4,
    'CANCELLED': -1
  };

  const currentIndex = statusIndex[status] || 0;

  for (let i = 0; i < steps.length; i++) {
    steps[i].completed = i <= currentIndex;
    if (i > 0 && steps[i].completed && !steps[i].date) {
      const date = new Date(createdAt);
      date.setDate(date.getDate() + i);
      steps[i].date = date.toLocaleDateString();
    }
  }

  return steps;
}

const createDirectOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity, shippingAddress } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ error: 'Shipping address is required' });
    }

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ error: 'Product ID and valid quantity are required' });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        error: `Insufficient stock for ${product.name}. Available: ${product.stock}`
      });
    }

    const totalAmount = product.price * quantity;

    const result = await prisma.$transaction(async (prisma) => {
      const order = await prisma.order.create({
        data: {
          userId,
          totalAmount,
          shippingAddress,
          status: 'PENDING',
          items: {
            create: {
              productId: productId,
              quantity: quantity,
              price: product.price,
              size: 'M',
              color: 'Standard'
            }
          }
        },
        include: {
          items: {
            include: { product: true }
          }
        }
      });

      await prisma.product.update({
        where: { id: productId },
        data: { stock: { decrement: quantity } }
      });

      return order;
    });

    const formattedOrder = {
      id: `VYR-${result.createdAt.getFullYear()}-${String(result.id).padStart(6, '0')}`,
      date: result.createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      status: result.status.toLowerCase(),
      total: result.totalAmount,
      items: result.items.map(item => ({
        id: item.id.toString(),
        title: item.product.name,
        image: item.product.images[0] || '',
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.price
      })),
      address: result.shippingAddress,
      trackingSteps: generateTrackingSteps(result.status, result.createdAt)
    };

    res.status(201).json(formattedOrder);
  } catch (error) {
    console.error('Error creating direct order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

module.exports = {
  getUserOrders,
  createOrder,
  createDirectOrder
};