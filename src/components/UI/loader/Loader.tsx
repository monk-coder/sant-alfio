import React from 'react';
import styles from './Loader.module.css';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ 
  size = 'medium', 
  color = 'var(--color-accent)',
  className = '' 
}) => {
  const loaderClass = `${styles.loader} ${styles[size]} ${className}`;
  
  return (
    <div className={loaderClass} style={{ borderTopColor: color }}>
      <span className={styles.visuallyHidden}>Loading...</span>
    </div>
  );
};

export default Loader;