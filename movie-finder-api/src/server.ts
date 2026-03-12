import { fileURLToPath } from 'url';
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { config } from './config/env.js';
import Logger from './config/logger.js';
import { corsMiddleware } from './middleware/cors.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { requestLogger } from './middleware/logging.js';
import { errorHandler } from './middleware/errorHandler.js';
import { addRequestId } from './middleware/requestId.js';
import { cacheService } from './config/cache.js';
import movieRoutes from './routes/movie.routes.js';

const app = express();
const PORT = config.server.port;

// Load Swagger
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger/swagger.yaml'));

// Security middleware
app.use(helmet({
  contentSecurityPolicy: config.server.isProduction ? undefined : false,
}));

// Compression
app.use(compression({
  level: 6,
  threshold: 1024,
}));

// CORS
app.use(corsMiddleware);

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request ID
app.use(addRequestId);

// Logging
app.use(requestLogger);

// Rate limiting (skip in test)
if (!config.server.isTest) {
  app.use('/api', apiLimiter);
}

// Health check endpoints (for BetterStack monitoring)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: config.server.env,
    uptime: process.uptime(),
    cache: cacheService.getStats(),
  });
});

// Ping endpoint (lightweight for monitoring)
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API routes
app.use('/api', movieRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'Movie Finder API',
    version: '1.0.0',
    description: 'RESTful API for movie information',
    documentation: '/api-docs',
    health: '/health',
    ping: '/ping',
    endpoints: {
      search: '/api/search?title={movie_title}',
      details: '/api/movies/{imdb_id}',
      stats: '/api/stats',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString(),
    requestId: req.params.id,
  });
});

// Error handler
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  Logger.info(`🚀 Server is running on port ${PORT}`);
  Logger.info(`🌍 Environment: ${config.server.env}`);
  Logger.info(`📚 API Docs: http://localhost:${PORT}/api-docs`);
  Logger.info(`🔗 CORS Origins: ${config.cors.allowedOrigins.join(', ')}`);
  Logger.info(`📊 Cache stats: ${JSON.stringify(cacheService.getStats())}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  Logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    cacheService.clear();
    Logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  Logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    cacheService.clear();
    Logger.info('Server closed');
    process.exit(0);
  });
});

export default app;