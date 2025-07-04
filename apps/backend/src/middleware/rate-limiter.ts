import { NextFunction, Request, Response } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = parseInt(
  process.env.RATE_LIMIT_WINDOW_MS || '900000'
); // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = parseInt(
  process.env.RATE_LIMIT_MAX_REQUESTS || '100'
); // 100 requests per window

// Clean up old entries every 5 minutes
setInterval(
  () => {
    const now = Date.now();

    Object.keys(store).forEach(key => {
      if (store[key].resetTime < now) {
        delete store[key];
      }
    });
  },
  5 * 60 * 1000
);

export const rateLimiter = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Skip rate limiting for health checks
  if (req.path === '/health') {
    return next();
  }

  const clientId = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();

  // Initialize or get existing rate limit data
  if (!store[clientId] || store[clientId].resetTime < now) {
    store[clientId] = {
      count: 0,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    };
  }

  // Increment request count
  store[clientId].count += 1;

  // Add rate limit headers
  const remaining = Math.max(
    0,
    RATE_LIMIT_MAX_REQUESTS - store[clientId].count
  );
  const resetTime = Math.ceil(store[clientId].resetTime / 1000);

  res.set({
    'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': resetTime.toString(),
    'X-RateLimit-Window': (RATE_LIMIT_WINDOW_MS / 1000).toString(),
  });

  // Check if rate limit exceeded
  if (store[clientId].count > RATE_LIMIT_MAX_REQUESTS) {
    console.warn(`⚠️  Rate limit exceeded for IP: ${clientId}`, {
      ip: clientId,
      count: store[clientId].count,
      limit: RATE_LIMIT_MAX_REQUESTS,
      resetTime: new Date(store[clientId].resetTime).toISOString(),
      path: req.originalUrl,
      method: req.method,
      userAgent: req.get('User-Agent'),
    });

    res.status(429).json({
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Try again in ${Math.ceil((store[clientId].resetTime - now) / 1000)} seconds.`,
      retryAfter: Math.ceil((store[clientId].resetTime - now) / 1000),
      limit: RATE_LIMIT_MAX_REQUESTS,
      remaining: 0,
      resetTime,
    });

    return;
  }

  next();
};
