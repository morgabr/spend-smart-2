import { z } from 'zod';

// Base environment schema
const BaseEnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

// Database environment schema
export const DatabaseEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  DATABASE_HOST: z.string().optional(),
  DATABASE_PORT: z.coerce.number().min(1).max(65535).optional(),
  DATABASE_NAME: z.string().optional(),
  DATABASE_USER: z.string().optional(),
  DATABASE_PASSWORD: z.string().optional(),
  DATABASE_SSL: z.coerce.boolean().default(false),
});

// Authentication environment schema
export const AuthEnvSchema = z.object({
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  BCRYPT_ROUNDS: z.coerce.number().min(8).max(15).default(12),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  APPLE_CLIENT_ID: z.string().optional(),
  APPLE_CLIENT_SECRET: z.string().optional(),
});

// External services environment schema
export const ExternalServicesEnvSchema = z.object({
  TINK_CLIENT_ID: z.string().optional(),
  TINK_CLIENT_SECRET: z.string().optional(),
  TINK_ENVIRONMENT: z.enum(['sandbox', 'production']).default('sandbox'),
  SENDGRID_API_KEY: z.string().optional(),
  FROM_EMAIL: z.string().email().optional(),
  EXCHANGE_RATE_API_KEY: z.string().optional(),
  EXCHANGE_RATE_BASE_URL: z.string().url().optional(),
});

// Backend environment schema
export const BackendEnvSchema = BaseEnvSchema.merge(DatabaseEnvSchema)
  .merge(AuthEnvSchema)
  .merge(ExternalServicesEnvSchema)
  .extend({
    PORT: z.coerce.number().min(1).max(65535).default(3001),
    API_PREFIX: z.string().default('/api'),
    CORS_ORIGIN: z.string().default('http://localhost:3000'),
    MAX_FILE_SIZE: z.coerce.number().default(10485760), // 10MB
    UPLOAD_DIR: z.string().default('uploads'),
    RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000), // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
    SENTRY_DSN: z.string().optional(),
    ENABLE_SWAGGER: z.coerce.boolean().default(false),
    ENABLE_DEBUG_LOGS: z.coerce.boolean().default(false),
    MOCK_EXTERNAL_APIS: z.coerce.boolean().default(false),
    TEST_DATABASE_URL: z.string().url().optional(),
  });

// Frontend environment schema (Vite prefixed)
export const FrontendEnvSchema = BaseEnvSchema.extend({
  VITE_API_BASE_URL: z.string().url().default('http://localhost:3001/api'),
  VITE_APP_NAME: z.string().default('SpendSmart'),
  VITE_GOOGLE_CLIENT_ID: z.string().optional(),
  VITE_ENABLE_ANALYTICS: z.coerce.boolean().default(false),
  VITE_LOGROCKET_APP_ID: z.string().optional(),
});

// Environment validation function
export function validateEnv<T extends z.ZodSchema>(
  schema: T,
  env: Record<string, string | undefined> = process.env
): z.infer<T> {
  try {
    return schema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .filter(
          err => err.code === 'invalid_type' && err.received === 'undefined'
        )
        .map(err => err.path.join('.'));

      const invalidVars = error.errors
        .filter(
          err => err.code !== 'invalid_type' || err.received !== 'undefined'
        )
        .map(err => `${err.path.join('.')}: ${err.message}`);

      let errorMessage = 'Environment validation failed:\n';

      if (missingVars.length > 0) {
        errorMessage += `Missing required variables: ${missingVars.join(', ')}\n`;
      }

      if (invalidVars.length > 0) {
        errorMessage += `Invalid variables: ${invalidVars.join(', ')}\n`;
      }

      throw new Error(errorMessage);
    }
    throw error;
  }
}

// Utility to get environment-specific config
export function getEnvironmentConfig(
  nodeEnv: string = process.env.NODE_ENV || 'development'
) {
  return {
    isDevelopment: nodeEnv === 'development',
    isProduction: nodeEnv === 'production',
    isTest: nodeEnv === 'test',
    nodeEnv,
  };
}

// Type exports
export type BackendEnv = z.infer<typeof BackendEnvSchema>;
export type FrontendEnv = z.infer<typeof FrontendEnvSchema>;
export type DatabaseEnv = z.infer<typeof DatabaseEnvSchema>;
export type AuthEnv = z.infer<typeof AuthEnvSchema>;
