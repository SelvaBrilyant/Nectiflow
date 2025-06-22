import { PrismaClient } from '../generated/prisma/client';
import cors from 'cors';
import dotenv from 'dotenv';
import type { Express, NextFunction, Request, Response } from 'express';
import express from 'express';
import morgan from 'morgan';
import globalErrorHandler from './utils/global-error-handler';
import { GenericError } from './errors/generic-error';
import userRouter from './router/user.router';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { runSeed } from '../prisma/seed';

dotenv.config();

export const prisma = new PrismaClient();

export const app: Express = express();
const port = process.env.PORT || 3000;

/**
 * Main function to configure and start the Express server.
 */
async function main() {
  await runSeed(prisma);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms'),
  );

  app.get('/', (_req, res) => {
    res.send('⚡️ Healthy server running!');
  });

  app.use('/api/v1', userRouter);

  // swagger docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // 404 route - Handles requests to undefined routes
  app.all('*', (req: Request, _res: Response, next: NextFunction) => {
    const err = new GenericError(
      `Can't find ${req.originalUrl} on the server`,
    );
    next(err);
  });

  // Global error handler middleware - Handles errors throughout the application
  app.use(globalErrorHandler);

  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
}

main()
  .then(async () => {
    await prisma.$connect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });