import { Response } from 'express';
import { PaginatedResponse, ApiResponse } from '../types';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  } as ApiResponse<T>);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 400,
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: message,
  });
};

export const sendPaginated = <T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
  message: string = 'Success',
  statusCode: number = 200,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data: {
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    } as PaginatedResponse<T>,
  });
};
