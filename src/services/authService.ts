import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { config } from '../config';
import { refreshTokenRepository } from '../repositories/refreshTokenRepository';
import { userRepository } from '../repositories/userRepository';
import { AppError } from '../utils/errors';
import { generateToken, hashToken } from '../utils/crypto';
import { sendEmail } from './emailService';
import { prisma } from '../utils/prisma';

const createAccessToken = (userId: string, role: 'USER' | 'ADMIN') => {
  return jwt.sign({ role }, config.jwt.accessSecret, {
    subject: userId,
    expiresIn: config.jwt.accessExpiresIn,
  });
};

const createRefreshToken = async (userId: string) => {
  const token = generateToken(32);
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + msToMillis(config.jwt.refreshExpiresIn));
  const record = await refreshTokenRepository.create({
    userId,
    tokenHash,
    expiresAt,
  });
  return { token, recordId: record.id, expiresAt };
};

const msToMillis = (value: string) => {
  if (value.endsWith('d')) return parseInt(value.replace('d', ''), 10) * 24 * 60 * 60 * 1000;
  if (value.endsWith('h')) return parseInt(value.replace('h', ''), 10) * 60 * 60 * 1000;
  if (value.endsWith('m')) return parseInt(value.replace('m', ''), 10) * 60 * 1000;
  return parseInt(value, 10);
};

export const authService = {
  register: async (email: string, password: string) => {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new AppError(409, 'EMAIL_EXISTS', 'Email already registered');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const verificationToken = generateToken(16);
    const verificationHash = hashToken(verificationToken);
    const verificationExpires = new Date(Date.now() + 1000 * 60 * 60 * 24);

    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          email,
          passwordHash,
          emailVerificationTokenHash: verificationHash,
          emailVerificationExpires: verificationExpires,
        },
      });
      await tx.cart.create({ data: { userId: created.id } });
      return created;
    });

    await sendEmail({
      to: email,
      subject: 'Verify your email',
      html: `Use this token to verify your email: ${verificationToken}`,
    });

    return { id: user.id, email: user.email };
  },
  login: async (email: string, password: string) => {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    const accessToken = createAccessToken(user.id, user.role);
    const refreshToken = await createRefreshToken(user.id);

    return {
      user: { id: user.id, email: user.email, role: user.role, isEmailVerified: user.isEmailVerified },
      tokens: { accessToken, refreshToken: refreshToken.token, refreshTokenExpiresAt: refreshToken.expiresAt },
    };
  },
  verifyEmail: async (email: string, token: string) => {
    const user = await userRepository.findByEmail(email);
    if (!user || !user.emailVerificationTokenHash || !user.emailVerificationExpires) {
      throw new AppError(400, 'INVALID_TOKEN', 'Invalid verification token');
    }

    const tokenHash = hashToken(token);
    if (tokenHash !== user.emailVerificationTokenHash || user.emailVerificationExpires < new Date()) {
      throw new AppError(400, 'INVALID_TOKEN', 'Invalid verification token');
    }

    await userRepository.update(user.id, {
      isEmailVerified: true,
      emailVerificationTokenHash: null,
      emailVerificationExpires: null,
    });

    return { verified: true };
  },
  forgotPassword: async (email: string) => {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return { sent: true };
    }

    const resetToken = generateToken(16);
    const resetHash = hashToken(resetToken);
    const resetExpires = new Date(Date.now() + 1000 * 60 * 60);

    await userRepository.update(user.id, {
      resetPasswordTokenHash: resetHash,
      resetPasswordExpires: resetExpires,
    });

    await sendEmail({
      to: email,
      subject: 'Reset your password',
      html: `Use this token to reset your password: ${resetToken}`,
    });

    return { sent: true };
  },
  resetPassword: async (email: string, token: string, newPassword: string) => {
    const user = await userRepository.findByEmail(email);
    if (!user || !user.resetPasswordTokenHash || !user.resetPasswordExpires) {
      throw new AppError(400, 'INVALID_TOKEN', 'Invalid reset token');
    }

    const tokenHash = hashToken(token);
    if (tokenHash !== user.resetPasswordTokenHash || user.resetPasswordExpires < new Date()) {
      throw new AppError(400, 'INVALID_TOKEN', 'Invalid reset token');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await userRepository.update(user.id, {
      passwordHash,
      resetPasswordTokenHash: null,
      resetPasswordExpires: null,
    });

    return { reset: true };
  },
};
