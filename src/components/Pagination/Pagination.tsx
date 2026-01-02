'use client';

import styles from './Pagination.module.scss';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

/**
 * Pagination Component
 *
 * Page navigation controls for paginated data
 */
export default function Pagination({ currentPage, totalPages, onPageChange, isLoading = false }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={styles.pagination}>
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1 || isLoading}
        aria-label="Previous page"
      >
        Previous
      </button>

      <span className={styles.pageInfo}>
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages || isLoading}
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
}
