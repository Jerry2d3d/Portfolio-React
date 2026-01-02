'use client';

import styles from './DashboardHeader.module.scss';

interface DashboardHeaderProps {
  onLogout: () => void;
}

/**
 * DashboardHeader Component
 *
 * Displays dashboard title with logout button
 */
export default function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  return (
    <div className={styles.header}>
      <h1>Dashboard</h1>
      <button onClick={onLogout} className={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
}
