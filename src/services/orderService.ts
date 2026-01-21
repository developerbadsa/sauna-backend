import { OrderStatus } from '@prisma/client';

import { cartRepository } from '../repositories/cartRepository';
import { orderRepository } from '../repositories/orderRepository';
import { AppError } from '../utils/errors';
import { prisma } from '../utils/prisma';

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['PAID', 'CANCELLED'],
  PAID: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};

export const orderService = {
  createFromCart: async (userId: string, shipping: {
    name: string;
    address1: string;
    address2?: string;
    city: string;
    postalCode: string;
    country: string;
  }) => {
    const cart = await cartRepository.getOrCreate(userId);
    if (cart.items.length === 0) {
      throw new AppError(400, 'EMPTY_CART', 'Cart is empty');
    }

    return prisma.$transaction(async (tx) => {
      const totalAmount = cart.items.reduce(
        (sum, item) => sum + Number(item.product.price) * item.quantity,
        0,
      );

      const order = await tx.order.create({
        data: {
          userId,
          totalAmount,
          currency: 'CAD',
          shippingName: shipping.name,
          shippingAddress1: shipping.address1,
          shippingAddress2: shipping.address2,
          shippingCity: shipping.city,
          shippingPostalCode: shipping.postalCode,
          shippingCountry: shipping.country,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              name: item.product.name,
              price: item.product.price,
              quantity: item.quantity,
            })),
          },
        },
        include: { items: true },
      });

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return order;
    });
  },
  list: async (userId: string, isAdmin: boolean, page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      isAdmin ? orderRepository.listAll(skip, limit) : orderRepository.listByUser(userId, skip, limit),
      isAdmin ? orderRepository.countAll() : orderRepository.countByUser(userId),
    ]);

    return {
      items: orders,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  },
  getById: async (userId: string, isAdmin: boolean, id: string) => {
    const order = await orderRepository.findById(id);
    if (!order) {
      throw new AppError(404, 'NOT_FOUND', 'Order not found');
    }
    if (!isAdmin && order.userId !== userId) {
      throw new AppError(403, 'FORBIDDEN', 'Not allowed to access order');
    }
    return order;
  },
  updateStatus: async (id: string, status: OrderStatus) => {
    const order = await orderRepository.findById(id);
    if (!order) {
      throw new AppError(404, 'NOT_FOUND', 'Order not found');
    }

    const allowed = allowedTransitions[order.status];
    if (!allowed.includes(status)) {
      throw new AppError(400, 'INVALID_STATUS', 'Invalid status transition');
    }

    return orderRepository.updateStatus(id, status);
  },
};
