'use client';

import styles from './AdminHeader.module.scss';

interface AdminHeaderProps {
  totalUsers: number;
}

/**
 * AdminHeader Component
 *
 * Displays admin dashboard header with user statistics
 */
export default function AdminHeader({ totalUsers }: AdminHeaderProps) {
  return (
    <div className={styles.header}>
      <h1>Admin Dashboard</h1>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.label}>Total Users</span>
          <span className={styles.value}>{totalUsers}</span>
        </div>
      </div>
    </div>
  );
}
