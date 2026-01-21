import { config } from '../config';
import { logger } from '../utils/logger';

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (payload: EmailPayload) => {
  if (config.env !== 'production') {
    logger.info({ payload }, 'Email dispatch (dev mode)');
    return;
  }

  logger.warn('Email provider not configured for production');
};
