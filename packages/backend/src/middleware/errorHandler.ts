import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '@/types';

export function errorHandler(
  err: Error & { statusCode?: number; message?: string },
  _req: Request,
  res: Response<ApiResponse>,
  _next: NextFunction
): void {
  if (res.headersSent) {
    return;
  }
  const statusCode = err.statusCode || 500;
  const message = err.message || '服务器内部错误';

  res.status(statusCode).json({
    code: statusCode,
    message,
    data: null,
  });
}

export function createError(message: string, statusCode: number): Error & { statusCode: number; message: string } {
  const error = new Error(message) as Error & { statusCode: number; message: string };
  error.statusCode = statusCode;
  error.message = message;
  return error;
}
