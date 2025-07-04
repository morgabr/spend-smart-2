import { jest } from '@jest/globals';
import { Request, Response } from 'express';
import { AuthController } from '../../controllers/auth';
import { AuthService } from '../../services/auth';
import {
  createMockRequest,
  createMockResponse,
  createMockUser,
} from '../setup';

// Mock the AuthService
jest.mock('../../services/auth', () => ({
  AuthService: {
    register: jest.fn(),
    login: jest.fn(),
    refreshToken: jest.fn(),
    logout: jest.fn(),
    getUserById: jest.fn(),
    updateProfile: jest.fn(),
    changePassword: jest.fn(),
    verifyEmail: jest.fn(),
    googleLogin: jest.fn(),
  },
}));

// Get the mocked AuthService
const mockAuthService = AuthService as jest.Mocked<typeof AuthService>;

describe('AuthController', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = createMockRequest();
    res = createMockResponse();
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User',
      };

      const mockResult = {
        user: createMockUser({ email: userData.email }),
        tokens: {
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
        },
      };

      req.body = userData;

      mockAuthService.register.mockResolvedValue(mockResult);

      await AuthController.register(req, res);

      expect(mockAuthService.register).toHaveBeenCalledWith(userData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle validation errors', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'weak',
        name: '',
      };

      const error = new Error('Validation failed');

      req.body = userData;

      mockAuthService.register.mockRejectedValue(error);

      await AuthController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });

    it('should handle email already exists error', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'Password123!',
        name: 'Test User',
      };

      const error = new Error('Email already exists');

      req.body = userData;

      mockAuthService.register.mockRejectedValue(error);

      await AuthController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const mockResult = {
        user: createMockUser({ email: credentials.email }),
        tokens: {
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
        },
      };

      req.body = credentials;

      mockAuthService.login.mockResolvedValue(mockResult);

      await AuthController.login(req, res);

      expect(mockAuthService.login).toHaveBeenCalledWith(credentials);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle invalid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const error = new Error('Invalid credentials');

      req.body = credentials;

      mockAuthService.login.mockRejectedValue(error);

      await AuthController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });

    it('should handle account not active error', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const error = new Error('Account not active');

      req.body = credentials;

      mockAuthService.login.mockRejectedValue(error);

      await AuthController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const refreshToken = 'valid-refresh-token';
      const mockResult = {
        user: createMockUser(),
        tokens: {
          accessToken: 'new-access-token',
          refreshToken: 'new-refresh-token',
        },
      };

      req.body = { refreshToken };

      mockAuthService.refreshToken.mockResolvedValue(mockResult);

      await AuthController.refreshToken(req, res);

      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(refreshToken);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle invalid refresh token', async () => {
      const refreshToken = 'invalid-refresh-token';
      const error = new Error('Invalid refresh token');

      req.body = { refreshToken };

      mockAuthService.refreshToken.mockRejectedValue(error);

      await AuthController.refreshToken(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      const userId = 'user-123';

      req.user = { id: userId, email: 'test@example.com', role: 'USER' };

      mockAuthService.logout.mockResolvedValue(undefined);

      await AuthController.logout(req, res);

      expect(mockAuthService.logout).toHaveBeenCalledWith(userId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Logged out successfully',
      });
    });

    it('should handle logout error', async () => {
      const userId = 'user-123';
      const error = new Error('Logout failed');

      req.user = { id: userId, email: 'test@example.com', role: 'USER' };

      mockAuthService.logout.mockRejectedValue(error);

      await AuthController.logout(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getProfile', () => {
    it('should get user profile successfully', async () => {
      const userId = 'user-123';
      const mockUser = createMockUser({ id: userId });

      req.user = { id: userId, email: 'test@example.com', role: 'USER' };

      mockAuthService.getUserById.mockResolvedValue(mockUser);

      await AuthController.getProfile(req, res);

      expect(mockAuthService.getUserById).toHaveBeenCalledWith(userId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should handle user not found error', async () => {
      const userId = 'nonexistent-user';
      const error = new Error('User not found');

      req.user = { id: userId, email: 'test@example.com', role: 'USER' };

      mockAuthService.getUserById.mockRejectedValue(error);

      await AuthController.getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
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

      const mockUpdatedUser = createMockUser({
        id: userId,
        ...updateData,
      });

      req.user = { id: userId, email: 'test@example.com', role: 'USER' };
      req.body = updateData;

      mockAuthService.updateProfile.mockResolvedValue(mockUpdatedUser);

      await AuthController.updateProfile(req, res);

      expect(mockAuthService.updateProfile).toHaveBeenCalledWith(
        userId,
        updateData
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUpdatedUser);
    });

    it('should handle update profile error', async () => {
      const userId = 'user-123';
      const updateData = { name: 'Updated Name' };
      const error = new Error('Update failed');

      req.user = { id: userId, email: 'test@example.com', role: 'USER' };
      req.body = updateData;

      mockAuthService.updateProfile.mockRejectedValue(error);

      await AuthController.updateProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const userId = 'user-123';
      const passwordData = {
        currentPassword: 'OldPassword123!',
        newPassword: 'NewPassword123!',
      };

      req.user = { id: userId, email: 'test@example.com', role: 'USER' };
      req.body = passwordData;

      mockAuthService.changePassword.mockResolvedValue(undefined);

      await AuthController.changePassword(req, res);

      expect(mockAuthService.changePassword).toHaveBeenCalledWith(
        userId,
        passwordData.currentPassword,
        passwordData.newPassword
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Password changed successfully',
      });
    });

    it('should handle invalid current password', async () => {
      const userId = 'user-123';
      const passwordData = {
        currentPassword: 'WrongPassword123!',
        newPassword: 'NewPassword123!',
      };

      const error = new Error('Invalid current password');

      req.user = { id: userId, email: 'test@example.com', role: 'USER' };
      req.body = passwordData;

      mockAuthService.changePassword.mockRejectedValue(error);

      await AuthController.changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });

    it('should handle weak new password', async () => {
      const userId = 'user-123';
      const passwordData = {
        currentPassword: 'OldPassword123!',
        newPassword: 'weak',
      };

      const error = new Error('Password does not meet requirements');

      req.user = { id: userId, email: 'test@example.com', role: 'USER' };
      req.body = passwordData;

      mockAuthService.changePassword.mockRejectedValue(error);

      await AuthController.changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('verifyEmail', () => {
    it('should verify email successfully', async () => {
      const userId = 'user-123';
      const verificationCode = 'valid-code';

      req.body = { userId, verificationCode };

      mockAuthService.verifyEmail.mockResolvedValue(undefined);

      await AuthController.verifyEmail(req, res);

      expect(mockAuthService.verifyEmail).toHaveBeenCalledWith(
        userId,
        verificationCode
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email verified successfully',
      });
    });

    it('should handle invalid verification code', async () => {
      const userId = 'user-123';
      const verificationCode = 'invalid-code';
      const error = new Error('Invalid verification code');

      req.body = { userId, verificationCode };

      mockAuthService.verifyEmail.mockRejectedValue(error);

      await AuthController.verifyEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('googleCallback', () => {
    it('should handle Google OAuth callback successfully', async () => {
      const mockUser = createMockUser({ email: 'google@example.com' });
      const mockResult = {
        user: mockUser,
        tokens: {
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
        },
      };

      req.user = mockUser;

      mockAuthService.googleLogin.mockResolvedValue(mockResult);

      await AuthController.googleCallback(req, res);

      expect(mockAuthService.googleLogin).toHaveBeenCalledWith(mockUser);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle Google OAuth failure', async () => {
      req.user = undefined;

      await AuthController.googleCallback(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Google authentication failed',
      });
    });
  });

  describe('error handling', () => {
    it('should handle registration errors with proper status codes', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User',
      };

      const error = new Error('Database connection failed');

      req.body = userData;

      mockAuthService.register.mockRejectedValue(error);

      await AuthController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });

    it('should handle string error messages', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User',
      };

      req.body = userData;

      mockAuthService.register.mockRejectedValue('String error message');

      await AuthController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'String error message' });
    });
  });
});
