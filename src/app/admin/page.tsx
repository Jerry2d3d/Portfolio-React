'use client';

/**
 * Admin Dashboard Page
 *
 * Protected admin-only interface for managing users
 * Features:
 * - View all users with pagination
 * - Search users by email or name
 * - Delete users with confirmation
 * - Manage email verification status
 * - Audit trail for admin actions
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { logger } from '@/lib/logger';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/AdminHeader/AdminHeader';
import SearchBar from '@/components/SearchBar/SearchBar';
import Pagination from '@/components/Pagination/Pagination';
import styles from './admin.module.scss';

/**
 * User data structure returned from API
 */
interface User {
  _id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
  emailVerified?: boolean;
}

/**
 * API response structure
 */
interface UsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
  message: string;
}

export default function AdminDashboard() {
  const router = useRouter();

  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // User list state
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // UI state
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Ref to prevent double fetch race condition
  const searchInitiatedRef = useRef(false);

  const ITEMS_PER_PAGE = 20;

  /**
   * Check if user is authenticated and authorized as admin
   */
  const checkAuthorization = useCallback(async () => {
    try {
      // FIX: Removed localStorage check

      // Try to fetch users to verify admin access
      // Auth cookies are automatically sent with the request
      const response = await fetch('/api/admin/users?page=1&limit=1', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // FIX: Removed Authorization header
        },
      });

      if (response.status === 403 || response.status === 401) {
        setIsAuthorized(false);
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to verify admin access');
      }

      setIsAuthorized(true);
      setIsLoading(false);
    } catch (err) {
      logger.error('Authorization check failed:', err);
      setIsAuthorized(false);
      setIsLoading(false);
      router.push('/login');
    }
  }, [router]);

  /**
   * Fetch users from API
   */
  const fetchUsers = useCallback(async (page: number = 1, search: string = '') => {
    try {
      setIsLoading(true);
      // FIX: Removed localStorage check

      // Build query params including search
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      });
      if (search) {
        queryParams.append('search', search);
      }

      const response = await fetch(
        `/api/admin/users?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // FIX: Removed Authorization header
          },
        }
      );

      if (response.status === 401 || response.status === 403) {
        setIsAuthorized(false);
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data: UsersResponse = await response.json();

      if (data.success) {
        setUsers(data.data.users);
        setCurrentPage(data.data.pagination.page);
        setTotalPages(data.data.pagination.pages);
        setTotalUsers(data.data.pagination.total);
        setError(null);
      }
    } catch (err) {
      logger.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  /**
   * Delete a user with confirmation
   */
  const handleDeleteUser = useCallback(async (userId: string) => {
    try {
      setIsDeleting(true);
      // FIX: Removed localStorage check

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // FIX: Removed Authorization header
        },
      });

      if (response.status === 401 || response.status === 403) {
        setIsAuthorized(false);
        router.push('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }

      // Remove user from list
      setUsers(users.filter(u => u._id !== userId));
      setDeleteConfirm(null);
      setTotalUsers(totalUsers - 1);

      // Show success message
      setError(null);
    } catch (err) {
      logger.error('Error deleting user:', err);
      setError(`Failed to delete user: ${(err as Error).message}`);
    } finally {
      setIsDeleting(false);
    }
  }, [users, totalUsers, router]);

  /**
   * Toggle email verification status
   */
  const handleToggleVerification = useCallback(
    async (userId: string, currentStatus: boolean) => {
      try {
        // FIX: Removed localStorage check

        const response = await fetch(`/api/admin/users/${userId}/verify`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            // FIX: Removed Authorization header
          },
          body: JSON.stringify({ isVerified: !currentStatus }),
        });

        if (response.status === 401 || response.status === 403) {
          setIsAuthorized(false);
          router.push('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to update verification status');
        }

        // Update user in list
        setUsers(
          users.map(u =>
            u._id === userId ? { ...u, emailVerified: !currentStatus } : u
          )
        );
      } catch (err) {
        logger.error('Error updating verification:', err);
        setError('Failed to update verification status');
      }
    },
    [users, router]
  );

  // FIX: Removed client-side filteredUsers logic. We display 'users' directly.

  /**
   * Initialize page - check authorization
   */
  useEffect(() => {
    checkAuthorization();
  }, [checkAuthorization]);

  /**
   * Handle Search with Debounce
   * When search query changes, wait 500ms then fetch page 1.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthorized) {
        searchInitiatedRef.current = true; // Signal that search is driving the update
        setCurrentPage(1); // Reset to page 1 on new search
        fetchUsers(1, searchQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, isAuthorized, fetchUsers]);

  /**
   * Handle Pagination
   * When currentPage changes, fetch data (but avoid double-fetch from search reset).
   */
  useEffect(() => {
    if (isAuthorized) {
       // Only fetch if this wasn't triggered by a search reset
       if (!searchInitiatedRef.current) {
         fetchUsers(currentPage, searchQuery);
       }
       // Reset the flag
       searchInitiatedRef.current = false;
    }
  }, [currentPage, isAuthorized, fetchUsers, searchQuery]);

  // Loading state
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Unauthorized state
  if (!isAuthorized) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <p>You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className={styles.container}>
      <AdminHeader totalUsers={totalUsers} />

      {error && <div className={styles.errorBanner}>{error}</div>}

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search by email or name..."
      />

      <div className={styles.tableContainer}>
        {users.length === 0 ? (
          <div className={styles.emptyState}>
            <p>
              {searchQuery
                ? 'No users match your search'
                : 'No users found'}
            </p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Created</th>
                <th>Verified</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td className={styles.email}>{user.email}</td>
                  <td>{user.name || '-'}</td>
                  <td>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      className={`${styles.verifyButton} ${
                        user.emailVerified ? styles.verified : styles.unverified
                      }`}
                      onClick={() =>
                        handleToggleVerification(
                          user._id,
                          user.emailVerified || false
                        )
                      }
                      aria-label={`Toggle verification for ${user.email}`}
                      disabled={isDeleting}
                    >
                      {user.emailVerified ? 'Verified' : 'Unverified'}
                    </button>
                  </td>
                  <td>
                    <button
                      className={styles.deleteButton}
                      onClick={() => setDeleteConfirm(user._id)}
                      aria-label={`Delete ${user.email}`}
                      disabled={isDeleting}
                    >
                      Delete
                    </button>

                    {deleteConfirm === user._id && (
                      <div className={styles.confirmModal}>
                        <div className={styles.confirmContent}>
                          <p>
                            Are you sure you want to delete{' '}
                            <strong>{user.email}</strong>?
                          </p>
                          <p className={styles.warning}>
                            This action cannot be undone.
                          </p>
                          <div className={styles.confirmActions}>
                            <button
                              className={styles.confirmButton}
                              onClick={() =>
                                handleDeleteUser(user._id)
                              }
                              disabled={isDeleting}
                            >
                              {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                            <button
                              className={styles.cancelButton}
                              onClick={() => setDeleteConfirm(null)}
                              disabled={isDeleting}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        isLoading={isLoading}
      />
    </div>
  );
}
