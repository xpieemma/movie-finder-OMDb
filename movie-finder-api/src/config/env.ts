import 'dotenv/config';
import Logger from './logger.js';
import { ENVIRONMENTS } from './constants.js';

/**
 * Environment validation and configuration
 */
const requiredEnvVars = ['OMDB_API_KEY'];

const optionalEnvVars = {
  PORT: '3001',
  NODE_ENV: ENVIRONMENTS.DEVELOPMENT,
  ALLOWED_ORIGINS: 'http://localhost:3000',
  RATE_LIMIT_WINDOW: '15',
  RATE_LIMIT_MAX_REQUESTS: '100',
  LOG_LEVEL: 'debug',
  LOG_DIR: 'logs',
  OMDB_BASE_URL: 'http://www.omdbapi.com',
  OMDB_TIMEOUT: '10000',
  CACHE_TTL: '600',
  KOYEB_API_URL: '',
  BETTERSTACK_TOKEN: '',
};

// Validate required environment variables
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  const errorMessage = `Missing required environment variables: ${missingEnvVars.join(', ')}`;
  Logger.error(errorMessage);
  throw new Error(errorMessage);
}

// Set defaults for optional variables
Object.entries(optionalEnvVars).forEach(([key, defaultValue]) => {
  if (!process.env[key]) {
    process.env[key] = defaultValue;
    Logger.debug(`Set default value for ${key}: ${defaultValue}`);
  }
});

export const config = {
  omdb: {
    apiKey: process.env.OMDB_API_KEY!,
    baseUrl: process.env.OMDB_BASE_URL!,
    timeout: parseInt(process.env.OMDB_TIMEOUT!, 10),
    rateLimit: parseInt(process.env.OMDB_RATE_LIMIT || '1000', 10),
  },
  server: {
    port: parseInt(process.env.PORT!, 10),
    env: process.env.NODE_ENV!,
    isDevelopment: process.env.NODE_ENV === ENVIRONMENTS.DEVELOPMENT,
    isProduction: process.env.NODE_ENV === ENVIRONMENTS.PRODUCTION,
    isTest: process.env.NODE_ENV === ENVIRONMENTS.TEST,
  },
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS!.split(',').map(origin => origin.trim()),
  },
  rateLimit: {
    window: parseInt(process.env.RATE_LIMIT_WINDOW!, 10) * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS!, 10),
  },
  logging: {
    level: process.env.LOG_LEVEL!,
    dir: process.env.LOG_DIR!,
  },
  cache: {
    ttl: parseInt(process.env.CACHE_TTL!, 10),
  },
  monitors: {
    betterstack: process.env.BETTERSTACK_TOKEN,
    koyeb: process.env.KOYEB_API_URL,
  },
} as const;

// Validate configuration
if (config.server.port < 1 || config.server.port > 65535) {
  throw new Error('PORT must be between 1 and 65535');
}

if (config.rateLimit.window < 1) {
  throw new Error('RATE_LIMIT_WINDOW must be a positive number');
}

if (config.rateLimit.max < 1) {
  throw new Error('RATE_LIMIT_MAX_REQUESTS must be a positive number');
}

Logger.info('✅ Environment configuration validated successfully');
Logger.info(`🌍 Environment: ${config.server.env}`);
Logger.info(`🚀 Port: ${config.server.port}`);
Logger.info(`🔗 Allowed Origins: ${config.cors.allowedOrigins.join(', ')}`);