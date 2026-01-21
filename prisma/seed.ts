import bcrypt from 'bcryptjs';

import { prisma } from '../src/utils/prisma';

async function main() {
  const adminEmail = 'admin@example.com';
  const passwordHash = await bcrypt.hash('AdminPass123!', 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      role: 'ADMIN',
      isEmailVerified: true,
    },
  });

  const categories = await prisma.category.createMany({
    data: [
      { name: 'Sauna Accessories', slug: 'sauna-accessories' },
      { name: 'Essential Oils', slug: 'essential-oils' },
      { name: 'Wellness', slug: 'wellness' },
    ],
    skipDuplicates: true,
  });

  const category = await prisma.category.findFirst({
    where: { slug: 'sauna-accessories' },
  });

  if (category) {
    await prisma.product.create({
      data: {
        name: 'Premium Sauna Bucket',
        slug: 'premium-sauna-bucket',
        description: 'Handcrafted cedar bucket with ladle.',
        price: 129.99,
        stock: 50,
        categoryId: category.id,
        images: {
          create: [{ url: 'https://example.com/bucket.jpg', alt: 'Cedar bucket' }],
        },
      },
    });
  }

  await prisma.cart.upsert({
    where: { userId: admin.id },
    update: {},
    create: { userId: admin.id },
  });

  console.log('Seed completed', { admin: admin.email, categories: categories.count });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
