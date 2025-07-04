import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { AuthService } from '../services/auth';
import { canManageUser, isValidRole } from '../utils/roles';

export class AdminController {
  // Get all users (paginated)
  static async getAllUsers(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;

      const result = await AuthService.getAllUsers(page, limit, search);

      return res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to fetch users',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Get user by ID
  static async getUserById(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const { userId } = req.params;

      const user = await AuthService.getUserById(userId);

      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          message: 'User with the specified ID does not exist',
        });
      }

      return res.json({
        success: true,
        data: { user },
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to fetch user',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Update user role
  static async updateUserRole(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!isValidRole(role)) {
        return res.status(400).json({
          error: 'Invalid role',
          message: 'Role must be one of: USER, MODERATOR, ADMIN, SUPER_ADMIN',
        });
      }

      // Get target user to check current role
      const targetUser = await AuthService.getUserById(userId);

      if (!targetUser) {
        return res.status(404).json({
          error: 'User not found',
          message: 'User with the specified ID does not exist',
        });
      }

      // Check if the admin can manage this user
      if (!canManageUser(req.user!.role, targetUser.role)) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          message: 'You cannot modify users with equal or higher privileges',
        });
      }

      // Check if admin can assign the new role
      if (!canManageUser(req.user!.role, role)) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          message: 'You cannot assign a role equal or higher than your own',
        });
      }

      const updatedUser = await AuthService.updateUserRole(userId, role);

      return res.json({
        success: true,
        data: { user: updatedUser },
        message: 'User role updated successfully',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to update user role',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Deactivate user
  static async deactivateUser(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const { userId } = req.params;

      // Get target user to check current role
      const targetUser = await AuthService.getUserById(userId);

      if (!targetUser) {
        return res.status(404).json({
          error: 'User not found',
          message: 'User with the specified ID does not exist',
        });
      }

      // Check if the admin can manage this user
      if (!canManageUser(req.user!.role, targetUser.role)) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          message:
            'You cannot deactivate users with equal or higher privileges',
        });
      }

      // Prevent self-deactivation
      if (req.user!.id === userId) {
        return res.status(400).json({
          error: 'Invalid operation',
          message: 'You cannot deactivate your own account',
        });
      }

      const deactivatedUser = await AuthService.deactivateUser(userId);

      return res.json({
        success: true,
        data: { user: deactivatedUser },
        message: 'User deactivated successfully',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to deactivate user',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Reactivate user
  static async reactivateUser(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const { userId } = req.params;

      // Get target user to check current role
      const targetUser = await AuthService.getUserById(userId);

      if (!targetUser) {
        return res.status(404).json({
          error: 'User not found',
          message: 'User with the specified ID does not exist',
        });
      }

      // Check if the admin can manage this user
      if (!canManageUser(req.user!.role, targetUser.role)) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          message:
            'You cannot reactivate users with equal or higher privileges',
        });
      }

      const reactivatedUser = await AuthService.reactivateUser(userId);

      return res.json({
        success: true,
        data: { user: reactivatedUser },
        message: 'User reactivated successfully',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to reactivate user',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Get system statistics (for dashboard)
  static async getSystemStats(
    _req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const stats = await AuthService.getSystemStats();

      return res.json({
        success: true,
        data: { stats },
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to fetch system statistics',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
