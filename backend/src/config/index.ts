import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.BACKEND_PORT || '5000', 10),
  host: process.env.BACKEND_HOST || 'localhost',
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/jadwal_pelajaran',

  // Redis
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_key_change_in_production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // File Upload
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10),
  allowedUploadTypes: (process.env.ALLOWED_UPLOAD_TYPES || 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').split(','),

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
  logFile: process.env.LOG_FILE || 'logs/app.log',

  // Features
  enableSchedulingAsync: process.env.ENABLE_SCHEDULING_ASYNC !== 'false',
  schedulingTimeout: parseInt(process.env.SCHEDULING_TIMEOUT || '300000', 10), // 5 minutes
};
