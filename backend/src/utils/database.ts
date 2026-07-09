import { PrismaClient } from '@prisma/client';
import redis from 'redis';
import { config } from './config';
import logger from './utils/logger';

let prisma: PrismaClient;
let redisClient: redis.RedisClient;

export const getPrismaClient = (): PrismaClient => {
  if (!prisma) {
    prisma = new PrismaClient();
    logger.info('Prisma Client initialized');
  }
  return prisma;
};

export const getRedisClient = (): redis.RedisClient => {
  if (!redisClient) {
    redisClient = redis.createClient({
      url: config.redisUrl,
    });
    redisClient.connect();
    logger.info('Redis Client initialized');
  }
  return redisClient;
};

export const disconnectDatabases = async () => {
  if (prisma) {
    await prisma.$disconnect();
    logger.info('Prisma Client disconnected');
  }
  if (redisClient) {
    await redisClient.disconnect();
    logger.info('Redis Client disconnected');
  }
};
