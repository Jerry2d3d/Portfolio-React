'use client';

/**
 * Landing Page
 *
 * Generic landing page for the application
 * Showcases features and provides call-to-action for registration
 */

import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';
import Link from 'next/link';
import styles from './page.module.scss';

export default function Home() {
  return (
    <>
      <Navigation />

      <main className={styles.landing}>
        <div className={styles.container}>
          {/* Hero Section - Page Level */}
          <section className={styles.hero}>
            <h1 className={styles.headline}>Welcome to Your Application</h1>
            <p className={styles.subheadline}>
              A modern Next.js boilerplate with authentication, admin panel, and user management built-in.
            </p>
            <div className={styles.ctaButtons}>
              <Link href="/register" className={styles.primaryCta}>
                Get Started
              </Link>
              <Link href="/login" className={styles.secondaryCta}>
                Sign In
              </Link>
            </div>
          </section>

          {/* Features Section */}
          <section className={styles.features}>
            <h2>Built-in Features</h2>
            <div className={styles.featureGrid}>
              <div className={styles.featureCard}>
                <h3>🔐 Authentication</h3>
                <p>Secure JWT-based authentication with httpOnly cookies</p>
              </div>
              <div className={styles.featureCard}>
                <h3>👥 User Management</h3>
                <p>Complete user registration, login, and profile management</p>
              </div>
              <div className={styles.featureCard}>
                <h3>⚙️ Admin Panel</h3>
                <p>Full-featured admin panel with permission system</p>
              </div>
              <div className={styles.featureCard}>
                <h3>🗄️ Database Ready</h3>
                <p>MongoDB integration with TypeScript models</p>
              </div>
              <div className={styles.featureCard}>
                <h3>🎨 Styling System</h3>
                <p>SCSS modules with variables and mixins included</p>
              </div>
              <div className={styles.featureCard}>
                <h3>🤖 AI Ready</h3>
                <p>Multi-framework template system for Claude Code</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
