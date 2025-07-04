import { jest } from '@jest/globals';
import { AuthService } from '../../services/auth';
import * as authUtils from '../../utils/auth';
import { createMockUser, mockPrismaUser } from '../setup';

// Mock the auth utils
jest.mock('../../utils/auth');
const mockAuthUtils = authUtils as jest.Mocked<typeof authUtils>;

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'SecurePassword123!',
        name: 'Test User',
      };

      const mockUser = createMockUser({
        email: userData.email,
        name: userData.name,
      });

      const mockTokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      mockPrismaUser.findUnique.mockResolvedValue(null);
      mockAuthUtils.validatePassword.mockReturnValue(true);
      mockAuthUtils.isValidEmail.mockReturnValue(true);
      mockAuthUtils.hashPassword.mockResolvedValue('hashed-password');
      mockAuthUtils.generateTokens.mockReturnValue(mockTokens);
      mockPrismaUser.create.mockResolvedValue(mockUser);
      mockPrismaUser.update.mockResolvedValue({
        ...mockUser,
        refreshToken: 'refresh-token',
      });

      const result = await AuthService.register(userData);

      expect(result).toEqual({
        user: expect.objectContaining({
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
        }),
        tokens: mockTokens,
      });

      expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
        where: { email: userData.email },
      });
      expect(mockAuthUtils.validatePassword).toHaveBeenCalledWith(
        userData.password
      );
      expect(mockAuthUtils.isValidEmail).toHaveBeenCalledWith(userData.email);
      expect(mockAuthUtils.hashPassword).toHaveBeenCalledWith(
        userData.password
      );
      expect(mockPrismaUser.create).toHaveBeenCalledWith({
        data: {
          email: userData.email,
          name: userData.name,
          passwordHash: 'hashed-password',
          role: 'USER',
        },
      });
    });

    it('should throw error for existing email', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'SecurePassword123!',
        name: 'Test User',
      };

      mockPrismaUser.findUnique.mockResolvedValue(createMockUser());
      mockAuthUtils.validatePassword.mockReturnValue(true);
      mockAuthUtils.isValidEmail.mockReturnValue(true);

      await expect(AuthService.register(userData)).rejects.toThrow(
        'User already exists with this email'
      );
    });

    it('should throw error for invalid password', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'weak',
        name: 'Test User',
      };

      mockPrismaUser.findUnique.mockResolvedValue(null);
      mockAuthUtils.validatePassword.mockReturnValue(false);
      mockAuthUtils.isValidEmail.mockReturnValue(true);

      await expect(AuthService.register(userData)).rejects.toThrow(
        'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character'
      );
    });

    it('should throw error for invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'SecurePassword123!',
        name: 'Test User',
      };

      mockPrismaUser.findUnique.mockResolvedValue(null);
      mockAuthUtils.validatePassword.mockReturnValue(true);
      mockAuthUtils.isValidEmail.mockReturnValue(false);

      await expect(AuthService.register(userData)).rejects.toThrow(
        'Invalid email format'
      );
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'SecurePassword123!',
      };

      const mockUser = createMockUser({
        email: credentials.email,
        passwordHash: 'hashed-password',
      });

      const mockTokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      mockPrismaUser.findUnique.mockResolvedValue(mockUser);
      mockAuthUtils.comparePassword.mockResolvedValue(true);
      mockAuthUtils.generateTokens.mockReturnValue(mockTokens);
      mockPrismaUser.update.mockResolvedValue({
        ...mockUser,
        refreshToken: 'refresh-token',
      });

      const result = await AuthService.login(credentials);

      expect(result).toEqual({
        user: expect.objectContaining({
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
        }),
        tokens: mockTokens,
      });

      expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
        where: { email: credentials.email },
      });
      expect(mockAuthUtils.comparePassword).toHaveBeenCalledWith(
        credentials.password,
        mockUser.passwordHash
      );
      expect(mockPrismaUser.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: {
          refreshToken: 'refresh-token',
          lastLoginAt: expect.any(Date),
        },
      });
    });

    it('should throw error for non-existent user', async () => {
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'SecurePassword123!',
      };

      mockPrismaUser.findUnique.mockResolvedValue(null);

      await expect(AuthService.login(credentials)).rejects.toThrow(
        'Invalid credentials'
      );
    });

    it('should throw error for incorrect password', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'WrongPassword123!',
      };

      const mockUser = createMockUser({
        email: credentials.email,
        passwordHash: 'hashed-password',
      });

      mockPrismaUser.findUnique.mockResolvedValue(mockUser);
      mockAuthUtils.comparePassword.mockResolvedValue(false);

      await expect(AuthService.login(credentials)).rejects.toThrow(
        'Invalid credentials'
      );
    });

    it('should throw error for inactive user', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'SecurePassword123!',
      };

      const mockUser = createMockUser({
        email: credentials.email,
        passwordHash: 'hashed-password',
        isActive: false,
      });

      mockPrismaUser.findUnique.mockResolvedValue(mockUser);

      await expect(AuthService.login(credentials)).rejects.toThrow(
        'Account is deactivated'
      );
    });
  });

  describe('refreshToken', () => {
    it('should refresh tokens successfully', async () => {
      const refreshToken = 'valid-refresh-token';
      const mockUser = createMockUser({
        refreshToken,
      });

      const mockTokenPayload = {
        userId: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      };

      const mockNewTokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      mockAuthUtils.verifyRefreshToken.mockReturnValue(mockTokenPayload);
      mockPrismaUser.findUnique.mockResolvedValue(mockUser);
      mockAuthUtils.generateTokens.mockReturnValue(mockNewTokens);
      mockPrismaUser.update.mockResolvedValue({
        ...mockUser,
        refreshToken: 'new-refresh-token',
      });

      const result = await AuthService.refreshToken(refreshToken);

      expect(result).toEqual({
        user: expect.objectContaining({
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
        }),
        tokens: mockNewTokens,
      });

      expect(mockAuthUtils.verifyRefreshToken).toHaveBeenCalledWith(
        refreshToken
      );
      expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
    });

    it('should throw error for invalid refresh token', async () => {
      const refreshToken = 'invalid-refresh-token';

      mockAuthUtils.verifyRefreshToken.mockReturnValue(null);

      await expect(AuthService.refreshToken(refreshToken)).rejects.toThrow(
        'Invalid refresh token'
      );
    });

    it('should throw error for mismatched refresh token', async () => {
      const refreshToken = 'valid-refresh-token';
      const mockUser = createMockUser({
        refreshToken: 'different-refresh-token',
      });

      const mockTokenPayload = {
        userId: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      };

      mockAuthUtils.verifyRefreshToken.mockReturnValue(mockTokenPayload);
      mockPrismaUser.findUnique.mockResolvedValue(mockUser);

      await expect(AuthService.refreshToken(refreshToken)).rejects.toThrow(
        'Invalid refresh token'
      );
    });
  });

  describe('getUserById', () => {
    it('should get user profile successfully', async () => {
      const userId = 'user-123';
      const mockUser = createMockUser({ id: userId });

      mockPrismaUser.findUnique.mockResolvedValue(mockUser);

      const result = await AuthService.getUserById(userId);

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        avatar: mockUser.avatar,
        role: mockUser.role,
        isActive: mockUser.isActive,
        emailVerified: mockUser.emailVerified,
        baseCurrency: mockUser.baseCurrency,
        timezone: mockUser.timezone,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });

      expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should throw error for non-existent user', async () => {
      const userId = 'nonexistent-user';

      mockPrismaUser.findUnique.mockResolvedValue(null);

      await expect(AuthService.getUserById(userId)).rejects.toThrow(
        'User not found'
      );
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      const userId = 'user-123';
      const updateData = {
        name: 'Updated Name',
        baseCurrency: 'EUR',
        timezone: 'Europe/London',
      };

      const mockUser = createMockUser({ id: userId });
      const mockUpdatedUser = { ...mockUser, ...updateData };

      mockPrismaUser.findUnique.mockResolvedValue(mockUser);
      mockPrismaUser.update.mockResolvedValue(mockUpdatedUser);

      const result = await AuthService.updateProfile(userId, updateData);

      expect(result).toEqual({
        id: mockUpdatedUser.id,
        email: mockUpdatedUser.email,
        name: mockUpdatedUser.name,
        avatar: mockUpdatedUser.avatar,
        role: mockUpdatedUser.role,
        isActive: mockUpdatedUser.isActive,
        emailVerified: mockUpdatedUser.emailVerified,
        baseCurrency: mockUpdatedUser.baseCurrency,
        timezone: mockUpdatedUser.timezone,
        createdAt: mockUpdatedUser.createdAt,
        updatedAt: mockUpdatedUser.updatedAt,
      });

      expect(mockPrismaUser.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: updateData,
      });
    });

    it('should throw error for non-existent user', async () => {
      const userId = 'nonexistent-user';
      const updateData = { name: 'Updated Name' };

      mockPrismaUser.findUnique.mockResolvedValue(null);

      await expect(
        AuthService.updateProfile(userId, updateData)
      ).rejects.toThrow('User not found');
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const userId = 'user-123';
      const passwordData = {
        currentPassword: 'OldPassword123!',
        newPassword: 'NewPassword123!',
      };

      const mockUser = createMockUser({
        id: userId,
        passwordHash: 'old-hashed-password',
      });

      mockPrismaUser.findUnique.mockResolvedValue(mockUser);
      mockAuthUtils.comparePassword.mockResolvedValue(true);
      mockAuthUtils.validatePassword.mockReturnValue(true);
      mockAuthUtils.hashPassword.mockResolvedValue('new-hashed-password');
      mockPrismaUser.update.mockResolvedValue({
        ...mockUser,
        passwordHash: 'new-hashed-password',
      });

      await AuthService.changePassword(
        userId,
        passwordData.currentPassword,
        passwordData.newPassword
      );

      expect(mockAuthUtils.comparePassword).toHaveBeenCalledWith(
        passwordData.currentPassword,
        mockUser.passwordHash
      );
      expect(mockAuthUtils.validatePassword).toHaveBeenCalledWith(
        passwordData.newPassword
      );
      expect(mockAuthUtils.hashPassword).toHaveBeenCalledWith(
        passwordData.newPassword
      );
      expect(mockPrismaUser.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { passwordHash: 'new-hashed-password' },
      });
    });

    it('should throw error for incorrect current password', async () => {
      const userId = 'user-123';
      const passwordData = {
        currentPassword: 'WrongPassword123!',
        newPassword: 'NewPassword123!',
      };

      const mockUser = createMockUser({
        id: userId,
        passwordHash: 'old-hashed-password',
      });

      mockPrismaUser.findUnique.mockResolvedValue(mockUser);
      mockAuthUtils.comparePassword.mockResolvedValue(false);

      await expect(
        AuthService.changePassword(
          userId,
          passwordData.currentPassword,
          passwordData.newPassword
        )
      ).rejects.toThrow('Invalid current password');
    });

    it('should throw error for invalid new password', async () => {
      const userId = 'user-123';
      const passwordData = {
        currentPassword: 'OldPassword123!',
        newPassword: 'weak',
      };

      const mockUser = createMockUser({
        id: userId,
        passwordHash: 'old-hashed-password',
      });

      mockPrismaUser.findUnique.mockResolvedValue(mockUser);
      mockAuthUtils.comparePassword.mockResolvedValue(true);
      mockAuthUtils.validatePassword.mockReturnValue(false);

      await expect(
        AuthService.changePassword(
          userId,
          passwordData.currentPassword,
          passwordData.newPassword
        )
      ).rejects.toThrow('Invalid new password format');
    });
  });

  describe('findUserByEmail', () => {
    it('should find user by email successfully', async () => {
      const email = 'test@example.com';
      const mockUser = createMockUser({ email });

      mockPrismaUser.findUnique.mockResolvedValue(mockUser);

      const result = await AuthService.findUserByEmail(email);

      expect(result).toEqual(mockUser);
      expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
    });

    it('should return null for non-existent user', async () => {
      const email = 'nonexistent@example.com';

      mockPrismaUser.findUnique.mockResolvedValue(null);

      const result = await AuthService.findUserByEmail(email);

      expect(result).toBeNull();
    });
  });

  describe('findUserByGoogleId', () => {
    it('should find user by Google ID successfully', async () => {
      const googleId = 'google-123456789';
      const mockUser = createMockUser({ googleId });

      mockPrismaUser.findUnique.mockResolvedValue(mockUser);

      const result = await AuthService.findUserByGoogleId(googleId);

      expect(result).toEqual(mockUser);
      expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
        where: { googleId },
      });
    });

    it('should return null for non-existent user', async () => {
      const googleId = 'nonexistent-google-id';

      mockPrismaUser.findUnique.mockResolvedValue(null);

      const result = await AuthService.findUserByGoogleId(googleId);

      expect(result).toBeNull();
    });
  });

  describe('createUserFromGoogle', () => {
    it('should create user from Google profile successfully', async () => {
      const googleProfile = {
        googleId: 'google-123456789',
        email: 'test@example.com',
        name: 'Test User',
        avatar: 'https://example.com/avatar.jpg',
      };

      const mockUser = createMockUser({
        googleId: googleProfile.googleId,
        email: googleProfile.email,
        name: googleProfile.name,
        avatar: googleProfile.avatar,
      });

      mockPrismaUser.create.mockResolvedValue(mockUser);

      const result = await AuthService.createUserFromGoogle(googleProfile);

      expect(result).toEqual(mockUser);
      expect(mockPrismaUser.create).toHaveBeenCalledWith({
        data: {
          googleId: googleProfile.googleId,
          email: googleProfile.email,
          name: googleProfile.name,
          avatar: googleProfile.avatar,
          role: 'USER',
          emailVerified: true,
        },
      });
    });
  });

  describe('googleLogin', () => {
    it('should generate tokens for OAuth user successfully', async () => {
      const user = createMockUser();
      const mockTokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      mockAuthUtils.generateTokens.mockReturnValue(mockTokens);
      mockPrismaUser.update.mockResolvedValue({
        ...user,
        refreshToken: 'refresh-token',
      });

      const result = await AuthService.googleLogin(user);

      expect(result).toEqual({
        user: expect.objectContaining({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }),
        tokens: mockTokens,
      });

      expect(mockAuthUtils.generateTokens).toHaveBeenCalledWith({
        id: user.id,
        email: user.email,
        role: user.role,
      });
      expect(mockPrismaUser.update).toHaveBeenCalledWith({
        where: { id: user.id },
        data: {
          refreshToken: 'refresh-token',
          lastLoginAt: expect.any(Date),
        },
      });
    });
  });
});
