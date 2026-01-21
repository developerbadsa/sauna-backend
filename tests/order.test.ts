import request from 'supertest';

import { app, cleanupDb, createUserAndLogin } from './testUtils';
import { prisma } from '../src/utils/prisma';

beforeAll(async () => {
  await cleanupDb();
});

afterAll(async () => {
  await cleanupDb();
});

describe('Order flow', () => {
  it('creates an order from cart', async () => {
    const category = await prisma.category.create({
      data: { name: 'Wellness', slug: 'wellness' },
    });
    const product = await prisma.product.create({
      data: {
        name: 'Sauna Stone',
        slug: 'sauna-stone',
        description: 'Heat safe stone',
        price: 25,
        stock: 10,
        categoryId: category.id,
      },
    });

    const { token, userId } = await createUserAndLogin();

    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (cart) {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId: product.id, quantity: 1 },
      });
    }

    const response = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Jane Doe',
        address1: '123 Main St',
        city: 'Toronto',
        postalCode: 'M5V 2T6',
        country: 'Canada',
      });

    expect(response.status).toBe(200);
    expect(response.body.data.items.length).toBeGreaterThan(0);
  });
});
