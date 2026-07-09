import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';

export const errorHandlerMiddleware = (err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
  logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${err instanceof AppError ? err.statusCode : 500}, Message:: ${err.message}`);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};

export const notFoundMiddleware = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
};
