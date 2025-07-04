import { jest } from '@jest/globals';
import { UserRole } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import {
  authenticateToken,
  optionalAuth,
  requireAllPermissions,
  requireAnyPermission,
  requireMinimumRole,
  requireOwnership,
  requirePermission,
} from '../../middleware/auth';
import * as authUtils from '../../utils/auth';
import { Permission } from '../../utils/roles';
import {
  createMockNext,
  createMockRequest,
  createMockResponse,
} from '../setup';

// Mock the auth utils
jest.mock('../../utils/auth');
const mockAuthUtils = authUtils as jest.Mocked<typeof authUtils>;

describe('Auth Middleware', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    req = createMockRequest();
    res = createMockResponse();
    next = createMockNext();
  });

  describe('authenticateToken', () => {
    it('should authenticate valid token and set user', () => {
      const token = 'valid-token';
      const mockPayload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: UserRole.USER,
      };

      req.headers = { authorization: `Bearer ${token}` };
      mockAuthUtils.verifyAccessToken.mockReturnValue(mockPayload);

      authenticateToken(req, res, next);

      expect(mockAuthUtils.verifyAccessToken).toHaveBeenCalledWith(token);
      expect(req.user).toEqual(mockPayload);
      expect(next).toHaveBeenCalled();
    });

    it('should handle missing authorization header', () => {
      req.headers = {};

      authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Access token required' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle malformed authorization header', () => {
      req.headers = { authorization: 'InvalidFormat' };

      authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token format' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle authorization header without Bearer', () => {
      req.headers = { authorization: 'Basic some-token' };

      authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token format' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle invalid token', () => {
      const token = 'invalid-token';

      req.headers = { authorization: `Bearer ${token}` };
      mockAuthUtils.verifyAccessToken.mockReturnValue(null);

      authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid or expired token',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle expired token', () => {
      const token = 'expired-token';

      req.headers = { authorization: `Bearer ${token}` };
      mockAuthUtils.verifyAccessToken.mockReturnValue(null);

      authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid or expired token',
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('optionalAuth', () => {
    it('should authenticate valid token and set user', () => {
      const token = 'valid-token';
      const mockPayload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: UserRole.USER,
      };

      req.headers = { authorization: `Bearer ${token}` };
      mockAuthUtils.verifyAccessToken.mockReturnValue(mockPayload);

      optionalAuth(req, res, next);

      expect(mockAuthUtils.verifyAccessToken).toHaveBeenCalledWith(token);
      expect(req.user).toEqual(mockPayload);
      expect(next).toHaveBeenCalled();
    });

    it('should continue without authentication when no token provided', () => {
      req.headers = {};

      optionalAuth(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalled();
    });

    it('should continue without authentication when token is invalid', () => {
      const token = 'invalid-token';

      req.headers = { authorization: `Bearer ${token}` };
      mockAuthUtils.verifyAccessToken.mockReturnValue(null);

      optionalAuth(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('requireMinimumRole', () => {
    it('should allow access for users with minimum role', () => {
      const middleware = requireMinimumRole(UserRole.USER);

      req.user = {
        id: 'user-123',
        email: 'test@example.com',
        role: UserRole.USER,
      };

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should allow access for users with higher role', () => {
      const middleware = requireMinimumRole(UserRole.USER);

      req.user = {
        id: 'admin-123',
        email: 'admin@example.com',
        role: UserRole.ADMIN,
      };

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should deny access for users with lower role', () => {
      const middleware = requireMinimumRole(UserRole.ADMIN);

      req.user = {
        id: 'user-123',
        email: 'test@example.com',
        role: UserRole.USER,
      };

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Insufficient permissions',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should deny access for unauthenticated users', () => {
      const middleware = requireMinimumRole(UserRole.USER);

      req.user = undefined;

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Authentication required',
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('requirePermission', () => {
    it('should allow access for users with required permission', () => {
      const middleware = requirePermission(Permission.READ_OWN_PROFILE);

      req.user = {
        id: 'user-123',
        email: 'test@example.com',
        role: UserRole.USER,
      };

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should deny access for users without required permission', () => {
      const middleware = requirePermission(Permission.MANAGE_USERS);

      req.user = {
        id: 'user-123',
        email: 'test@example.com',
        role: UserRole.USER,
      };

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Insufficient permissions',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should deny access for unauthenticated users', () => {
      const middleware = requirePermission(Permission.READ_OWN_PROFILE);

      req.user = undefined;

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Authentication required',
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('requireAllPermissions', () => {
    it('should allow access when user has all required permissions', () => {
      const permissions = [
        Permission.READ_OWN_PROFILE,
        Permission.UPDATE_OWN_PROFILE,
      ];
      const middleware = requireAllPermissions(permissions);

      req.user = {
        id: 'user-123',
        email: 'test@example.com',
        role: UserRole.USER,
      };

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should deny access when user is missing any required permission', () => {
      const permissions = [
        Permission.READ_OWN_PROFILE,
        Permission.MANAGE_USERS,
      ];
      const middleware = requireAllPermissions(permissions);

      req.user = {
        id: 'user-123',
        email: 'test@example.com',
        role: UserRole.USER,
      };

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Insufficient permissions',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should allow access for empty permissions array', () => {
      const middleware = requireAllPermissions([]);

      req.user = {
        id: 'user-123',
        email: 'test@example.com',
        role: UserRole.USER,
      };

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should deny access for unauthenticated users', () => {
      const permissions = [Permission.READ_OWN_PROFILE];
      const middleware = requireAllPermissions(permissions);

      req.user = undefined;

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Authentication required',
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('requireAnyPermission', () => {
    it('should allow access when user has at least one required permission', () => {
      const permissions = [
        Permission.READ_OWN_PROFILE,
        Permission.MANAGE_USERS,
      ];
      const middleware = requireAnyPermission(permissions);

      req.user = {
        id: 'user-123',
        email: 'test@example.com',
        role: UserRole.USER,
      };

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should deny access when user has none of the required permissions', () => {
      const permissions = [
        Permission.MANAGE_USERS,
        Permission.SYSTEM_ADMINISTRATION,
      ];
      const middleware = requireAnyPermission(permissions);

      req.user = {
        id: 'user-123',
        email: 'test@example.com',
        role: UserRole.USER,
      };

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Insufficient permissions',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should deny access for empty permissions array', () => {
      const middleware = requireAnyPermission([]);

      req.user = {
        id: 'user-123',
        email: 'test@example.com',
        role: UserRole.USER,
      };

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Insufficient permissions',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should deny access for unauthenticated users', () => {
      const permissions = [Permission.READ_OWN_PROFILE];
      const middleware = requireAnyPermission(permissions);

      req.user = undefined;

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Authentication required',
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('requireOwnership', () => {
    it('should allow access when user owns the resource', () => {
      const middleware = requireOwnership('id');

      req.user = {
        id: 'user-123',
        email: 'test@example.com',
        role: UserRole.USER,
      };
      req.params = { id: 'user-123' };

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should deny access when user does not own the resource', () => {
      const middleware = requireOwnership('id');

      req.user = {
        id: 'user-123',
        email: 'test@example.com',
        role: UserRole.USER,
      };
      req.params = { id: 'different-user-123' };

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Access denied' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should allow access for admins even if they do not own the resource', () => {
      const middleware = requireOwnership('id');

      req.user = {
        id: 'admin-123',
        email: 'admin@example.com',
        role: UserRole.ADMIN,
      };
      req.params = { id: 'user-123' };

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should allow access for super admins even if they do not own the resource', () => {
      const middleware = requireOwnership('id');

      req.user = {
        id: 'super-admin-123',
        email: 'super@example.com',
        role: UserRole.SUPER_ADMIN,
      };
      req.params = { id: 'user-123' };

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should deny access for moderators who do not own the resource', () => {
      const middleware = requireOwnership('id');

      req.user = {
        id: 'mod-123',
        email: 'mod@example.com',
        role: UserRole.MODERATOR,
      };
      req.params = { id: 'user-123' };

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Access denied' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should deny access for unauthenticated users', () => {
      const middleware = requireOwnership('id');

      req.user = undefined;
      req.params = { id: 'user-123' };

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Authentication required',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle missing parameter', () => {
      const middleware = requireOwnership('id');

      req.user = {
        id: 'user-123',
        email: 'test@example.com',
        role: UserRole.USER,
      };
      req.params = {};

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Resource ID required' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should work with different parameter names', () => {
      const middleware = requireOwnership('accountId');

      req.user = {
        id: 'user-123',
        email: 'test@example.com',
        role: UserRole.USER,
      };
      req.params = { accountId: 'user-123' };

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('middleware chaining', () => {
    it('should work with multiple middleware functions', () => {
      const authMiddleware = authenticateToken;
      const roleMiddleware = requireMinimumRole(UserRole.USER);
      const permissionMiddleware = requirePermission(
        Permission.READ_OWN_PROFILE
      );

      const token = 'valid-token';
      const mockPayload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: UserRole.USER,
      };

      req.headers = { authorization: `Bearer ${token}` };
      mockAuthUtils.verifyAccessToken.mockReturnValue(mockPayload);

      // First middleware - authentication
      authMiddleware(req, res, next);
      expect(req.user).toEqual(mockPayload);
      expect(next).toHaveBeenCalledTimes(1);

      // Second middleware - role check
      roleMiddleware(req, res, next);
      expect(next).toHaveBeenCalledTimes(2);

      // Third middleware - permission check
      permissionMiddleware(req, res, next);
      expect(next).toHaveBeenCalledTimes(3);
    });

    it('should stop chain when authentication fails', () => {
      const authMiddleware = authenticateToken;
      const roleMiddleware = requireMinimumRole(UserRole.USER);

      req.headers = { authorization: 'Bearer invalid-token' };
      mockAuthUtils.verifyAccessToken.mockReturnValue(null);

      // First middleware - authentication (should fail)
      authMiddleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();

      // Second middleware should not be called
      roleMiddleware(req, res, next);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
