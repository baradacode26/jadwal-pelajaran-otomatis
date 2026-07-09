import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import logger from './utils/logger';
import { errorHandlerMiddleware, notFoundMiddleware } from './middleware/errorHandler';
import { getPrismaClient, getRedisClient, disconnectDatabases } from './utils/database';

// Routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import scheduleRoutes from './routes/schedule.routes';
import masterDataRoutes from './routes/masterdata.routes';

const app: Express = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`[${req.method}] ${req.path}`);
  next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/schedules', scheduleRoutes);
app.use('/api/v1/master-data', masterDataRoutes);

// 404 handler
app.use(notFoundMiddleware);

// Error handler
app.use(errorHandlerMiddleware);

// Initialize databases
async function initializeDatabases() {
  try {
    const prisma = getPrismaClient();
    await prisma.$queryRaw`SELECT 1`;
    logger.info('Database connection successful');

    const redis = getRedisClient();
    logger.info('Redis connection successful');
  } catch (error) {
    logger.error(`Database initialization error: ${error}`);
    process.exit(1);
  }
}

// Start server
async function startServer() {
  try {
    await initializeDatabases();

    app.listen(config.port, config.host, () => {
      logger.info(`Server running at http://${config.host}:${config.port}`);
      logger.info(`Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    logger.error(`Server startup error: ${error}`);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  await disconnectDatabases();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT signal received: closing HTTP server');
  await disconnectDatabases();
  process.exit(0);
});

startServer();

export default app;
