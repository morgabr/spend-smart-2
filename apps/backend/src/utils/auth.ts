import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/env';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// JWT Token Generation
export const generateTokens = (payload: TokenPayload): TokenPair => {
  const accessToken = jwt.sign(payload, authConfig.jwtSecret, {
    expiresIn: '15m', // Short-lived access token
  });

  const refreshToken = jwt.sign(payload, authConfig.jwtSecret, {
    expiresIn: '7d', // Longer-lived refresh token
  });

  return { accessToken, refreshToken };
};

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, authConfig.jwtSecret, {
    expiresIn: '15m',
  });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, authConfig.jwtSecret) as TokenPayload;
};

// Password Hashing
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Token Validation
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) return true;

    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

// Password Strength Validation
export const validatePasswordStrength = (
  password: string
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Email Validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
