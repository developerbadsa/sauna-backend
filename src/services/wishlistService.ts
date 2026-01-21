import { wishlistRepository } from '../repositories/wishlistRepository';
import { AppError } from '../utils/errors';

export const wishlistService = {
  list: (userId: string) => wishlistRepository.list(userId),
  add: async (userId: string, productId: string) => {
    const existing = await wishlistRepository.findByUserProduct(userId, productId);
    if (existing) {
      throw new AppError(409, 'WISHLIST_EXISTS', 'Product already in wishlist');
    }
    return wishlistRepository.add(userId, productId);
  },
  remove: async (userId: string, id: string) => {
    await wishlistRepository.remove(id, userId);
    return { removed: true };
  },
};
