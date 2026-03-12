import Logger from '../config/logger';

export const logRequest = (req: any, message: string, data?: any) => {
  Logger.info(message, {
    requestId: req.id,
    method: req.method,
    path: req.path,
    ...data
  });
};

export const logError = (req: any, error: any, message: string) => {
  Logger.error(message, {
    requestId: req.id,
    error: error.message,
    stack: error.stack,
    method: req.method,
    path: req.path,
  });
};
