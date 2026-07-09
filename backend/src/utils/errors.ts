export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational: boolean = true,
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (err: any, statusCode: number = 500) => {
  if (err instanceof AppError) {
    return {
      statusCode: err.statusCode,
      message: err.message,
      isOperational: err.isOperational,
    };
  }

  return {
    statusCode,
    message: err.message || 'Internal Server Error',
    isOperational: false,
  };
};
