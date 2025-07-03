import { z } from 'zod';
import { AccountType, BudgetPeriod } from './types';

// User schemas
export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(8),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Account schemas
export const CreateAccountSchema = z.object({
  name: z.string().min(1),
  type: z.nativeEnum(AccountType),
  balance: z.number(),
  currency: z.string().length(3),
});

export const UpdateAccountSchema = z.object({
  name: z.string().min(1).optional(),
  balance: z.number().optional(),
  isActive: z.boolean().optional(),
});

// Transaction schemas
export const CreateTransactionSchema = z.object({
  accountId: z.string().uuid(),
  amount: z.number(),
  description: z.string().min(1),
  category: z.string().min(1),
  date: z.string().datetime(),
  isRecurring: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

export const UpdateTransactionSchema = z.object({
  amount: z.number().optional(),
  description: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  date: z.string().datetime().optional(),
  isRecurring: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

// Budget schemas
export const CreateBudgetSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  amount: z.number().positive(),
  period: z.nativeEnum(BudgetPeriod),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
});

export const UpdateBudgetSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  amount: z.number().positive().optional(),
  period: z.nativeEnum(BudgetPeriod).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// Goal schemas
export const CreateGoalSchema = z.object({
  name: z.string().min(1),
  targetAmount: z.number().positive(),
  targetDate: z.string().datetime(),
  accountId: z.string().uuid().optional(),
});

export const UpdateGoalSchema = z.object({
  name: z.string().min(1).optional(),
  targetAmount: z.number().positive().optional(),
  currentAmount: z.number().min(0).optional(),
  targetDate: z.string().datetime().optional(),
  accountId: z.string().uuid().optional(),
});

// Query parameter schemas
export const PaginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export const DateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const TransactionFilterSchema = z.object({
  accountId: z.string().uuid().optional(),
  category: z.string().optional(),
  minAmount: z.coerce.number().optional(),
  maxAmount: z.coerce.number().optional(),
  search: z.string().optional(),
}).merge(DateRangeSchema).merge(PaginationSchema); 