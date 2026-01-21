import request from 'supertest';

import { app, cleanupDb, createUserAndLogin } from './testUtils';
import { prisma } from '../src/utils/prisma';

beforeAll(async () => {
  await cleanupDb();
});

afterAll(async () => {
  await cleanupDb();
});

describe('Cart flow', () => {
  it('adds item to cart', async () => {
    const category = await prisma.category.create({
      data: { name: 'Accessories', slug: 'accessories' },
    });
    const product = await prisma.product.create({
      data: {
        name: 'Towel',
        slug: 'towel',
        description: 'Soft towel',
        price: 12.5,
        stock: 20,
        categoryId: category.id,
      },
    });

    const { token } = await createUserAndLogin();

    const response = await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product.id, quantity: 2 });

    expect(response.status).toBe(200);
  });
});
