# Environment Setup Guide

This guide explains how to configure environment variables for the SpendSmart application.

## Overview

SpendSmart uses environment variables to configure different aspects of the application including
database connections, API keys, feature flags, and more. The configuration is validated using Zod
schemas to ensure type safety and proper values.

## Environment Files

### File Priority (highest to lowest)

1. `.env.local` - Local overrides (never committed)
2. `.env.development` / `.env.production` - Environment-specific
3. `.env` - Default values (committed with safe defaults)

### Example Files

- `.env.example` - Complete list of all possible variables
- `.env.development.example` - Development-specific variables
- `.env.production.example` - Production-specific variables

## Quick Start

1. **Copy the example file:**

   ```bash
   cp .env.example .env
   ```

2. **Update required variables:**
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `JWT_SECRET` - A secure random string (32+ characters)

3. **Optional: Create environment-specific files:**
   ```bash
   cp .env.development.example .env.development
   cp .env.production.example .env.production
   ```

## Required Variables

### Database

- `DATABASE_URL` - PostgreSQL connection string
  - Format: `postgresql://username:password@host:port/database`
  - Example: `postgresql://spendsmart:password@localhost:5432/spendsmart`

### Authentication

- `JWT_SECRET` - Secret key for JWT token signing (minimum 32 characters)
  - Development: Use any string 32+ characters
  - Production: Use a cryptographically secure random string

## Optional Variables

### External Services

- `TINK_CLIENT_ID` / `TINK_CLIENT_SECRET` - Tink API credentials
- `SENDGRID_API_KEY` - SendGrid for email notifications
- `EXCHANGE_RATE_API_KEY` - Exchange rate API for currency conversion

### OAuth Providers

- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Google OAuth
- `APPLE_CLIENT_ID` / `APPLE_CLIENT_SECRET` - Apple OAuth

### Monitoring

- `SENTRY_DSN` - Sentry for error tracking
- `LOGROCKET_APP_ID` - LogRocket for session recording

## Environment-Specific Configuration

### Development

- `NODE_ENV=development`
- `ENABLE_SWAGGER=true` - API documentation
- `ENABLE_DEBUG_LOGS=true` - Verbose logging
- `MOCK_EXTERNAL_APIS=true` - Mock external service calls

### Production

- `NODE_ENV=production`
- `DATABASE_SSL=true` - Enable SSL for database connections
- `ENABLE_SWAGGER=false` - Disable API docs
- `ENABLE_DEBUG_LOGS=false` - Minimal logging

### Testing

- `NODE_ENV=test`
- `TEST_DATABASE_URL` - Separate test database

## Frontend Variables (Vite)

Frontend environment variables must be prefixed with `VITE_` to be accessible:

- `VITE_API_BASE_URL` - Backend API URL
- `VITE_APP_NAME` - Application name
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth client ID
- `VITE_ENABLE_ANALYTICS` - Enable/disable analytics

## Validation

Environment variables are validated using Zod schemas:

- **Backend**: `BackendEnvSchema` in `@shared/env`
- **Frontend**: `FrontendEnvSchema` in `@shared/env`

Invalid or missing required variables will cause the application to fail at startup with descriptive
error messages.

## Security Best Practices

1. **Never commit sensitive data:**
   - Use `.env.local` for sensitive local overrides
   - Add `.env.local` to `.gitignore`

2. **Use strong secrets:**
   - Generate random JWT secrets: `openssl rand -base64 32`
   - Use different secrets for each environment

3. **Validate in production:**
   - All required variables are validated at startup
   - Invalid configurations will prevent the app from starting

4. **Environment separation:**
   - Use different databases for dev/staging/production
   - Use sandbox APIs in development
   - Enable SSL in production

## Troubleshooting

### "Environment validation failed"

- Check that all required variables are set
- Verify variable formats (URLs, numbers, booleans)
- Check for typos in variable names

### "No inputs were found in config file"

- Ensure TypeScript files exist in the expected directories
- Check that the `include` paths in `tsconfig.json` are correct

### Frontend variables not available

- Ensure variables are prefixed with `VITE_`
- Restart the development server after adding new variables

## Examples

### Local Development

```bash
# .env.local
DATABASE_URL=postgresql://myuser:mypass@localhost:5432/spendsmart_local
JWT_SECRET=my-super-secret-local-jwt-key-that-is-long-enough
TINK_CLIENT_ID=your-dev-tink-client-id
TINK_CLIENT_SECRET=your-dev-tink-client-secret
```

### Production

```bash
# .env.production
DATABASE_URL=postgresql://prod_user:secure_pass@prod-db.example.com:5432/spendsmart
DATABASE_SSL=true
JWT_SECRET=your-production-jwt-secret-from-secret-manager
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

## Support

For questions about environment setup, check:

1. This documentation
2. Example files (`.env.*.example`)
3. Validation schemas in `packages/shared/src/env.ts`
4. Configuration files in `apps/*/src/config/env.ts`
