// Currency formatting utility
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Date formatting utility
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidAmount = (amount: number): boolean => {
  return typeof amount === 'number' && !isNaN(amount) && amount >= 0;
};

// Category utilities
export const DEFAULT_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Income',
  'Other'
] as const;

export const categorizeTransaction = (description: string): string => {
  const desc = description.toLowerCase();
  
  if (desc.includes('restaurant') || desc.includes('food') || desc.includes('grocery')) {
    return 'Food & Dining';
  }
  if (desc.includes('gas') || desc.includes('uber') || desc.includes('taxi')) {
    return 'Transportation';
  }
  if (desc.includes('amazon') || desc.includes('store') || desc.includes('shop')) {
    return 'Shopping';
  }
  if (desc.includes('netflix') || desc.includes('spotify') || desc.includes('movie')) {
    return 'Entertainment';
  }
  if (desc.includes('electric') || desc.includes('water') || desc.includes('internet')) {
    return 'Bills & Utilities';
  }
  
  return 'Other';
}; 