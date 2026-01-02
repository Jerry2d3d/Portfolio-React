import React from 'react';
import styles from './AuthLayout.module.scss';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={styles.authLayout}>
      <div className={styles.authContainer}>
        <div className={styles.authHeader}>
          <h1 className={styles.logo}>QR Manager</h1>
        </div>
        <div className={styles.authContent}>
          {children}
        </div>
        <div className={styles.authFooter}>
          <p className="text-tertiary text-center">
            &copy; {new Date().getFullYear()} QR Code Manager
          </p>
        </div>
      </div>
    </div>
  );
}
