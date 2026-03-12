import { Request, Response, NextFunction } from 'express';
import Logger from '../config/logger.ts';
import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants.ts';
import { config } from '../config/env.ts';

interface ErrorWithStatus extends Error {
  statusCode?: number;
  code?: string;
}

/**
 * Global error handler with environment-aware responses
 * Sends different error details in development vs production
 */
export const errorHandler = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  
  // Determine error message
  let message = err.message || ERROR_MESSAGES.INTERNAL_ERROR;
  
  // Handle specific error types
  if (err.name === 'AxiosError') {
    const axiosError = err as any;
    if (axiosError.code === 'ECONNABORTED') {
      message = ERROR_MESSAGES.TIMEOUT;
    } else if (!axiosError.response) {
      message = ERROR_MESSAGES.NETWORK_ERROR;
    } else if (axiosError.response?.status === 401) {
      message = 'OMDb API key is invalid or expired';
    }
  }

  // Handle OMDb API specific errors
  if (message.includes('Too many requests')) {
    message = ERROR_MESSAGES.RATE_LIMIT;
  }

  // Log error with context
  Logger.error(`[Error] ${err.stack || message}`, {
    requestId: (req as any).id,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    statusCode,
    env: config.server.env,
  });

  // Prepare error response (sanitize for production)
  const errorResponse: any = {
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
    requestId: (req as any).id,
  };

  // Add debug info in development only
  if (config.server.isDevelopment) {
    errorResponse.stack = err.stack;
    errorResponse.type = err.name;
    errorResponse.code = err.code;
  }

  res.status(statusCode).json(errorResponse);
};