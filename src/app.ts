import 'express-async-errors';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { v4 as uuidv4 } from 'uuid';
import swaggerUi from 'swagger-ui-express';

import { config } from './config';
import { swaggerSpec } from './docs/swagger';
import { apiLimiter } from './middlewares/rateLimit';
import { sanitize } from './middlewares/sanitize';
import { errorHandler } from './middlewares/errorHandler';
import { apiRoutes } from './routes';
import { logger } from './utils/logger';

export const createApp = () => {
  const app = express();
  const normalizeOrigin = (value: string) => value.trim().replace(/\/+$/, '').toLowerCase();
  const corsOrigins = config.corsOrigin
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  const allowAnyCorsOrigin = corsOrigins.includes('*');
  const allowedOrigins = new Set(
    corsOrigins
      .filter((origin) => origin !== '*' && !origin.includes('*'))
      .map(normalizeOrigin),
  );
  const wildcardOriginMatchers = corsOrigins
    .filter((origin) => origin !== '*' && origin.includes('*'))
    .map((origin) => {
      const normalizedPattern = normalizeOrigin(origin);
      const escapedPattern = normalizedPattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
      const regexPattern = `^${escapedPattern.replace(/\*/g, '.*')}$`;
      return new RegExp(regexPattern, 'i');
    });

  const isCorsOriginAllowed = (origin?: string) => {
    if (!origin || allowAnyCorsOrigin) {
      return true;
    }

    const normalizedOrigin = normalizeOrigin(origin);
    if (allowedOrigins.has(normalizedOrigin)) {
      return true;
    }

    return wildcardOriginMatchers.some((matcher) => matcher.test(normalizedOrigin));
  };

  const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
      if (isCorsOriginAllowed(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: !allowAnyCorsOrigin,
  };

  app.use(helmet());
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(pinoHttp({
    logger,
    genReqId: (req) => req.headers['x-request-id']?.toString() ?? uuidv4(),
  }));

  app.use(apiLimiter);
  app.use(sanitize);

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/api', apiRoutes);

  app.use(errorHandler);

  return app;
};
