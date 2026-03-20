const request = require('supertest');

/**
 * MOCK SETUP
 */

// Mock Auth Middleware
jest.mock('../src/middleware/auth', () => ({
  verifyUser: (req, res, next) => {
    req.user = { userId: 1 }; // Simulate user with userId
    next();
  },
  verifyAdmin: (req, res, next) => {
    req.admin = { id: 1 };
    next();
  }
}));

// Mock Data
const mockProduct = {
  id: 1,
  name: 'Test Product',
  price: 100,
  stock: 10,
  categoryId: 1
};

const mockCartItem = {
  id: 1,
  userId: 1,
  productId: 1,
  quantity: 2
};

// Mock Database (Prisma)
jest.mock('../src/lib/prisma', () => {
    return {
      product: {
        findMany: jest.fn().mockResolvedValue([mockProduct]),
        findUnique: jest.fn().mockResolvedValue(mockProduct),
      },
      cart: {
        create: jest.fn().mockResolvedValue(mockCartItem),
        upsert: jest.fn().mockResolvedValue(mockCartItem),
        findUnique: jest.fn().mockResolvedValue(null), // Simulate not in cart initially
        update: jest.fn().mockResolvedValue(mockCartItem),
        findFirst: jest.fn().mockResolvedValue(null), 
      },
      category: {
        findMany: jest.fn().mockResolvedValue([]),
      }
    };
});

// Import app AFTER setting up mocks
const app = require('../src/index');
const prisma = require('../src/lib/prisma'); 

describe('Backend Integration Examples', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Example 4: GET /products
  test('Example 4: GET /products returns mocked product list', async () => {
    const response = await request(app).get('/products');

    expect(response.statusCode).toBe(200);
    // Correct structure: { products: [...] }
    expect(response.body).toHaveProperty('products');
    expect(Array.isArray(response.body.products)).toBeTruthy();
    expect(response.body.products.length).toBe(1);
    expect(response.body.products[0].name).toBe('Test Product');
    
    expect(prisma.product.findMany).toHaveBeenCalled();
  });

  // Example 5: POST /cart
  test('Example 5: POST /cart adds item to cart', async () => {
    const newItem = {
      productId: 1,
      quantity: 2
    };

    const response = await request(app)
      .post('/cart')
      .send(newItem);

    // Expect success
    expect([200, 201]).toContain(response.statusCode);
    
    // Correct structure: { message: '...', cartItem: { ... } }
    expect(response.body).toHaveProperty('cartItem');
    expect(response.body.cartItem).toHaveProperty('id');
    expect(response.body.cartItem.quantity).toBe(2);
  });

});
