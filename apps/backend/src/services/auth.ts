/* eslint-disable @typescript-eslint/no-unused-vars */
import { User, UserRole } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { authConfig, serverConfig } from '../config/env';
import {
  comparePassword,
  generateTokens,
  hashPassword,
  validateEmail,
  validatePassword,
} from '../utils/auth';
import { getDefaultRole } from '../utils/roles';
import { prisma } from './database';
import EmailService from './email';

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResult {
  user: UserWithoutSensitiveData;
  accessToken: string;
  refreshToken: string;
}

export interface UserWithoutSensitiveData {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  role: UserRole;
  isActive: boolean;
  lastLoginAt: Date | null;
  emailVerified: boolean;
  baseCurrency: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GoogleUserData {
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface MagicLinkData {
  email: string;
}

export class AuthService {
  // Register new user
  static async register(data: RegisterData): Promise<AuthResult> {
    const { email, password, name } = data;

    // Validate email format
    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    // Validate password
    if (!validatePassword(password)) {
      throw new Error(
        'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character'
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user with default role
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: getDefaultRole(),
      },
    });

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Store refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: tokens.refreshToken,
        lastLoginAt: new Date(),
      },
    });

    // Return user without sensitive data
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      passwordHash: _,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      refreshToken: __,
      ...userWithoutSensitiveData
    } = user;

    return {
      user: { ...userWithoutSensitiveData, role: user.role },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  // Login user
  static async login(data: LoginData): Promise<AuthResult> {
    const { email, password } = data;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.passwordHash) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Store refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: tokens.refreshToken,
        lastLoginAt: new Date(),
      },
    });

    // Return user without sensitive data
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      passwordHash: _,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      refreshToken: __,
      ...userWithoutSensitiveData
    } = user;

    return {
      user: userWithoutSensitiveData,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  // Refresh access token
  static async refreshToken(refreshToken: string): Promise<AuthResult> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, authConfig.jwtSecret) as {
        userId: string;
        email: string;
        role: UserRole;
      };

      // Find user and verify stored refresh token
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw new Error('Invalid refresh token');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      // Generate new tokens
      const tokens = generateTokens({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      // Update refresh token in database
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: tokens.refreshToken },
      });

      // Return user data without sensitive fields
      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        passwordHash: _,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        refreshToken: __,
        ...userWithoutSensitiveData
      } = user;

      return {
        user: userWithoutSensitiveData,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  // Logout user
  static async logout(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  // Get user by ID
  static async getUserById(
    userId: string
  ): Promise<UserWithoutSensitiveData | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      passwordHash: _,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      refreshToken: __,
      ...userWithoutSensitiveData
    } = user;

    return userWithoutSensitiveData;
  }

  // Update user profile
  static async updateProfile(
    userId: string,
    data: Partial<Pick<User, 'name' | 'avatar' | 'baseCurrency' | 'timezone'>>
  ): Promise<UserWithoutSensitiveData> {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });

    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      passwordHash: _,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      refreshToken: __,
      ...userWithoutSensitiveData
    } = user;

    return userWithoutSensitiveData;
  }

  // Change password
  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.passwordHash) {
      throw new Error('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(
      currentPassword,
      user.passwordHash
    );

    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Validate new password
    if (!validatePassword(newPassword)) {
      throw new Error(
        'New password must be at least 8 characters long and contain uppercase, lowercase, number, and special character'
      );
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: newPasswordHash,
        refreshToken: null, // Invalidate all sessions
      },
    });
  }

  // Email verification
  static async verifyEmail(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    });
  }

  // Google OAuth methods
  static async findUserByGoogleId(
    googleId: string
  ): Promise<UserWithoutSensitiveData | null> {
    const user = await prisma.user.findUnique({
      where: { googleId },
    });

    if (!user) {
      return null;
    }

    const {
      passwordHash: _,
      refreshToken: __,
      ...userWithoutSensitiveData
    } = user;

    return userWithoutSensitiveData;
  }

  static async findUserByEmail(
    email: string
  ): Promise<UserWithoutSensitiveData | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const {
      passwordHash: _,
      refreshToken: __,
      ...userWithoutSensitiveData
    } = user;

    return userWithoutSensitiveData;
  }

  static async linkGoogleAccount(
    userId: string,
    googleId: string
  ): Promise<UserWithoutSensitiveData> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { googleId },
    });

    const {
      passwordHash: _,
      refreshToken: __,
      ...userWithoutSensitiveData
    } = user;

    return userWithoutSensitiveData;
  }

  static async createUserFromGoogle(
    data: GoogleUserData
  ): Promise<UserWithoutSensitiveData> {
    const user = await prisma.user.create({
      data: {
        googleId: data.googleId,
        email: data.email,
        name: data.name,
        avatar: data.avatar,
        emailVerified: true, // Google emails are pre-verified
        role: getDefaultRole(),
      },
    });

    const {
      passwordHash: _,
      refreshToken: __,
      ...userWithoutSensitiveData
    } = user;

    return userWithoutSensitiveData;
  }

  static async googleLogin(
    user: UserWithoutSensitiveData
  ): Promise<AuthResult> {
    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Store refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: tokens.refreshToken,
        lastLoginAt: new Date(),
      },
    });

    return {
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  // User management methods (for admin use)
  static async getAllUsers(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{
    users: UserWithoutSensitiveData[];
    total: number;
    page: number;
    limit: number;
  }> {
    const offset = (page - 1) * limit;

    const whereCondition = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' as const } },
            { name: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereCondition,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where: whereCondition }),
    ]);

    const usersWithoutSensitiveData = users.map(user => {
      const {
        passwordHash: _,
        refreshToken: __,
        ...userWithoutSensitiveData
      } = user;

      return userWithoutSensitiveData;
    });

    return {
      users: usersWithoutSensitiveData,
      total,
      page,
      limit,
    };
  }

  static async updateUserRole(
    userId: string,
    newRole: UserRole
  ): Promise<UserWithoutSensitiveData> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    const {
      passwordHash: _,
      refreshToken: __,
      ...userWithoutSensitiveData
    } = user;

    return userWithoutSensitiveData;
  }

  static async deactivateUser(
    userId: string
  ): Promise<UserWithoutSensitiveData> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    const {
      passwordHash: _,
      refreshToken: __,
      ...userWithoutSensitiveData
    } = user;

    return userWithoutSensitiveData;
  }

  static async reactivateUser(
    userId: string
  ): Promise<UserWithoutSensitiveData> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isActive: true },
    });

    const {
      passwordHash: _,
      refreshToken: __,
      ...userWithoutSensitiveData
    } = user;

    return userWithoutSensitiveData;
  }

  // System statistics (for admin dashboard)
  static async getSystemStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    usersByRole: Record<UserRole, number>;
    recentRegistrations: number;
    deactivatedUsers: number;
  }> {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get total users
    const totalUsers = await prisma.user.count();

    // Get active users
    const activeUsers = await prisma.user.count({
      where: { isActive: true },
    });

    // Get users by role
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        id: true,
      },
    });

    // Convert to record format
    const roleStats: Record<UserRole, number> = {
      USER: 0,
      MODERATOR: 0,
      ADMIN: 0,
      SUPER_ADMIN: 0,
    };

    usersByRole.forEach(group => {
      roleStats[group.role] = group._count.id;
    });

    // Get recent registrations (last 30 days)
    const recentRegistrations = await prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    // Get deactivated users
    const deactivatedUsers = await prisma.user.count({
      where: { isActive: false },
    });

    return {
      totalUsers,
      activeUsers,
      usersByRole: roleStats,
      recentRegistrations,
      deactivatedUsers,
    };
  }

  // Magic link authentication - send magic link
  static async sendMagicLink(data: MagicLinkData): Promise<void> {
    const { email } = data;

    // Validate email format
    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // If user doesn't exist, create a new one
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          role: getDefaultRole(),
        },
      });
    }

    // Generate magic link token
    const magicToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        type: 'magic_link',
      },
      authConfig.magicLink.secret,
      { expiresIn: authConfig.magicLink.expiresIn } as jwt.SignOptions
    );

    // Create magic link
    const magicLink = `${serverConfig.frontendUrl}/auth/magic-link?token=${magicToken}`;

    // Send magic link email
    await EmailService.sendMagicLinkEmail({
      email: user.email,
      magicLink,
      userName: user.name || undefined,
    });

    // For new users, also send welcome email
    if (!user.name) {
      await EmailService.sendWelcomeEmail(user.email, user.name || 'User');
    }
  }

  // Magic link authentication - verify token and login
  static async verifyMagicLink(token: string): Promise<AuthResult> {
    try {
      // Verify magic link token
      const decoded = jwt.verify(token, authConfig.magicLink.secret) as {
        userId: string;
        email: string;
        type: string;
      };

      // Check if token is a magic link token
      if (decoded.type !== 'magic_link') {
        throw new Error('Invalid token type');
      }

      // Find user
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      // Mark email as verified if not already
      if (!user.emailVerified) {
        await prisma.user.update({
          where: { id: user.id },
          data: { emailVerified: true },
        });
      }

      // Generate tokens
      const tokens = generateTokens({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      // Store refresh token and update last login
      await prisma.user.update({
        where: { id: user.id },
        data: {
          refreshToken: tokens.refreshToken,
          lastLoginAt: new Date(),
        },
      });

      // Return user without sensitive data
      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        passwordHash: _,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        refreshToken: __,
        ...userWithoutSensitiveData
      } = user;

      return {
        user: { ...userWithoutSensitiveData, emailVerified: true },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Magic link has expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid magic link');
      }
      throw error;
    }
  }
}

export default AuthService;
