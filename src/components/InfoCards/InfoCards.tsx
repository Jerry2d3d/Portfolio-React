'use client';

import styles from './InfoCards.module.scss';

/**
 * InfoCards Component
 *
 * Displays placeholder cards for upcoming features
 */
export default function InfoCards() {
  return (
    <div className={styles.infoCards}>
      <div className="card">
        <h4>Bookmark Management</h4>
        <p className="text-secondary" style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
          Coming in Stage 4
        </p>
      </div>

      <div className="card">
        <h4>Marked QR</h4>
        <p className="text-secondary" style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
          Coming in Stage 6
        </p>
      </div>
    </div>
  );
}
