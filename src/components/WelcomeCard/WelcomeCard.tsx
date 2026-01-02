'use client';

import styles from './WelcomeCard.module.scss';

interface WelcomeCardProps {
  userName?: string;
  userEmail?: string;
}

/**
 * WelcomeCard Component
 *
 * Displays personalized welcome message for authenticated user
 */
export default function WelcomeCard({ userName, userEmail }: WelcomeCardProps) {
  return (
    <div className={styles.welcomeCard}>
      <h2>Welcome{userName ? `, ${userName}` : ''}!</h2>
      <p className="text-secondary">
        You're logged in as <strong>{userEmail}</strong>
      </p>
    </div>
  );
}
