/**
 * Admin Database Operations
 *
 * Handles all database operations for admin functionality
 * Including user management, verification, and audit logging
 */

import { ObjectId } from 'mongodb';
import { logger } from '@/lib/logger';
import { getDatabase } from '../mongodb';
import { User, UserWithoutPassword } from './users';
import { AdminUser, AuditLog, DEFAULT_ADMIN_PERMISSIONS } from '@/models/Admin';

/**
 * Get the admin collection
 */
async function getAdminsCollection() {
  const db = await getDatabase();
  return db.collection<AdminUser>('users'); // Admins are stored in same users collection
}

/**
 * Get the audit logs collection
 */
async function getAuditLogsCollection() {
  const db = await getDatabase();
  return db.collection<AuditLog>('audit_logs');
}

/**
 * Find an admin user by ID
 * @param userId - User ID string
 * @returns Admin user if found and is admin, null otherwise
 */
export async function findAdminById(userId: string): Promise<AdminUser | null> {
  const admins = await getAdminsCollection();

  try {
    const user = await admins.findOne({
      _id: new ObjectId(userId),
      isAdmin: true,
    });
    return user;
  } catch (error) {
    logger.error('Error finding admin:', error);
    return null;
  }
}

/**
 * Get all users with pagination and search
 * @param page - Page number (1-indexed)
 * @param limit - Results per page
 * @param search - Optional search string for filtering by email or name
 * @returns Object with users array, total count, and page info
 */
export async function getAllUsers(
  page: number = 1,
  limit: number = 20,
  search?: string
): Promise<{
  users: UserWithoutPassword[];
  total: number;
  page: number;
  pages: number;
}> {
  const users = await getAdminsCollection();

  try {
    // Validate pagination params
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(limit, 100)); // Cap at 100 per page

    const skip = (validPage - 1) * validLimit;

    // Build query with optional search
    const query: any = {};
    if (search) {
      // Escape regex special characters to prevent ReDoS attacks
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = { $regex: escapedSearch, $options: 'i' };
      query.$or = [
        { email: searchRegex },
        { name: searchRegex }
      ];
    }

    // Get total count with filter applied
    const total = await users.countDocuments(query);

    // Get paginated results, exclude password field
    const userDocs = await users
      .find(query)
      .project({ password: 0 })
      .skip(skip)
      .limit(validLimit)
      .sort({ createdAt: -1 })
      .toArray();

    const pages = Math.ceil(total / validLimit);

    return {
      users: userDocs as UserWithoutPassword[],
      total,
      page: validPage,
      pages,
    };
  } catch (error) {
    logger.error('Error getting all users:', error);
    throw new Error('Failed to retrieve users');
  }
}

/**
 * Get user count
 * @returns Total number of users
 */
export async function getUserCount(): Promise<number> {
  const users = await getAdminsCollection();

  try {
    return await users.countDocuments();
  } catch (error) {
    logger.error('Error getting user count:', error);
    return 0;
  }
}

/**
 * Update user email verification status
 * @param userId - User ID string
 * @param isVerified - Whether email is verified
 * @returns True if updated successfully
 */
export async function updateUserVerificationStatus(
  userId: string,
  isVerified: boolean
): Promise<boolean> {
  const users = await getAdminsCollection();

  try {
    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          emailVerified: isVerified,
          updatedAt: new Date(),
        },
      }
    );

    // FIX: Use matchedCount instead of modifiedCount to handle idempotent updates
    return result.matchedCount > 0;
  } catch (error) {
    logger.error('Error updating user verification status:', error);
    return false;
  }
}

/**
 * Promote a user to admin
 * @param userId - User ID string
 * @returns True if promoted successfully
 */
export async function promoteToAdmin(userId: string): Promise<boolean> {
  const users = await getAdminsCollection();

  try {
    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          isAdmin: true,
          adminSince: new Date(),
          adminPermissions: DEFAULT_ADMIN_PERMISSIONS,
          updatedAt: new Date(),
        },
      }
    );

    return result.modifiedCount > 0;
  } catch (error) {
    logger.error('Error promoting user to admin:', error);
    return false;
  }
}

/**
 * Demote an admin to regular user
 * @param userId - User ID string
 * @returns True if demoted successfully
 */
export async function demoteFromAdmin(userId: string): Promise<boolean> {
  const users = await getAdminsCollection();

  try {
    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          isAdmin: false,
          updatedAt: new Date(),
        },
        $unset: {
          adminSince: '',
          adminPermissions: '',
          lastAdminAction: '',
        },
      }
    );

    return result.modifiedCount > 0;
  } catch (error) {
    logger.error('Error demoting admin:', error);
    return false;
  }
}

/**
 * Create an audit log entry
 * @param action - Action performed
 * @param adminId - Admin user ID
 * @param targetId - Target user ID (if applicable)
 * @param details - Additional details about the action
 * @param ipAddress - Admin's IP address
 * @returns True if created successfully
 */
export async function createAuditLog(
  action: AuditLog['action'],
  adminId: string,
  targetId: string | undefined,
  details: AuditLog['details'],
  ipAddress?: string
): Promise<boolean> {
  const logs = await getAuditLogsCollection();

  try {
    const auditEntry: AuditLog = {
      adminId: new ObjectId(adminId),
      action,
      targetUserId: targetId ? new ObjectId(targetId) : undefined,
      details,
      ipAddress,
      status: 'success',
      createdAt: new Date(),
    };

    await logs.insertOne(auditEntry);
    return true;
  } catch (error) {
    logger.error('Error creating audit log:', error);
    return false;
  }
}

/**
 * Get audit logs with filtering
 * @param adminId - Filter by admin ID (optional)
 * @param action - Filter by action type (optional)
 * @param limit - Max results to return
 * @returns Array of audit log entries
 */
export async function getAuditLogs(
  adminId?: string,
  action?: string,
  limit: number = 100
): Promise<AuditLog[]> {
  const logs = await getAuditLogsCollection();

  try {
    const filter: any = {};

    if (adminId) {
      filter.adminId = new ObjectId(adminId);
    }

    if (action) {
      filter.action = action;
    }

    const results = await logs
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(Math.min(limit, 1000))
      .toArray();

    return results;
  } catch (error) {
    logger.error('Error getting audit logs:', error);
    return [];
  }
}

/**
 * Create indexes for admin operations
 * Should be called once during database setup
 */
export async function createAdminIndexes(): Promise<void> {
  try {
    const users = await getAdminsCollection();
    await users.createIndex({ isAdmin: 1 });

    const logs = await getAuditLogsCollection();
    await logs.createIndex({ adminId: 1, createdAt: -1 });
    await logs.createIndex({ createdAt: -1 });
    await logs.createIndex({ action: 1 });

    logger.log('Admin indexes created successfully');
  } catch (error) {
    logger.error('Error creating admin indexes:', error);
  }
}
