import { prisma } from '../utils/prisma';

export const cartRepository = {
  getOrCreate: (userId: string) =>
    prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
      include: { items: { include: { product: true } } },
    }),
  getByUserId: (userId: string) =>
    prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    }),
  addItem: (cartId: string, productId: string, quantity: number) =>
    prisma.cartItem.create({ data: { cartId, productId, quantity } }),
  updateItem: (itemId: string, quantity: number) =>
    prisma.cartItem.update({ where: { id: itemId }, data: { quantity } }),
  removeItem: (itemId: string) => prisma.cartItem.delete({ where: { id: itemId } }),
  findItem: (cartId: string, productId: string) =>
    prisma.cartItem.findUnique({ where: { cartId_productId: { cartId, productId } } }),
  clearCart: (cartId: string) => prisma.cartItem.deleteMany({ where: { cartId } }),
};
