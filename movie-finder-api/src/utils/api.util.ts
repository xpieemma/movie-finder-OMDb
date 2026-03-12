import { Request } from 'express';
import { config } from '../config/env.js';

export const getClientIp = (req: Request): string => {
  return (req.headers['x-forwarded-for'] as string) || req.ip || 'unknown';
};

export const isDevelopment = (): boolean => {
  return config.server.isDevelopment;
};

export const isProduction = (): boolean => {
  return config.server.isProduction;
};

export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
