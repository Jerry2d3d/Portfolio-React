/**
 * User Database Operations
 *
 * Handles all database operations related to users
 */

import { ObjectId } from 'mongodb';
import { logger } from '@/lib/logger';
import { getDatabase } from '../mongodb';

// User type definition
export interface User {
  _id?: ObjectId;
  email: string;
  password: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
  qrCodeId?: ObjectId;
  emailVerified?: boolean;
}

// User type without password (for responses)
export type UserWithoutPassword = Omit<User, 'password'>;

/**
 * Get the users collection
 */
async function getUsersCollection() {
  const db = await getDatabase();
  return db.collection<User>('users');
}

/**
 * Create a new user
 * @param userData - User data (email, hashed password, optional name)
 * @returns Created user without password
 */
export async function createUser(userData: {
  email: string;
  password: string;
  name?: string;
}): Promise<UserWithoutPassword> {
  const users = await getUsersCollection();

  const user: User = {
    email: userData.email.toLowerCase(), // Store email in lowercase
    password: userData.password, // Should already be hashed
    name: userData.name,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await users.insertOne(user);

  // Return user without password
  const { password, ...userWithoutPassword } = user;
  return {
    ...userWithoutPassword,
    _id: result.insertedId,
  };
}

/**
 * Find a user by email
 * @param email - User email
 * @returns User object or null if not found
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  const users = await getUsersCollection();
  const user = await users.findOne({ email: email.toLowerCase() });
  return user;
}

/**
 * Find a user by ID
 * @param userId - User ID string
 * @returns User object without password, or null if not found
 */
export async function findUserById(
  userId: string
): Promise<UserWithoutPassword | null> {
  const users = await getUsersCollection();

  try {
    const user = await users.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return null;
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    // Invalid ObjectId format
    return null;
  }
}

/**
 * Update user's QR code ID
 * @param userId - User ID string
 * @param qrCodeId - QR code ObjectId
 * @returns True if updated successfully
 */
export async function updateUserQRCode(
  userId: string,
  qrCodeId: ObjectId
): Promise<boolean> {
  const users = await getUsersCollection();

  try {
    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          qrCodeId,
          updatedAt: new Date(),
        },
      }
    );

    return result.modifiedCount > 0;
  } catch (error) {
    logger.error('Error updating user QR code:', error);
    return false;
  }
}

/**
 * Check if email already exists
 * @param email - Email to check
 * @returns True if email exists
 */
export async function emailExists(email: string): Promise<boolean> {
  const user = await findUserByEmail(email);
  return user !== null;
}

/**
 * Delete a user by ID
 * @param userId - User ID string
 * @returns True if user was deleted
 */
export async function deleteUser(userId: string): Promise<boolean> {
  const users = await getUsersCollection();

  try {
    const result = await users.deleteOne({ _id: new ObjectId(userId) });
    return result.deletedCount > 0;
  } catch (error) {
    logger.error('Error deleting user:', error);
    return false;
  }
}

/**
 * Create unique index on email field
 * This should be called once during setup
 */
export async function createUserIndexes(): Promise<void> {
  const users = await getUsersCollection();
  await users.createIndex({ email: 1 }, { unique: true });
  logger.log('User indexes created');
}
