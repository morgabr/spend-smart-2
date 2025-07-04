import { Router } from 'express';
import AuthController from '../controllers/auth';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes (no authentication required)
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refreshToken);

// Google OAuth routes
router.get('/google', AuthController.googleAuth);
router.get(
  '/google/callback',
  AuthController.googleCallbackMiddleware,
  AuthController.googleCallback
);

// Protected routes (authentication required)
router.post('/logout', authenticateToken, AuthController.logout);
router.get('/me', authenticateToken, AuthController.getProfile);
router.put('/profile', authenticateToken, AuthController.updateProfile);
router.put('/password', authenticateToken, AuthController.changePassword);
router.post('/verify-email', authenticateToken, AuthController.verifyEmail);

export default router;
