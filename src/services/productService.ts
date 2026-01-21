import { Prisma } from '@prisma/client';
import slugify from 'slugify';

import { categoryRepository } from '../repositories/categoryRepository';
import { productRepository } from '../repositories/productRepository';
import { AppError } from '../utils/errors';

export const productService = {
  list: async (params: {
    page: number;
    limit: number;
    q?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  }) => {
    const { page, limit, q, category, minPrice, maxPrice, sort } = params;
    const skip = (page - 1) * limit;

    const filters: Prisma.ProductWhereInput = { deletedAt: null };

    if (q) {
      filters.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (category) {
      const found = await categoryRepository.findBySlug(category);
      if (!found) {
        return { items: [], meta: { page, limit, total: 0, pages: 0 } };
      }
      filters.categoryId = found.id;
    }

    if (minPrice || maxPrice) {
      filters.price = {
        gte: minPrice ?? undefined,
        lte: maxPrice ?? undefined,
      };
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    switch (sort) {
      case 'priceAsc':
        orderBy = { price: 'asc' };
        break;
      case 'priceDesc':
        orderBy = { price: 'desc' };
        break;
      case 'popular':
        orderBy = { reviews: { _count: 'desc' } };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
    }

    const [items, total] = await Promise.all([
      productRepository.list(filters, orderBy, skip, limit),
      productRepository.count(filters),
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
  getBySlug: async (slug: string) => {
    const product = await productRepository.findBySlug(slug);
    if (!product) {
      throw new AppError(404, 'NOT_FOUND', 'Product not found');
    }

    const reviewCount = product.reviews.filter((review) => !review.isHidden).length;
    const avgRating = reviewCount
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
      : 0;

    return {
      ...product,
      reviewCount,
      avgRating,
    };
  },
  create: async (data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: string;
    images: { url: string; alt?: string }[];
  }) => {
    const category = await categoryRepository.findById(data.categoryId);
    if (!category) {
      throw new AppError(400, 'INVALID_CATEGORY', 'Category not found');
    }
    const slug = slugify(data.name, { lower: true, strict: true });

    return productRepository.create({
      name: data.name,
      slug,
      description: data.description,
      price: data.price,
      stock: data.stock,
      category: { connect: { id: data.categoryId } },
      images: { create: data.images },
    });
  },
  update: async (id: string, data: {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    categoryId?: string;
    images?: { url: string; alt?: string }[];
  }) => {
    const updateData: Prisma.ProductUpdateInput = {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
    };

    if (data.name) {
      updateData.slug = slugify(data.name, { lower: true, strict: true });
    }

    if (data.categoryId) {
      updateData.category = { connect: { id: data.categoryId } };
    }

    if (data.images) {
      updateData.images = {
        deleteMany: {},
        create: data.images,
      };
    }

    return productRepository.update(id, updateData);
  },
  remove: async (id: string) => {
    await productRepository.softDelete(id);
    return { deleted: true };
  },
};
