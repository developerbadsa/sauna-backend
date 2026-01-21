import slugify from 'slugify';

import { categoryRepository } from '../repositories/categoryRepository';
import { AppError } from '../utils/errors';

export const categoryService = {
  list: () => categoryRepository.list(),
  create: async (name: string) => {
    const slug = slugify(name, { lower: true, strict: true });
    const existing = await categoryRepository.findBySlug(slug);
    if (existing) {
      throw new AppError(409, 'CATEGORY_EXISTS', 'Category already exists');
    }
    return categoryRepository.create({ name, slug });
  },
  remove: async (id: string) => {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new AppError(404, 'NOT_FOUND', 'Category not found');
    }
    const count = await categoryRepository.countProducts(id);
    if (count > 0) {
      throw new AppError(400, 'CATEGORY_IN_USE', 'Cannot delete category with products');
    }
    await categoryRepository.delete(id);
    return { deleted: true };
  },
};
