import slugify from 'slugify';

import { blogRepository } from '../repositories/blogRepository';

export const blogService = {
  list: (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    return blogRepository.list(skip, limit);
  },
  getBySlug: (slug: string) => blogRepository.findBySlug(slug),
  create: (data: { title: string; content: string; isPublished?: boolean }) => {
    const slug = slugify(data.title, { lower: true, strict: true });
    return blogRepository.create({
      title: data.title,
      slug,
      content: data.content,
      isPublished: data.isPublished ?? false,
      publishedAt: data.isPublished ? new Date() : null,
    });
  },
};
