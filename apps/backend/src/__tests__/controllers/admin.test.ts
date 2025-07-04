import { jest } from '@jest/globals';
import { Request, Response } from 'express';
import { AdminController } from '../../controllers/admin';
import { AuthService } from '../../services/auth';
import {
  createMockRequest,
  createMockResponse,
  createMockUser,
} from '../setup';

// Mock the AuthService
jest.mock('../../services/auth', () => ({
  AuthService: {
    getAllUsers: jest.fn(),
    getUserById: jest.fn(),
    updateUserRole: jest.fn(),
    deactivateUser: jest.fn(),
    reactivateUser: jest.fn(),
    getSystemStats: jest.fn(),
    deleteUser: jest.fn(),
  },
}));

// Get the mocked AuthService
const mockAuthService = AuthService as jest.Mocked<typeof AuthService>;

describe('AdminController', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    jest.clearAllMocks();
    req = createMockRequest();
    res = createMockResponse();
  });

  describe('getAllUsers', () => {
    it('should get all users with default pagination', async () => {
      const mockUsers = [
        createMockUser({ id: 'user1' }),
        createMockUser({ id: 'user2' }),
      ];

      const mockResult = {
        users: mockUsers,
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          pages: 1,
        },
      };

      req.user = {
        id: 'admin-123',
        email: 'admin@example.com',
        role: 'ADMIN',
      };

      mockAuthService.getAllUsers.mockResolvedValue(mockResult);

      await AdminController.getAllUsers(req, res);

      expect(mockAuthService.getAllUsers).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: undefined,
        role: undefined,
        isActive: undefined,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should get all users with search query', async () => {
      const mockUsers = [createMockUser({ name: 'John Doe' })];

      const mockResult = {
        users: mockUsers,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          pages: 1,
        },
      };

      req.user = {
        id: 'admin-123',
        email: 'admin@example.com',
        role: 'ADMIN',
      };
      req.query = { search: 'john' };

      mockAuthService.getAllUsers.mockResolvedValue(mockResult);

      await AdminController.getAllUsers(req, res);

      expect(mockAuthService.getAllUsers).toHaveBeenCalledWith(1, 10, 'john');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should get all users with role filter', async () => {
      const mockUsers = [createMockUser({ role: 'MODERATOR' })];

      const mockResult = {
        users: mockUsers,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          pages: 1,
        },
      };

      req.user = {
        id: 'admin-123',
        email: 'admin@example.com',
        role: 'ADMIN',
      };
      req.query = { role: 'MODERATOR' };

      mockAuthService.getAllUsers.mockResolvedValue(mockResult);

      await AdminController.getAllUsers(req, res);

      expect(mockAuthService.getAllUsers).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: undefined,
        role: 'MODERATOR',
        isActive: undefined,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should get all users with active status filter', async () => {
      const mockUsers = [createMockUser({ isActive: true })];

      const mockResult = {
        users: mockUsers,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          pages: 1,
        },
      };

      req.user = {
        id: 'admin-123',
        email: 'admin@example.com',
        role: 'ADMIN',
      };
      req.query = { isActive: 'true' };

      mockAuthService.getAllUsers.mockResolvedValue(mockResult);

      await AdminController.getAllUsers(req, res);

      expect(mockAuthService.getAllUsers).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: undefined,
        role: undefined,
        isActive: true,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle server errors', async () => {
      const error = new Error('Database connection failed');

      req.user = {
        id: 'admin-123',
        email: 'admin@example.com',
        role: 'ADMIN',
      };

      mockAuthService.getAllUsers.mockRejectedValue(error);

      await AdminController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('updateUserRole', () => {
    it('should update user role successfully', async () => {
      const targetUserId = 'user-123';
      const newRole = 'MODERATOR';

      const mockUpdatedUser = createMockUser({
        id: targetUserId,
        role: newRole,
      });

      req.user = {
        id: 'admin-123',
        email: 'admin@example.com',
        role: 'ADMIN',
      };
      req.params = { userId: targetUserId };
      req.body = { role: newRole };

      mockAuthService.updateUserRole.mockResolvedValue(mockUpdatedUser);

      await AdminController.updateUserRole(req, res);

      expect(mockAuthService.updateUserRole).toHaveBeenCalledWith(
        targetUserId,
        newRole
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User role updated successfully',
        user: {
          id: mockUpdatedUser.id,
          email: mockUpdatedUser.email,
          name: mockUpdatedUser.name,
          role: mockUpdatedUser.role,
          isActive: mockUpdatedUser.isActive,
          emailVerified: mockUpdatedUser.emailVerified,
        },
      });
    });

    it('should handle missing role in request body', async () => {
      const targetUserId = 'user-123';

      req.user = {
        id: 'admin-123',
        email: 'admin@example.com',
        role: 'ADMIN',
      };
      req.params = { userId: targetUserId };
      req.body = {}; // Missing role

      await AdminController.updateUserRole(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Role is required',
      });
    });

    it('should handle invalid role', async () => {
      const targetUserId = 'user-123';
      const invalidRole = 'INVALID_ROLE';

      const error = new Error('Invalid role specified');

      req.user = {
        id: 'admin-123',
        email: 'admin@example.com',
        role: 'ADMIN',
      };
      req.params = { userId: targetUserId };
      req.body = { role: invalidRole };

      mockAuthService.updateUserRole.mockRejectedValue(error);

      await AdminController.updateUserRole(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });

    it('should handle user not found', async () => {
      const targetUserId = 'nonexistent-user';
      const newRole = 'MODERATOR';

      const error = new Error('User not found');

      req.user = {
        id: 'admin-123',
        email: 'admin@example.com',
        role: 'ADMIN',
      };
      req.params = { userId: targetUserId };
      req.body = { role: newRole };

      mockAuthService.updateUserRole.mockRejectedValue(error);

      await AdminController.updateUserRole(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('deactivateUser', () => {
    it('should deactivate user successfully', async () => {
      const targetUserId = 'user-123';

      const mockDeactivatedUser = createMockUser({
        id: targetUserId,
        isActive: false,
      });

      req.user = {
        id: 'admin-123',
        email: 'admin@example.com',
        role: 'ADMIN',
      };
      req.params = { userId: targetUserId };

      mockAuthService.deactivateUser.mockResolvedValue(mockDeactivatedUser);

      await AdminController.deactivateUser(req, res);

      expect(mockAuthService.deactivateUser).toHaveBeenCalledWith(targetUserId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User deactivated successfully',
        user: {
          id: mockDeactivatedUser.id,
          email: mockDeactivatedUser.email,
          name: mockDeactivatedUser.name,
          role: mockDeactivatedUser.role,
          isActive: mockDeactivatedUser.isActive,
          emailVerified: mockDeactivatedUser.emailVerified,
        },
      });
    });

    it('should handle user not found', async () => {
      const targetUserId = 'nonexistent-user';
      const error = new Error('User not found');

      req.user = {
        id: 'admin-123',
        email: 'admin@example.com',
        role: 'ADMIN',
      };
      req.params = { userId: targetUserId };

      mockAuthService.deactivateUser.mockRejectedValue(error);

      await AdminController.deactivateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });

    it('should handle insufficient permissions', async () => {
      const targetUserId = 'user-123';
      const error = new Error('Insufficient permissions');

      req.user = {
        id: 'admin-123',
        email: 'admin@example.com',
        role: 'ADMIN',
      };
      req.params = { userId: targetUserId };

      mockAuthService.deactivateUser.mockRejectedValue(error);

      await AdminController.deactivateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });

    it('should handle user already deactivated', async () => {
      const targetUserId = 'user-123';
      const error = new Error('User already deactivated');

      req.user = {
        id: 'admin-123',
        email: 'admin@example.com',
        role: 'ADMIN',
      };
      req.params = { userId: targetUserId };

      mockAuthService.deactivateUser.mockRejectedValue(error);

      await AdminController.deactivateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('reactivateUser', () => {
    it('should reactivate user successfully', async () => {
      const targetUserId = 'user-123';

      const mockActivatedUser = createMockUser({
        id: targetUserId,
        isActive: true,
      });

      req.user = {
        id: 'admin-123',
        email: 'admin@example.com',
        role: 'ADMIN',
      };
      req.params = { userId: targetUserId };

      mockAuthService.reactivateUser.mockResolvedValue(mockActivatedUser);

      await AdminController.reactivateUser(req, res);

      expect(mockAuthService.reactivateUser).toHaveBeenCalledWith(targetUserId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User reactivated successfully',
        user: {
          id: mockActivatedUser.id,
          email: mockActivatedUser.email,
          name: mockActivatedUser.name,
          role: mockActivatedUser.role,
          isActive: mockActivatedUser.isActive,
          emailVerified: mockActivatedUser.emailVerified,
        },
      });
    });

    it('should handle user not found', async () => {
      const targetUserId = 'nonexistent-user';
      const error = new Error('User not found');

      req.user = {
        id: 'admin-123',
        email: 'admin@example.com',
        role: 'ADMIN',
      };
      req.params = { userId: targetUserId };

      mockAuthService.reactivateUser.mockRejectedValue(error);

      await AdminController.reactivateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });

    it('should handle user already active', async () => {
      const targetUserId = 'user-123';
      const error = new Error('User already active');

      req.user = {
        id: 'admin-123',
        email: 'admin@example.com',
        role: 'ADMIN',
      };
      req.params = { userId: targetUserId };

      mockAuthService.reactivateUser.mockRejectedValue(error);

      await AdminController.reactivateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getSystemStats', () => {
    it('should get system stats successfully', async () => {
      const mockStats = {
        totalUsers: 150,
        activeUsers: 120,
        inactiveUsers: 30,
        totalAdmins: 5,
        totalModerators: 10,
        recentRegistrations: 25,
        systemInfo: {
          uptime: '7 days',
          version: '1.0.0',
        },
      };

      req.user = {
        id: 'admin-123',
        email: 'admin@example.com',
        role: 'ADMIN',
      };

      mockAuthService.getSystemStats.mockResolvedValue(mockStats);

      await AdminController.getSystemStats(req, res);

      expect(mockAuthService.getSystemStats).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockStats);
    });

    it('should handle server errors', async () => {
      const error = new Error('Database connection failed');

      req.user = {
        id: 'admin-123',
        email: 'admin@example.com',
        role: 'ADMIN',
      };

      mockAuthService.getSystemStats.mockRejectedValue(error);

      await AdminController.getSystemStats(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const targetUserId = 'user-123';

      req.params = { id: targetUserId };
      req.user = {
        id: 'super-admin-123',
        email: 'super@example.com',
        role: UserRole.SUPER_ADMIN,
      };
      mockAuthService.deleteUser.mockResolvedValue(undefined);

      await AdminController.deleteUser(req, res);

      expect(mockAuthService.deleteUser).toHaveBeenCalledWith(targetUserId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User deleted successfully',
      });
    });

    it('should handle authorization errors', async () => {
      const targetUserId = 'user-123';
      const error = new Error('Insufficient permissions');

      req.params = { id: targetUserId };
      req.user = {
        id: 'admin-123',
        email: 'admin@example.com',
        role: UserRole.ADMIN,
      };
      mockAuthService.deleteUser.mockRejectedValue(error);

      await AdminController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Insufficient permissions',
      });
    });

    it('should handle user not found', async () => {
      const targetUserId = 'nonexistent-user';
      const error = new Error('User not found');

      req.params = { id: targetUserId };
      req.user = {
        id: 'super-admin-123',
        email: 'super@example.com',
        role: UserRole.SUPER_ADMIN,
      };
      mockAuthService.deleteUser.mockRejectedValue(error);

      await AdminController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'User not found',
      });
    });

    it('should handle self-deletion prevention', async () => {
      const targetUserId = 'super-admin-123';
      const error = new Error('Cannot delete your own account');

      req.params = { id: targetUserId };
      req.user = {
        id: 'super-admin-123',
        email: 'super@example.com',
        role: UserRole.SUPER_ADMIN,
      };
      mockAuthService.deleteUser.mockRejectedValue(error);

      await AdminController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Cannot delete your own account',
      });
    });
  });

  describe('error handling', () => {
    it('should handle server errors in getAllUsers', async () => {
      const error = new Error('Database connection failed');

      req.user = {
        id: 'admin-123',
        email: 'admin@example.com',
        role: 'ADMIN',
      };

      mockAuthService.getAllUsers.mockRejectedValue(error);

      await AdminController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });

    it('should handle string errors in updateUserRole', async () => {
      const targetUserId = 'user-123';
      const newRole = 'MODERATOR';

      req.user = {
        id: 'admin-123',
        email: 'admin@example.com',
        role: 'ADMIN',
      };
      req.params = { userId: targetUserId };
      req.body = { role: newRole };

      mockAuthService.updateUserRole.mockRejectedValue('String error');

      await AdminController.updateUserRole(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'String error' });
    });

    it('should handle object errors in updateUserRole', async () => {
      const targetUserId = 'user-123';
      const newRole = 'MODERATOR';

      req.user = {
        id: 'admin-123',
        email: 'admin@example.com',
        role: 'ADMIN',
      };
      req.params = { userId: targetUserId };
      req.body = { role: newRole };

      mockAuthService.updateUserRole.mockRejectedValue(
        new Error('Object error')
      );

      await AdminController.updateUserRole(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Object error' });
    });
  });
});
