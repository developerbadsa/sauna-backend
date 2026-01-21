import { cartRepository } from '../repositories/cartRepository';
import { productRepository } from '../repositories/productRepository';
import { AppError } from '../utils/errors';

export const cartService = {
  get: async (userId: string) => {
    const cart = await cartRepository.getOrCreate(userId);
    return cart;
  },
  addItem: async (userId: string, productId: string, quantity: number) => {
    const cart = await cartRepository.getOrCreate(userId);
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Product not found');
    }

    const existing = await cartRepository.findItem(cart.id, productId);
    if (existing) {
      return cartRepository.updateItem(existing.id, existing.quantity + quantity);
    }

    return cartRepository.addItem(cart.id, productId, quantity);
  },
  updateItem: async (userId: string, itemId: string, quantity: number) => {
    const cart = await cartRepository.getOrCreate(userId);
    const item = cart.items.find((cartItem) => cartItem.id === itemId);
    if (!item) {
      throw new AppError(404, 'ITEM_NOT_FOUND', 'Cart item not found');
    }
    return cartRepository.updateItem(itemId, quantity);
  },
  removeItem: async (userId: string, itemId: string) => {
    const cart = await cartRepository.getOrCreate(userId);
    const item = cart.items.find((cartItem) => cartItem.id === itemId);
    if (!item) {
      throw new AppError(404, 'ITEM_NOT_FOUND', 'Cart item not found');
    }
    await cartRepository.removeItem(itemId);
    return { removed: true };
  },
};
