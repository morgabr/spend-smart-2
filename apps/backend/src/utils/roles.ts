import { UserRole } from '@prisma/client';

// Role hierarchy (higher number = more permissions)
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  USER: 1,
  MODERATOR: 2,
  ADMIN: 3,
  SUPER_ADMIN: 4,
};

// Permission definitions
export enum Permission {
  // User permissions
  READ_OWN_PROFILE = 'read_own_profile',
  UPDATE_OWN_PROFILE = 'update_own_profile',
  DELETE_OWN_ACCOUNT = 'delete_own_account',

  // Financial data permissions
  READ_OWN_ACCOUNTS = 'read_own_accounts',
  WRITE_OWN_ACCOUNTS = 'write_own_accounts',
  READ_OWN_TRANSACTIONS = 'read_own_transactions',
  WRITE_OWN_TRANSACTIONS = 'write_own_transactions',
  READ_OWN_BUDGETS = 'read_own_budgets',
  WRITE_OWN_BUDGETS = 'write_own_budgets',
  READ_OWN_GOALS = 'read_own_goals',
  WRITE_OWN_GOALS = 'write_own_goals',

  // Moderator permissions
  READ_USER_PROFILES = 'read_user_profiles',
  MODERATE_CONTENT = 'moderate_content',
  VIEW_USER_ACTIVITY = 'view_user_activity',

  // Admin permissions
  MANAGE_USERS = 'manage_users',
  READ_ALL_DATA = 'read_all_data',
  SYSTEM_SETTINGS = 'system_settings',
  VIEW_ANALYTICS = 'view_analytics',

  // Super admin permissions
  MANAGE_ADMINS = 'manage_admins',
  SYSTEM_ADMINISTRATION = 'system_administration',
  BILLING_MANAGEMENT = 'billing_management',
}

// Define base permissions for each role
const USER_PERMISSIONS: Permission[] = [
  Permission.READ_OWN_PROFILE,
  Permission.UPDATE_OWN_PROFILE,
  Permission.DELETE_OWN_ACCOUNT,
  Permission.READ_OWN_ACCOUNTS,
  Permission.WRITE_OWN_ACCOUNTS,
  Permission.READ_OWN_TRANSACTIONS,
  Permission.WRITE_OWN_TRANSACTIONS,
  Permission.READ_OWN_BUDGETS,
  Permission.WRITE_OWN_BUDGETS,
  Permission.READ_OWN_GOALS,
  Permission.WRITE_OWN_GOALS,
];

const MODERATOR_PERMISSIONS: Permission[] = [
  ...USER_PERMISSIONS,
  Permission.READ_USER_PROFILES,
  Permission.MODERATE_CONTENT,
  Permission.VIEW_USER_ACTIVITY,
];

const ADMIN_PERMISSIONS: Permission[] = [
  ...MODERATOR_PERMISSIONS,
  Permission.MANAGE_USERS,
  Permission.READ_ALL_DATA,
  Permission.SYSTEM_SETTINGS,
  Permission.VIEW_ANALYTICS,
];

const SUPER_ADMIN_PERMISSIONS: Permission[] = [
  ...ADMIN_PERMISSIONS,
  Permission.MANAGE_ADMINS,
  Permission.SYSTEM_ADMINISTRATION,
  Permission.BILLING_MANAGEMENT,
];

// Role-based permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  USER: USER_PERMISSIONS,
  MODERATOR: MODERATOR_PERMISSIONS,
  ADMIN: ADMIN_PERMISSIONS,
  SUPER_ADMIN: SUPER_ADMIN_PERMISSIONS,
};

// Utility functions
export const hasPermission = (
  userRole: UserRole,
  permission: Permission
): boolean => {
  return ROLE_PERMISSIONS[userRole].includes(permission);
};

export const hasAnyPermission = (
  userRole: UserRole,
  permissions: Permission[]
): boolean => {
  return permissions.some(permission => hasPermission(userRole, permission));
};

export const hasAllPermissions = (
  userRole: UserRole,
  permissions: Permission[]
): boolean => {
  return permissions.every(permission => hasPermission(userRole, permission));
};

export const hasRoleOrHigher = (
  userRole: UserRole,
  requiredRole: UserRole
): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

export const canManageUser = (
  managerRole: UserRole,
  targetRole: UserRole
): boolean => {
  // Users can only manage users with lower hierarchy
  return ROLE_HIERARCHY[managerRole] > ROLE_HIERARCHY[targetRole];
};

// Role validation
export const isValidRole = (role: string): role is UserRole => {
  return Object.values(UserRole).includes(role as UserRole);
};

export const getDefaultRole = (): UserRole => {
  return UserRole.USER;
};

// Get user permissions
export const getUserPermissions = (userRole: UserRole): Permission[] => {
  return ROLE_PERMISSIONS[userRole] || [];
};

// Check if user can access resource
export const canAccessOwnResource = (userRole: UserRole): boolean => {
  return hasPermission(userRole, Permission.READ_OWN_PROFILE);
};

export const canAccessAnyUserResource = (userRole: UserRole): boolean => {
  return hasPermission(userRole, Permission.READ_USER_PROFILES);
};
