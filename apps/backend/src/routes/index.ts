import { Request, Response, Router } from 'express';

const router = Router();

// API Information endpoint
router.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'SpendSmart API',
    version: '1.0.0',
    description: 'Personal financial management API',
    endpoints: {
      health: '/health',
      api: '/api',
      documentation: '/api/docs',
    },
    timestamp: new Date().toISOString(),
  });
});

// API Health check (specific to API routes)
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'SpendSmart API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

// Placeholder routes for future implementation
router.get('/status', (_req: Request, res: Response) => {
  res.json({
    message: 'API is running',
    features: {
      authentication: 'Not implemented',
      accounts: 'Not implemented',
      transactions: 'Not implemented',
      budgets: 'Not implemented',
      forecasting: 'Not implemented',
      goals: 'Not implemented',
    },
    timestamp: new Date().toISOString(),
  });
});

// TODO: Add route groups when implementing features
// router.use('/auth', authRoutes);
// router.use('/accounts', accountRoutes);
// router.use('/transactions', transactionRoutes);
// router.use('/budgets', budgetRoutes);
// router.use('/forecasting', forecastingRoutes);
// router.use('/goals', goalRoutes);
// router.use('/users', userRoutes);

export default router;
