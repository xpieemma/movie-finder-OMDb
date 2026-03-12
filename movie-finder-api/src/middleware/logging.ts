import { Request, Response, NextFunction } from 'express';
import Logger from '../config/logger.ts';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    Logger.info({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      requestId: (req as any).id,
    });
  });
  
  next();
};
