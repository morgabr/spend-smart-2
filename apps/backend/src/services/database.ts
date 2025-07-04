import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

declare global {
  var __prisma: PrismaClient | undefined;
}

// Initialize Prisma client with appropriate configuration
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    log: ['error', 'warn'],
  });
} else {
  // In development, use global variable to prevent multiple instances
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  prisma = global.__prisma;
}

// Database connection health check
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection check failed:', error);
    return false;
  }
};

// Graceful shutdown
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
};

// Database initialization
export const initializeDatabase = async (): Promise<void> => {
  try {
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Run health check
    const isHealthy = await checkDatabaseConnection();
    if (!isHealthy) {
      throw new Error('Database health check failed');
    }
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    console.log('🔧 Server will continue without database connection');
    console.log(
      '💡 To enable database: Set up PostgreSQL and update DATABASE_URL in .env'
    );
  }
};

export { prisma };
export default prisma;
