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
};

export const serverConfig = {
  port: env.PORT,
  apiPrefix: env.API_PREFIX,
  corsOrigin: env.CORS_ORIGIN,
};

// Log configuration on startup (excluding sensitive data)
if (environmentConfig.isDevelopment) {
  console.log('🔧 Backend Configuration:', {
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    apiPrefix: env.API_PREFIX,
  });
}
