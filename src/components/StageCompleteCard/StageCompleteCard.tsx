'use client';

import styles from './StageCompleteCard.module.scss';

/**
 * StageCompleteCard Component
 *
 * Displays stage completion status and accomplished features
 */
export default function StageCompleteCard() {
  return (
    <div className={styles.stageCard}>
      <h4>Stage 2 Complete! ✅</h4>
      <p className="text-secondary" style={{ marginTop: '0.5rem' }}>
        Authentication system is now working. You can register, login, and access this protected dashboard.
      </p>
      <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
        <li>User registration with validation</li>
        <li>Secure login with JWT tokens</li>
        <li>Password hashing with bcrypt</li>
        <li>Protected routes</li>
        <li>MongoDB Atlas integration</li>
      </ul>
    </div>
  );
}
