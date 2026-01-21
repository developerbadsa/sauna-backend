import crypto from 'crypto';

export const hashToken = (token: string) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};
