import { Router } from 'express';

import { authRoutes } from './authRoutes';
import { bannerRoutes } from './bannerRoutes';
import { blogRoutes } from './blogRoutes';
import { cartRoutes } from './cartRoutes';
import { categoryRoutes } from './categoryRoutes';
import { orderRoutes } from './orderRoutes';
import { productRoutes } from './productRoutes';
import { reviewRoutes } from './reviewRoutes';
import { supportRoutes } from './supportRoutes';
import { wishlistRoutes } from './wishlistRoutes';

export const apiRoutes = Router();

apiRoutes.use('/auth', authRoutes);
apiRoutes.use('/', productRoutes);
apiRoutes.use('/', categoryRoutes);
apiRoutes.use('/', reviewRoutes);
apiRoutes.use('/', cartRoutes);
apiRoutes.use('/', orderRoutes);
apiRoutes.use('/', wishlistRoutes);
apiRoutes.use('/', supportRoutes);
apiRoutes.use('/', blogRoutes);
apiRoutes.use('/', bannerRoutes);
