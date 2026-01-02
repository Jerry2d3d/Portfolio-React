'use client';

import styles from './SearchBar.module.scss';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * SearchBar Component
 *
 * Search input field for filtering users
 */
export default function SearchBar({ value, onChange, placeholder = 'Search...' }: SearchBarProps) {
  return (
    <div className={styles.controls}>
      <input
        type="text"
        placeholder={placeholder}
        className={styles.searchInput}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search users"
      />
    </div>
  );
}
