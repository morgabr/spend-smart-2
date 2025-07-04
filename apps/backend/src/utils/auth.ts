import { UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/env';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// Generate JWT tokens
export const generateTokens = (payload: TokenPayload): TokenPair => {
  const accessToken = jwt.sign(payload, authConfig.jwtSecret, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign(payload, authConfig.jwtSecret, {
    expiresIn: '7d',
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

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Compare password
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

// Validate password strength
export const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Alternative name for compatibility
export const validatePasswordStrength = validatePassword;

// Validate email format
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate secure random token
export const generateSecureToken = (): string => {
  return jwt.sign({ random: Math.random() }, authConfig.jwtSecret, {
    expiresIn: '1h',
  });
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
