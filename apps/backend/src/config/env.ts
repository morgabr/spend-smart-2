// TODO: Import from @shared/env once TypeScript project references are fully configured
// import {
//   BackendEnvSchema,
//   getEnvironmentConfig,
//   validateEnv,
// } from '@shared/env';
import dotenv from 'dotenv';
import path from 'path';

// Load environment files in order of priority
const envFiles = [
  '.env.local',
  `.env.${process.env.NODE_ENV || 'development'}`,
  '.env',
];

// Load environment files from root directory
for (const envFile of envFiles) {
  const envPath = path.resolve(process.cwd(), '../../', envFile);

  dotenv.config({ path: envPath, override: false });
}

// Temporary basic environment configuration (will be replaced with shared validation)
export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  PORT: parseInt(process.env.PORT || '3001'),
  API_PREFIX: process.env.API_PREFIX || '/api',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  // Google OAuth
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  // Email authentication
  EMAIL_SERVICE_PROVIDER: process.env.EMAIL_SERVICE_PROVIDER || 'console', // 'console' for dev, 'sendgrid' for prod
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@spendmart.com',
  MAGIC_LINK_SECRET: process.env.MAGIC_LINK_SECRET || '',
  MAGIC_LINK_EXPIRES_IN: process.env.MAGIC_LINK_EXPIRES_IN || '15m',
  // Frontend URL for redirects
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  // Add other required variables as needed
};

export const environmentConfig = {
  isDevelopment: env.NODE_ENV === 'development',
  isProduction: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',
  nodeEnv: env.NODE_ENV,
};

// Export individual config sections for convenience
export const databaseConfig = {
  url: env.DATABASE_URL,
};

export const authConfig = {
  jwtSecret: env.JWT_SECRET,
  google: {
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${env.CORS_ORIGIN}${env.API_PREFIX}/auth/google/callback`,
  },
  magicLink: {
    secret: env.MAGIC_LINK_SECRET || env.JWT_SECRET,
    expiresIn: env.MAGIC_LINK_EXPIRES_IN,
  },
};

export const emailConfig = {
  provider: env.EMAIL_SERVICE_PROVIDER,
  sendgrid: {
    apiKey: env.SENDGRID_API_KEY,
  },
  from: env.EMAIL_FROM,
};

export const serverConfig = {
  port: env.PORT,
  apiPrefix: env.API_PREFIX,
  corsOrigin: env.CORS_ORIGIN,
  frontendUrl: env.FRONTEND_URL,
};

export const corsConfig = {
  origin: env.CORS_ORIGIN,
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// Log configuration on startup (excluding sensitive data)
if (environmentConfig.isDevelopment) {
  console.log('🔧 Backend Configuration:', {
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    apiPrefix: env.API_PREFIX,
    emailProvider: env.EMAIL_SERVICE_PROVIDER,
    frontendUrl: env.FRONTEND_URL,
  });
}
