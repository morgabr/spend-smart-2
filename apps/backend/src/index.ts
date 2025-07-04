// SpendSmart Backend Entry Point
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import { corsConfig, serverConfig } from './config/env';
import passport from './config/passport';
import { errorHandler } from './middleware/error-handler';
import { rateLimiter } from './middleware/rate-limiter';
import { requestLogger } from './middleware/request-logger';
import apiRoutes from './routes';
import {
  checkDatabaseConnection,
  disconnectDatabase,
  initializeDatabase,
} from './services/database';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors(corsConfig));
app.use(rateLimiter);

// Request parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session middleware (required for Passport)
app.use(
  session({
    secret: process.env.JWT_SECRET || 'fallback-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Logging middleware
app.use(requestLogger);

// Health check endpoint
app.get('/health', async (_req, res) => {
  const timestamp = new Date().toISOString();
  const databaseHealthy = await checkDatabaseConnection();

  const health = {
    status: databaseHealthy ? 'healthy' : 'unhealthy',
    timestamp,
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    services: {
      database: databaseHealthy ? 'connected' : 'disconnected',
    },
    uptime: process.uptime(),
  };

  res.status(databaseHealthy ? 200 : 503).json(health);
});

// API routes
app.use(serverConfig.apiPrefix, apiRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

const startServer = async () => {
  try {
    // Initialize database (non-blocking)
    await initializeDatabase();

    // Start HTTP server
    const server = app.listen(serverConfig.port, () => {
      console.log(`🚀 SpendSmart Backend running on port ${serverConfig.port}`);
      console.log(
        `📚 API Documentation: http://localhost:${serverConfig.port}${serverConfig.apiPrefix}/docs`
      );
      console.log(
        `🏥 Health Check: http://localhost:${serverConfig.port}/health`
      );
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    });

    // Graceful shutdown handlers
    const gracefulShutdown = async () => {
      console.log('Received shutdown signal, shutting down gracefully...');

      server.close(async () => {
        console.log('HTTP server closed');
        try {
          await disconnectDatabase();
        } catch (error) {
          console.log('Database was not connected');
        }
        process.exit(0);
      });
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;
