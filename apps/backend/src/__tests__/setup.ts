import { jest } from '@jest/globals';
import { User } from '@prisma/client';

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
process.env.GOOGLE_CLIENT_ID = 'test-google-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-google-client-secret';
process.env.CORS_ORIGIN = 'http://localhost:3000';

// Mock Prisma Client
const mockPrismaUser = {
  findUnique: jest.fn(),
  findMany: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
  groupBy: jest.fn(),
};

const mockPrisma = {
  user: mockPrismaUser,
  $disconnect: jest.fn(),
  $connect: jest.fn(),
};

jest.mock('../services/database', () => ({
  prisma: mockPrisma,
}));

// Mock bcrypt
const mockBcrypt = {
  hash: jest.fn(),
  compare: jest.fn(),
  genSalt: jest.fn(),
};

jest.mock('bcrypt', () => mockBcrypt);

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
  decode: jest.fn(),
}));

// Mock passport
jest.mock('passport', () => ({
  authenticate: jest.fn(),
  use: jest.fn(),
  serializeUser: jest.fn(),
  deserializeUser: jest.fn(),
}));

// Export mocks for use in tests
export { mockBcrypt, mockPrisma, mockPrismaUser };

// Global test utilities
export const createMockUser = (overrides: Partial<User> = {}): User =>
  ({
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    avatar: null,
    role: 'USER',
    isActive: true,
    lastLoginAt: new Date(),
    emailVerified: false,
    baseCurrency: 'USD',
    timezone: 'UTC',
    createdAt: new Date(),
    updatedAt: new Date(),
    passwordHash: 'hashed-password',
    refreshToken: 'refresh-token',
    googleId: null,
    appleId: null,
    ...overrides,
  }) as User;

export const createMockRequest = (overrides: Record<string, unknown> = {}) => ({
  body: {},
  params: {},
  query: {},
  headers: {},
  user: undefined,
  ...overrides,
});

export const createMockResponse = () => {
  const res = {} as Record<string, unknown>;

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.redirect = jest.fn().mockReturnValue(res);

  return res;
};

export const createMockNext = () => jest.fn();
