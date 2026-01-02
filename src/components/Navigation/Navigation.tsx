'use client';

/**
 * Navigation Component
 *
 * Clean top navigation bar with logo and auth actions
 */

import Link from 'next/link';
import styles from './Navigation.module.scss';

export default function Navigation() {
  return (
    <nav className={styles.navigation}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          YourApp
        </Link>

        <div className={styles.actions}>
          <Link href="/login" className={styles.loginButton}>
            Login
          </Link>
          <Link href="/register" className={styles.getStartedButton}>
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
