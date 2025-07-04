import { UserRole } from '@prisma/client';
import {
  Permission,
  ROLE_PERMISSIONS,
  canManageUser,
  getDefaultRole,
  getUserPermissions,
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
  hasRoleOrHigher,
} from '../../utils/roles';

describe('Role-based Permissions', () => {
  describe('hasPermission', () => {
    it('should return true for USER role with own profile permissions', () => {
      expect(hasPermission(UserRole.USER, Permission.READ_OWN_PROFILE)).toBe(
        true
      );
      expect(hasPermission(UserRole.USER, Permission.UPDATE_OWN_PROFILE)).toBe(
        true
      );
      expect(hasPermission(UserRole.USER, Permission.READ_OWN_ACCOUNTS)).toBe(
        true
      );
    });

    it('should return false for USER role with elevated permissions', () => {
      expect(hasPermission(UserRole.USER, Permission.READ_USER_PROFILES)).toBe(
        false
      );
      expect(hasPermission(UserRole.USER, Permission.MANAGE_USERS)).toBe(false);
      expect(
        hasPermission(UserRole.USER, Permission.SYSTEM_ADMINISTRATION)
      ).toBe(false);
    });

    it('should return true for MODERATOR role with user management permissions', () => {
      expect(
        hasPermission(UserRole.MODERATOR, Permission.READ_OWN_ACCOUNTS)
      ).toBe(true);
      expect(
        hasPermission(UserRole.MODERATOR, Permission.READ_USER_PROFILES)
      ).toBe(true);
      expect(
        hasPermission(UserRole.MODERATOR, Permission.MODERATE_CONTENT)
      ).toBe(true);
    });

    it('should return false for MODERATOR role with admin permissions', () => {
      expect(hasPermission(UserRole.MODERATOR, Permission.MANAGE_USERS)).toBe(
        false
      );
      expect(
        hasPermission(UserRole.MODERATOR, Permission.SYSTEM_ADMINISTRATION)
      ).toBe(false);
    });

    it('should return true for ADMIN role with administrative permissions', () => {
      expect(hasPermission(UserRole.ADMIN, Permission.READ_USER_PROFILES)).toBe(
        true
      );
      expect(hasPermission(UserRole.ADMIN, Permission.MODERATE_CONTENT)).toBe(
        true
      );
      expect(hasPermission(UserRole.ADMIN, Permission.MANAGE_USERS)).toBe(true);
      expect(hasPermission(UserRole.ADMIN, Permission.SYSTEM_SETTINGS)).toBe(
        true
      );
    });

    it('should return false for ADMIN role with super admin permissions', () => {
      expect(
        hasPermission(UserRole.ADMIN, Permission.SYSTEM_ADMINISTRATION)
      ).toBe(false);
    });

    it('should return true for SUPER_ADMIN role with all permissions', () => {
      expect(
        hasPermission(UserRole.SUPER_ADMIN, Permission.READ_USER_PROFILES)
      ).toBe(true);
      expect(hasPermission(UserRole.SUPER_ADMIN, Permission.MANAGE_USERS)).toBe(
        true
      );
      expect(
        hasPermission(UserRole.SUPER_ADMIN, Permission.SYSTEM_ADMINISTRATION)
      ).toBe(true);
    });
  });

  describe('hasAnyPermission', () => {
    it('should return true when user has at least one permission', () => {
      const permissions = [Permission.READ_USER_PROFILES];

      expect(hasAnyPermission(UserRole.MODERATOR, permissions)).toBe(true);
    });

    it('should return false when user has none of the permissions', () => {
      const permissions = [
        Permission.MANAGE_USERS,
        Permission.SYSTEM_ADMINISTRATION,
      ];

      expect(hasAnyPermission(UserRole.USER, permissions)).toBe(false);
    });

    it('should return true for empty permissions array', () => {
      expect(hasAnyPermission(UserRole.USER, [])).toBe(false);
    });
  });

  describe('hasAllPermissions', () => {
    it('should return true when user has all required permissions', () => {
      const permissions = [
        Permission.READ_USER_PROFILES,
        Permission.MANAGE_USERS,
      ];

      expect(hasAllPermissions(UserRole.ADMIN, permissions)).toBe(true);
    });

    it('should return false when user is missing any permission', () => {
      const permissions = [
        Permission.READ_USER_PROFILES,
        Permission.SYSTEM_ADMINISTRATION,
      ];

      expect(hasAllPermissions(UserRole.MODERATOR, permissions)).toBe(false);
    });

    it('should return true for empty permissions array', () => {
      expect(hasAllPermissions(UserRole.USER, [])).toBe(true);
    });
  });

  describe('hasRoleOrHigher', () => {
    it('should return true for exact role match', () => {
      expect(hasRoleOrHigher(UserRole.USER, UserRole.USER)).toBe(true);
      expect(hasRoleOrHigher(UserRole.ADMIN, UserRole.ADMIN)).toBe(true);
    });

    it('should return true for higher roles', () => {
      expect(hasRoleOrHigher(UserRole.ADMIN, UserRole.USER)).toBe(true);
      expect(hasRoleOrHigher(UserRole.SUPER_ADMIN, UserRole.MODERATOR)).toBe(
        true
      );
    });

    it('should return false for lower roles', () => {
      expect(hasRoleOrHigher(UserRole.USER, UserRole.ADMIN)).toBe(false);
      expect(hasRoleOrHigher(UserRole.MODERATOR, UserRole.SUPER_ADMIN)).toBe(
        false
      );
    });
  });

  describe('canManageUser', () => {
    it('should allow admins to manage lower role users', () => {
      expect(canManageUser(UserRole.ADMIN, UserRole.USER)).toBe(true);
      expect(canManageUser(UserRole.ADMIN, UserRole.MODERATOR)).toBe(true);
    });

    it('should prevent users from managing same or higher role users', () => {
      expect(canManageUser(UserRole.USER, UserRole.USER)).toBe(false);
      expect(canManageUser(UserRole.USER, UserRole.ADMIN)).toBe(false);
      expect(canManageUser(UserRole.MODERATOR, UserRole.ADMIN)).toBe(false);
    });

    it('should allow super admins to manage all users', () => {
      expect(canManageUser(UserRole.SUPER_ADMIN, UserRole.USER)).toBe(true);
      expect(canManageUser(UserRole.SUPER_ADMIN, UserRole.MODERATOR)).toBe(
        true
      );
      expect(canManageUser(UserRole.SUPER_ADMIN, UserRole.ADMIN)).toBe(true);
    });
  });

  describe('getDefaultRole', () => {
    it('should return USER as default role', () => {
      expect(getDefaultRole()).toBe(UserRole.USER);
    });
  });

  describe('ROLE_PERMISSIONS', () => {
    it('should contain correct permissions for USER role', () => {
      const userPermissions = ROLE_PERMISSIONS[UserRole.USER];

      expect(userPermissions).toContain(Permission.READ_OWN_PROFILE);
      expect(userPermissions).toContain(Permission.UPDATE_OWN_PROFILE);
      expect(userPermissions).toContain(Permission.READ_OWN_ACCOUNTS);
      expect(userPermissions).not.toContain(Permission.READ_USER_PROFILES);
    });

    it('should contain correct permissions for MODERATOR role', () => {
      const moderatorPermissions = ROLE_PERMISSIONS[UserRole.MODERATOR];

      expect(moderatorPermissions).toContain(Permission.READ_OWN_PROFILE);
      expect(moderatorPermissions).toContain(Permission.READ_USER_PROFILES);
      expect(moderatorPermissions).toContain(Permission.MODERATE_CONTENT);
      expect(moderatorPermissions).not.toContain(Permission.MANAGE_USERS);
    });

    it('should contain correct permissions for ADMIN role', () => {
      const adminPermissions = ROLE_PERMISSIONS[UserRole.ADMIN];

      expect(adminPermissions).toContain(Permission.READ_USER_PROFILES);
      expect(adminPermissions).toContain(Permission.MANAGE_USERS);
      expect(adminPermissions).toContain(Permission.SYSTEM_SETTINGS);
      expect(adminPermissions).not.toContain(Permission.SYSTEM_ADMINISTRATION);
    });

    it('should contain correct permissions for SUPER_ADMIN role', () => {
      const superAdminPermissions = ROLE_PERMISSIONS[UserRole.SUPER_ADMIN];

      expect(superAdminPermissions).toContain(Permission.READ_USER_PROFILES);
      expect(superAdminPermissions).toContain(Permission.MANAGE_USERS);
      expect(superAdminPermissions).toContain(Permission.SYSTEM_ADMINISTRATION);
    });
  });

  describe('getUserPermissions', () => {
    it('should return correct permissions for each role', () => {
      const userPermissions = getUserPermissions(UserRole.USER);

      expect(userPermissions).toEqual(ROLE_PERMISSIONS[UserRole.USER]);

      const adminPermissions = getUserPermissions(UserRole.ADMIN);

      expect(adminPermissions).toEqual(ROLE_PERMISSIONS[UserRole.ADMIN]);
    });
  });
});
