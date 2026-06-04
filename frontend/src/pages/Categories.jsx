import React from 'react';
import { FiPlus } from 'react-icons/fi';

const Categories = () => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerTop}>
          <h2 style={styles.title}>Categories Management</h2>
          <button style={styles.addButton}>
            <FiPlus size={16} /> Add Category
          </button>
        </div>
        <p style={styles.subtitle}>Organize and classify products for streamlined cataloging.</p>
      </header>

      <div className="placeholder-page">
        <h3 className="placeholder-title">Categories Overview</h3>
        <p className="placeholder-desc">
          Organize your stock items into custom categories (e.g. Electronics, Clothing, Foods). Creating a category will allow products to reference it.
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: 'var(--text-secondary)',
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'var(--accent-color)',
    color: 'var(--text-primary)',
    padding: '0.6rem 1.2rem',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.9rem',
  },
};

export default Categories;
