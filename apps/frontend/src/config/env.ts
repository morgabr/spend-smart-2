// TODO: Import from @shared/env once TypeScript project references are fully configured
// import {
//   FrontendEnvSchema,
//   getEnvironmentConfig,
//   validateEnv,
// } from '@shared/env';

// Vite automatically loads .env files and exposes VITE_ prefixed variables
// Temporary basic environment configuration (will be replaced with shared validation)
export const env = {
  NODE_ENV: import.meta.env.NODE_ENV || 'development',
  VITE_API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME || 'SpendSmart',
  VITE_ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
};

export const environmentConfig = {
  isDevelopment: env.NODE_ENV === 'development',
  isProduction: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',
  nodeEnv: env.NODE_ENV,
};

// Export configuration sections
export const apiConfig = {
  baseUrl: env.VITE_API_BASE_URL,
  timeout: 10000, // 10 seconds
};

export const appConfig = {
  name: env.VITE_APP_NAME,
  enableAnalytics: env.VITE_ENABLE_ANALYTICS,
};

// Log configuration in development (excluding sensitive data)
if (environmentConfig.isDevelopment) {
  console.log('🔧 Frontend Configuration:', {
    nodeEnv: env.NODE_ENV,
    apiBaseUrl: env.VITE_API_BASE_URL,
    appName: env.VITE_APP_NAME,
    enableAnalytics: env.VITE_ENABLE_ANALYTICS,
  });
}

// Type-safe environment variables for components
export type AppEnv = typeof env;
