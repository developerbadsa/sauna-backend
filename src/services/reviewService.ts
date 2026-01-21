import { reviewRepository } from '../repositories/reviewRepository';
import { AppError } from '../utils/errors';

export const reviewService = {
  list: async (productId: string, page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      reviewRepository.listByProduct(productId, skip, limit),
      reviewRepository.countByProduct(productId),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },
  create: async (userId: string, productId: string, rating: number, comment?: string) => {
    const existing = await reviewRepository.findByUserProduct(userId, productId);
    if (existing) {
      throw new AppError(409, 'REVIEW_EXISTS', 'You already reviewed this product');
    }

    return reviewRepository.create({ userId, productId, rating, comment });
  },
  update: async (id: string, data: { rating?: number; comment?: string; isHidden?: boolean }) => {
    return reviewRepository.update(id, data);
  },
};
