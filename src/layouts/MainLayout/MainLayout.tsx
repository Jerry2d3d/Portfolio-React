import React from 'react';
import styles from './MainLayout.module.scss';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className={styles.mainLayout}>
      <header className={styles.header}>
        <div className="container">
          <nav className={styles.nav}>
            <div className={styles.logo}>
              <h2>QR Manager</h2>
            </div>
            <div className={styles.navLinks}>
              {/* Navigation links will be added in Stage 2+ */}
            </div>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        {children}
      </main>

      <footer className={styles.footer}>
        <div className="container">
          <p className="text-center text-secondary">
            &copy; {new Date().getFullYear()} QR Code Manager. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
