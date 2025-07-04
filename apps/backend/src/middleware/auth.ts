import { UserRole } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/env';
import {
  Permission,
  hasAnyPermission,
  hasPermission,
  hasRoleOrHigher,
} from '../utils/roles';

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: UserRole;
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user?: Express.User;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Response | void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      error: 'Access denied',
      message: 'No token provided',
    });
  }

  try {
    const decoded = jwt.verify(token, authConfig.jwtSecret) as JwtPayload;
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (error) {
    return res.status(403).json({
      error: 'Invalid token',
      message: 'Token is not valid',
    });
  }
};

export const optionalAuth = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, authConfig.jwtSecret) as JwtPayload;
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    // Invalid token, but we continue without user
  }

  next();
};

// Legacy role middleware for backwards compatibility
export const requireRole = (roles: UserRole[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Response | void => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'You must be logged in to access this resource',
      });
    }

    if (!req.user.role || !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: 'You do not have permission to access this resource',
      });
    }

    next();
  };
};

// New role-based authorization middleware
export const requireMinimumRole = (minimumRole: UserRole) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Response | void => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'You must be logged in to access this resource',
      });
    }

    if (!hasRoleOrHigher(req.user.role, minimumRole)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: `This resource requires ${minimumRole} role or higher`,
      });
    }

    next();
  };
};

// Permission-based authorization middleware
export const requirePermission = (permission: Permission) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Response | void => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'You must be logged in to access this resource',
      });
    }

    if (!hasPermission(req.user.role, permission)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: `You do not have permission to ${permission}`,
      });
    }

    next();
  };
};

// Multiple permissions middleware (requires ALL permissions)
export const requireAllPermissions = (permissions: Permission[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Response | void => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'You must be logged in to access this resource',
      });
    }

    const missingPermissions = permissions.filter(
      permission => !hasPermission(req.user!.role, permission)
    );

    if (missingPermissions.length > 0) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: `Missing required permissions: ${missingPermissions.join(', ')}`,
      });
    }

    next();
  };
};

// Multiple permissions middleware (requires ANY permission)
export const requireAnyPermission = (permissions: Permission[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Response | void => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'You must be logged in to access this resource',
      });
    }

    if (!hasAnyPermission(req.user.role, permissions)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: `You need at least one of these permissions: ${permissions.join(', ')}`,
      });
    }

    next();
  };
};

// Resource ownership middleware
export const requireOwnership = (resourceIdParam: string = 'id') => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Response | void => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'You must be logged in to access this resource',
      });
    }

    const resourceUserId = req.params[resourceIdParam] || req.body.userId;

    // Allow access if user owns the resource or has admin privileges
    if (
      req.user.id === resourceUserId ||
      hasRoleOrHigher(req.user.role, UserRole.ADMIN)
    ) {
      return next();
    }

    return res.status(403).json({
      error: 'Access denied',
      message: 'You can only access your own resources',
    });
  };
};

// Admin-only middleware
export const requireAdmin = requireMinimumRole(UserRole.ADMIN);

// Super admin-only middleware
export const requireSuperAdmin = requireMinimumRole(UserRole.SUPER_ADMIN);

// Moderator-only middleware
export const requireModerator = requireMinimumRole(UserRole.MODERATOR);
