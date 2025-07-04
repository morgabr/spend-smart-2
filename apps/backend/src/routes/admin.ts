import { Router } from 'express';
import { AdminController } from '../controllers/admin';
import {
  authenticateToken,
  requireAdmin,
  requireModerator,
  requirePermission,
} from '../middleware/auth';
import { Permission } from '../utils/roles';

const router = Router();

// All admin routes require authentication
router.use(authenticateToken);

// System statistics (moderators and above)
router.get('/stats', requireModerator, AdminController.getSystemStats);

// User management routes (admin and above)
router.get('/users', requireAdmin, AdminController.getAllUsers);
router.get('/users/:userId', requireAdmin, AdminController.getUserById);

// User modification routes (admin and above)
router.put('/users/:userId/role', requireAdmin, AdminController.updateUserRole);
router.put(
  '/users/:userId/deactivate',
  requireAdmin,
  AdminController.deactivateUser
);
router.put(
  '/users/:userId/reactivate',
  requireAdmin,
  AdminController.reactivateUser
);

// Alternative routes using permission-based access
router.get(
  '/users-alt',
  requirePermission(Permission.MANAGE_USERS),
  AdminController.getAllUsers
);
router.get(
  '/users-alt/:userId',
  requirePermission(Permission.READ_USER_PROFILES),
  AdminController.getUserById
);

export default router;
