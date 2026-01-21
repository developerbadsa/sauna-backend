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

  app.use(helmet());
  app.use(cors({ origin: config.corsOrigin, credentials: true }));
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
