import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';

import { createApp } from '../src/app';
import { prisma } from '../src/utils/prisma';

export const app = createApp();

export const createUserAndLogin = async () => {
  const email = `user-${uuidv4()}@example.com`;
  const password = 'Password123!';

  await request(app).post('/api/auth/register').send({ email, password });
  const response = await request(app).post('/api/auth/login').send({ email, password });

  return { email, password, token: response.body.data.tokens.accessToken, userId: response.body.data.user.id };
};

export const cleanupDb = async () => {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.supportMessage.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
};
