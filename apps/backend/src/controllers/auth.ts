import { Request, Response } from 'express';
import Joi from 'joi';
import passport from 'passport';
import { AuthenticatedRequest } from '../middleware/auth';
import { AuthService } from '../services/auth';

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
});

const updateProfileSchema = Joi.object({
  name: Joi.string().optional(),
  avatar: Joi.string().uri().optional(),
  baseCurrency: Joi.string().length(3).optional(),
  timezone: Joi.string().optional(),
});

export class AuthController {
  // POST /api/auth/register
  static async register(req: Request, res: Response): Promise<Response | void> {
    try {
      const { error, value } = registerSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          error: 'Validation error',
          message: error.details[0].message,
        });
      }

      const result = await AuthService.register(value);

      res.status(201).json({
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({
        error: 'Registration failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // POST /api/auth/login
  static async login(req: Request, res: Response): Promise<Response | void> {
    try {
      const { error, value } = loginSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          error: 'Validation error',
          message: error.details[0].message,
        });
      }

      const result = await AuthService.login(value);

      res.json({
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({
        error: 'Login failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // POST /api/auth/refresh
  static async refreshToken(
    req: Request,
    res: Response
  ): Promise<Response | void> {
    try {
      const { error, value } = refreshTokenSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          error: 'Validation error',
          message: error.details[0].message,
        });
      }

      const result = await AuthService.refreshToken(value.refreshToken);

      res.json({
        message: 'Token refreshed successfully',
        data: result,
      });
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(401).json({
        error: 'Token refresh failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // POST /api/auth/logout
  static async logout(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response | void> {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required',
          message: 'User not authenticated',
        });
      }

      await AuthService.logout(req.user.id);

      res.json({
        message: 'Logout successful',
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        error: 'Logout failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // GET /api/auth/me
  static async getProfile(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response | void> {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required',
          message: 'User not authenticated',
        });
      }

      const user = await AuthService.getUserById(req.user.id);
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          message: 'User does not exist',
        });
      }

      res.json({
        message: 'Profile retrieved successfully',
        data: user,
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        error: 'Failed to retrieve profile',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // PUT /api/auth/profile
  static async updateProfile(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response | void> {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required',
          message: 'User not authenticated',
        });
      }

      const { error, value } = updateProfileSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          error: 'Validation error',
          message: error.details[0].message,
        });
      }

      const user = await AuthService.updateProfile(req.user.id, value);

      res.json({
        message: 'Profile updated successfully',
        data: user,
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        error: 'Failed to update profile',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // PUT /api/auth/password
  static async changePassword(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response | void> {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required',
          message: 'User not authenticated',
        });
      }

      const { error, value } = changePasswordSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          error: 'Validation error',
          message: error.details[0].message,
        });
      }

      await AuthService.changePassword(
        req.user.id,
        value.currentPassword,
        value.newPassword
      );

      res.json({
        message: 'Password changed successfully',
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(400).json({
        error: 'Failed to change password',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // POST /api/auth/verify-email
  static async verifyEmail(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response | void> {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required',
          message: 'User not authenticated',
        });
      }

      await AuthService.verifyEmail(req.user.id);

      res.json({
        message: 'Email verified successfully',
      });
    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({
        error: 'Failed to verify email',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // GET /api/auth/google
  static googleAuth = passport.authenticate('google', {
    scope: ['profile', 'email'],
  });

  // GET /api/auth/google/callback
  static async googleCallback(req: Request, res: Response): Promise<void> {
    try {
      // User is available from passport after successful authentication
      const passportUser = req.user as any;

      if (!passportUser) {
        return res.redirect(
          `${process.env.CORS_ORIGIN}/login?error=auth_failed`
        );
      }

      // Generate tokens for the user
      const authResult = await AuthService.googleLogin(passportUser);

      // Redirect to frontend with tokens (in production, consider more secure methods)
      const redirectUrl = `${process.env.CORS_ORIGIN}/auth/success?token=${authResult.accessToken}&refresh=${authResult.refreshToken}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      res.redirect(`${process.env.CORS_ORIGIN}/login?error=server_error`);
    }
  }

  // GET /api/auth/google/callback (middleware version)
  static googleCallbackMiddleware = passport.authenticate('google', {
    failureRedirect: '/login?error=auth_failed',
  });
}

export default AuthController;
