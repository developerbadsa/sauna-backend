import { Router } from 'express';

import { authController } from '../controllers/authController';
import { validate } from '../middlewares/validate';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from '../schemas/authSchemas';

export const authRoutes = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register user
 */
authRoutes.post('/register', validate(registerSchema), authController.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login
 */
authRoutes.post('/login', validate(loginSchema), authController.login);

/**
 * @openapi
 * /auth/verify-email:
 *   post:
 *     summary: Verify email
 */
authRoutes.post('/verify-email', validate(verifyEmailSchema), authController.verifyEmail);

/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     summary: Forgot password
 */
authRoutes.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);

/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     summary: Reset password
 */
authRoutes.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);
