import { PrismaClient, User } from '@prisma/client';
import {
  comparePassword,
  generateTokens,
  hashPassword,
  validateEmail,
  validatePasswordStrength,
} from '../utils/auth';

const prisma = new PrismaClient();

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
  user: Omit<User, 'passwordHash' | 'refreshToken'>;
  accessToken: string;
  refreshToken: string;
}

export interface UserWithoutSensitiveData
  extends Omit<User, 'passwordHash' | 'refreshToken'> {}

export interface GoogleUserData {
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
}

export class AuthService {
  // Register new user
  static async register(data: RegisterData): Promise<AuthResult> {
    const { email, password, name } = data;

    // Validate email format
    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      throw new Error(
        `Password validation failed: ${passwordValidation.errors.join(', ')}`
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

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
      },
    });

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: 'user', // Default role
    });

    // Store refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    // Return user without sensitive data
    const {
      passwordHash: _,
      refreshToken: __,
      ...userWithoutSensitiveData
    } = user;

    return {
      user: userWithoutSensitiveData,
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

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: 'user',
    });

    // Store refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    // Return user without sensitive data
    const {
      passwordHash: _,
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
  static async refreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string }> {
    // Find user by refresh token
    const user = await prisma.user.findFirst({
      where: { refreshToken },
    });

    if (!user) {
      throw new Error('Invalid refresh token');
    }

    // Generate new access token
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: 'user',
    });

    return {
      accessToken: tokens.accessToken,
    };
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
      passwordHash: _,
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
      passwordHash: _,
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

    // Validate new password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      throw new Error(
        `Password validation failed: ${passwordValidation.errors.join(', ')}`
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
    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: 'user',
    });

    // Store refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    return {
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}

export default AuthService;
