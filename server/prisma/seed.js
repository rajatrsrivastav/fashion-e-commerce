const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.admin.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      password: hashedPassword,
    },
  });

  console.log('Admin user created:', admin.email);

  const categories = [
    { name: 'Sleeveless', imageUrl: '/SLEVELESS.png' },
    { name: 'ANIME', imageUrl: '/ANIME.png' },
    { name: 'Hoodies', imageUrl: '/Hoodies.png' },
    { name: 'T-Shirts', imageUrl: '/T-Shirts.png' },
    { name: 'New Arrivals', imageUrl: '/NEW_ARRIVALS.png' },
    { name: 'Accessories', imageUrl: '/Accessories.png' },
    { name: 'Active Wear', imageUrl: '/HERO.png' },
    { name: 'Vintage', imageUrl: '/VINTAGE.png' },
  ];

  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: { name: categoryData.name },
      update: {},
      create: categoryData,
    });
    console.log('Category created:', category.name);
  }

  const products = [
    {
      name: 'Oversized Black Graphic Tee',
      description: 'Comfortable oversized black t-shirt with graphic print. Perfect for casual wear.',
      price: 1499,
      images: ['/BLACK_TEE_1.png', '/BALCK_TEE_2.png', '/BLACK_TEE_3.png'],
      stock: 50,
      categoryName: 'T-Shirts',
    },
    {
      name: 'Oversized Maroon Tee',
      description: 'Classic maroon oversized t-shirt made from soft cotton. Great for everyday styling.',
      price: 1299,
      images: ['/MARRRON_TEE_1.png', '/MQARRON_TEE_2.png', '/MARRRON_TEE_3.png'],
      stock: 35,
      categoryName: 'T-Shirts',
    },
    {
      name: 'Oversized Sage Green Tee',
      description: 'Trendy sage green oversized t-shirt with a relaxed fit. Ideal for modern looks.',
      price: 1399,
      images: ['/GREEN_TEE_1.png', '/GREEN_TEE_2.png', '/GREEN_TEE_3.png'],
      stock: 42,
      categoryName: 'New Arrivals',
    },
    {
      name: 'Classic White Hoodie',
      description: 'Essential white hoodie made from premium fleece. Comfortable and versatile.',
      price: 2499,
      images: ['/WHITE_HODDIE_1.png', '/WHITE_HODDIE_2.png', '/WHITE_HOODIE_3.png'],
      stock: 25,
      categoryName: 'Hoodies',
    },
    {
      name: 'Minimalist Grey Cap',
      description: 'Clean and simple grey baseball cap. Perfect accessory for any outfit.',
      price: 999,
      images: ['/CAP_1.png', '/CAP_2.png', '/CAP_3.png'],
      stock: 60,
      categoryName: 'Accessories',
    },
    {
      name: 'Pro Active Performance Set',
      description: 'High-performance active wear set for intense workouts. Breathable and flexible fabric.',
      price: 2999,
      images: ['/BLACK_TEE_1.png', '/BALCK_TEE_2.png', '/BLACK_TEE_3.png'],
      stock: 45,
      categoryName: 'Active Wear',
    },
    {
      name: 'Vintage Denim Jacket',
      description: 'Classic vintage denim jacket with distressed details. Perfect for layering and street style.',
      price: 3499,
      images: ['/VINTAGE_JACKET_1.png', '/VINTAGE_JACKET_2.png', '/VINTAGE_JACKET_3.png'],
      stock: 20,
      categoryName: 'Vintage',
    },
    {
      name: 'Athletic Performance Tee',
      description: 'Moisture-wicking athletic tee designed for active lifestyles. Comfortable and durable.',
      price: 1799,
      images: ['/ACTIVE_WEAR_1.png', '/ACTIVE_WEAR_2.png', '/ACTIVE_WEAR_3.png'],
      stock: 55,
      categoryName: 'Active Wear',
    },
    {
      name: 'Graphic Print Hoodie',
      description: 'Stylish hoodie with bold graphic prints. Made from soft cotton blend for all-day comfort.',
      price: 2799,
      images: ['/GRAPHIC_HOODIE_1.png', '/GRAPHIC_HOODIE_2.png', '/GRAPHIC_HOODIE_3.png'],
      stock: 30,
      categoryName: 'Hoodies',
    },
  ];

  for (const productData of products) {
    const category = await prisma.category.findUnique({
      where: { name: productData.categoryName },
    });

    if (category) {
      const product = await prisma.product.upsert({
        where: { id: (await prisma.product.findFirst({ where: { name: productData.name } }))?.id || -1 },
        update: {},
        create: {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          images: productData.images,
          stock: productData.stock,
          categoryId: category.id,
        },
      });
      console.log('Product created:', product.name);
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });