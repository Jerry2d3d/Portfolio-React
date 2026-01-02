/**
 * Admin Model
 *
 * Extends the User model with admin-specific fields and permissions
 * Tracks admin role, creation date, and activity
 */

import { ObjectId } from 'mongodb';

/**
 * Admin User Document Interface
 * Extends the base User with admin-specific fields
 */
export interface AdminUser {
  _id?: ObjectId;
  email: string;
  password: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
  qrCodeId?: ObjectId;
  emailVerified?: boolean;
  // Admin-specific fields
  isAdmin: boolean;
  adminSince?: Date;
  lastAdminAction?: Date;
  adminPermissions?: AdminPermission[];
}

/**
 * Admin Permissions
 * Defines what actions an admin can perform
 */
export type AdminPermission =
  | 'manage_users'
  | 'delete_users'
  | 'verify_emails'
  | 'view_analytics'
  | 'manage_admins';

/**
 * Default permissions for a new admin
 */
export const DEFAULT_ADMIN_PERMISSIONS: AdminPermission[] = [
  'manage_users',
  'delete_users',
  'verify_emails',
];

/**
 * Audit Log Entry
 * Tracks admin actions for security and compliance
 */
export interface AuditLog {
  _id?: ObjectId;
  adminId: ObjectId;
  action: 'delete_user' | 'verify_email' | 'promote_admin' | 'demote_admin' | 'login';
  targetUserId?: ObjectId;
  details: {
    email?: string;
    reason?: string;
    [key: string]: any;
  };
  ipAddress?: string;
  userAgent?: string;
  status: 'success' | 'failure';
  createdAt: Date;
}

/**
 * Verify if a user has a specific admin permission
 */
export function hasAdminPermission(
  user: AdminUser,
  permission: AdminPermission
): boolean {
  if (!user.isAdmin) return false;
  if (!user.adminPermissions) return false;
  return user.adminPermissions.includes(permission);
}

/**
 * Check if user is admin
 */
export function isAdminUser(user: any): user is AdminUser {
  return user && typeof user === 'object' && user.isAdmin === true;
}
