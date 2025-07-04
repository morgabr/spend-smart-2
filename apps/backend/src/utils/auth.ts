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

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, authConfig.jwtSecret, {
    expiresIn: '7d',
  });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, authConfig.jwtSecret) as TokenPayload;
};

// Verify access token
export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, authConfig.jwtSecret) as TokenPayload;
  } catch (error) {
    return null;
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    const payload = jwt.verify(token, authConfig.jwtSecret) as TokenPayload;

    // Refresh tokens should contain the userId
    if (payload.userId) {
      return payload;
    }

    return null;
  } catch (error) {
    return null;
  }
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

// Alternative name for compatibility
export const isValidEmail = validateEmail;

// Generate secure random token
export const generateSecureToken = (): string => {
  return jwt.sign({ random: Math.random() }, authConfig.jwtSecret, {
    expiresIn: '1h',
  });
};

// Token Validation
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwt.decode(token) as {
      userId: string;
      email: string;
      role: string;
      exp: number;
    } | null;

    if (!decoded || !decoded.exp) return true;

    const currentTime = Date.now() / 1000;

    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};
