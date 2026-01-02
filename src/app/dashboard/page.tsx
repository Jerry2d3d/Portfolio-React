'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/layouts';
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from '@/components/DashboardHeader/DashboardHeader';
import WelcomeCard from '@/components/WelcomeCard/WelcomeCard';
import InfoCards from '@/components/InfoCards/InfoCards';
import StageCompleteCard from '@/components/StageCompleteCard/StageCompleteCard';
import styles from './Dashboard.module.scss';

export default function DashboardPage() {
  const { user, loading, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  // Show loading state
  if (loading) {
    return (
      <MainLayout>
        <div className="container">
          <div className={styles.loading}>Loading...</div>
        </div>
      </MainLayout>
    );
  }

  // Show nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  return (
    <MainLayout>
      <div className="container">
        <div className={styles.dashboard}>
          <DashboardHeader onLogout={logout} />

          <WelcomeCard userName={user?.name} userEmail={user?.email} />

          <div className={styles.contentSection}>
            <div className="card">
              <h3>Dashboard Overview</h3>
              <p className="text-secondary" style={{ marginTop: '1rem' }}>
                This is your personalized dashboard. You can customize this area to display
                relevant information and features for your application.
              </p>

              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Account Status</div>
                  <div className={styles.statValue}>Active</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Account Type</div>
                  <div className={styles.statValue}>Standard</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Email</div>
                  <div className={styles.statValue}>{user?.email || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>

          <InfoCards />

          <StageCompleteCard />
        </div>
      </div>
    </MainLayout>
  );
}
