'use client';

/**
 * Footer Component
 *
 * Site-wide footer with links and copyright information
 */

import Link from 'next/link';
import styles from './Footer.module.scss';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Brand Section */}
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              MarkedQR
            </Link>
            <p className={styles.tagline}>
              Make your mark scannable
            </p>
          </div>

          {/* Links Section */}
          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <h3 className={styles.linkTitle}>Product</h3>
              <ul className={styles.linkList}>
                <li>
                  <Link href="/" className={styles.link}>
                    QR Generator
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className={styles.link}>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/qr/settings" className={styles.link}>
                    Settings
                  </Link>
                </li>
              </ul>
            </div>

            <div className={styles.linkGroup}>
              <h3 className={styles.linkTitle}>Account</h3>
              <ul className={styles.linkList}>
                <li>
                  <Link href="/register" className={styles.link}>
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/login" className={styles.link}>
                    Login
                  </Link>
                </li>
              </ul>
            </div>

            <div className={styles.linkGroup}>
              <h3 className={styles.linkTitle}>Legal</h3>
              <ul className={styles.linkList}>
                <li>
                  <a href="#" className={styles.link}>
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className={styles.link}>
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className={styles.copyright}>
          <p>&copy; {currentYear} MarkedQR. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
