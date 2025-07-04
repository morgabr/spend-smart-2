import { NextFunction, Request, Response } from 'express';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  // Log incoming request
  console.log(`📨 ${timestamp} - ${req.method} ${req.originalUrl}`, {
    method: req.method,
    url: req.originalUrl,
    userAgent: req.get('User-Agent'),
    ip: req.ip || req.connection.remoteAddress,
    query: Object.keys(req.query).length > 0 ? req.query : undefined,
    params: Object.keys(req.params).length > 0 ? req.params : undefined,
    contentType: req.get('Content-Type'),
    contentLength: req.get('Content-Length'),
  });

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function (body: any) {
    const responseTime = Date.now() - startTime;
    const statusCode = res.statusCode;

    // Log response
    console.log(
      `📤 ${new Date().toISOString()} - ${req.method} ${req.originalUrl} - ${statusCode} - ${responseTime}ms`,
      {
        method: req.method,
        url: req.originalUrl,
        statusCode,
        responseTime: `${responseTime}ms`,
        contentLength: JSON.stringify(body).length,
        success: statusCode >= 200 && statusCode < 300,
      }
    );

    return originalJson.call(this, body);
  };

  // Override res.send to log response
  const originalSend = res.send;
  res.send = function (body: any) {
    const responseTime = Date.now() - startTime;
    const statusCode = res.statusCode;

    // Log response if not already logged by res.json
    if (!res.headersSent) {
      console.log(
        `📤 ${new Date().toISOString()} - ${req.method} ${req.originalUrl} - ${statusCode} - ${responseTime}ms`,
        {
          method: req.method,
          url: req.originalUrl,
          statusCode,
          responseTime: `${responseTime}ms`,
          contentLength:
            typeof body === 'string'
              ? body.length
              : JSON.stringify(body).length,
          success: statusCode >= 200 && statusCode < 300,
        }
      );
    }

    return originalSend.call(this, body);
  };

  next();
};
