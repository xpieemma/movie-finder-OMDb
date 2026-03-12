import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export const addRequestId = (req: Request, res: Response, next: NextFunction) => {
  (req as any).id = uuidv4();
  res.setHeader('X-Request-ID', (req as any).id);
  next();
};
