import rateLimit from 'express-rate-limit';
import { config } from '../config/env.ts';
import { RATE_LIMIT, HTTP_STATUS, ERROR_MESSAGES } from '../config/constants.js';
import Logger from '../config/logger.ts';

/**
 * Rate limiting configuration for Koyeb deployment
 * Prevents abuse and manages OMDb API limits
 */
export const apiLimiter = rateLimit({
  windowMs: config.rateLimit.window,
  max: config.rateLimit.max,
  message: {
    success: false,
    error: ERROR_MESSAGES.RATE_LIMIT,
    timestamp: new Date().toISOString(),
    retryAfter: Math.ceil(config.rateLimit.window / 1000 / 60) + ' minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,


     validate: { xForwardedForHeader: false, default: false }, 
  keyGenerator: (req) => {
    return (req.headers['x-forwarded-for'] as string) || req.ip || 'unknown';
  },


  // keyGenerator: (req) => {
  //   // Use X-Forwarded-For for Koyeb, fallback to IP
  //   return (req.headers['x-forwarded-for'] as string) || req.ip || 'unknown';
  // },
  skip: (req) => {
    // Skip rate limiting for health checks (for BetterStack)
    return req.path === '/ping' || req.path === '/health';
  },
  handler: (req, res) => {
    Logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      success: false,
      error: ERROR_MESSAGES.RATE_LIMIT,
      timestamp: new Date().toISOString(),
      requestId: (req as any).id,
    });
  },
});

/**
 * Strict rate limiter for search endpoints
 * OMDb API has 1000 requests/day limit
 */
export const searchLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 searches per hour
  validate: { xForwardedForHeader: false, default: false }, 
  message: {
    success: false,
    error: 'Search rate limit exceeded. Please try again later.',
    timestamp: new Date().toISOString(),
  },
  keyGenerator: (req) => {
    return (req.headers['x-forwarded-for'] as string) || req.ip || 'unknown';
  },
});