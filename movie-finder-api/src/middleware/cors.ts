import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env.js';
import Logger from '../config/logger.js';

// /**
//  * CORS configuration for multiple origins
//  * Supports Vercel frontend, local development, and custom domains
//  */
// export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
//   const origin = req.headers.origin;
//   const allowedOrigins = config.cors.allowedOrigins;

//   const isVercelPreview = origin.endsWith('.vercel.app');

// if (allowedOrigins.includes(origin) || allowedOrigins.includes('*') || isVercelPreview) {
//     res.setHeader('Access-Control-Allow-Origin', origin);
//     res.setHeader('Vary', 'Origin');
// }

//   // Allow requests with no origin (like mobile apps, curl, etc)
//   if (!origin) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//   } 
//   // Check if origin is allowed
//   else if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
//     res.setHeader('Access-Control-Allow-Origin', origin);
//     res.setHeader('Vary', 'Origin');
//   } 
//   // In development, be more permissive
//   else if (config.server.isDevelopment) {
//     res.setHeader('Access-Control-Allow-Origin', origin);
//     res.setHeader('Vary', 'Origin');
//     Logger.warn(`CORS: Allowed development origin ${origin}`);
//   } 
//   // Block others
//   else {
//     Logger.warn(`CORS: Blocked origin ${origin}`);
//     return res.status(403).json({
//       success: false,
//       error: 'Origin not allowed',
//       timestamp: new Date().toISOString(),
//     });
//   }

//   // Set other CORS headers
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Request-ID, x-retry-count');
//   res.setHeader('Access-Control-Allow-Credentials', 'true');
//   res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

//   // Handle preflight
//   if (req.method === 'OPTIONS') {
//     return res.status(200).end();
//   }

//   next();
// };

export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  const allowedOrigins = config.cors.allowedOrigins;

  // 1. Handle No Origin (Server-to-server, curl, mobile)
  if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } 
  // 2. Handle Allowed Origins, Wildcards, or Vercel Previews
  else if (
    allowedOrigins.includes(origin) || 
    allowedOrigins.includes('*') || 
    origin.endsWith('.vercel.app') ||
    (config.server.isDevelopment && origin.includes('localhost'))
  ) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  } 
  // 3. Block unauthorized origins
  else {
    Logger.warn(`CORS: Blocked origin ${origin}`);
    return res.status(403).json({
      success: false,
      error: 'Origin not allowed',
      timestamp: new Date().toISOString(),
    });
  }

  // Common Headers
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Request-ID');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');

  // 4. Critical: Handle Preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
};