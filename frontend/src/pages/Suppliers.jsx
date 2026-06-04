import React from 'react';
import { FiPlus } from 'react-icons/fi';

const Suppliers = () => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerTop}>
          <h2 style={styles.title}>Suppliers Directory</h2>
          <button style={styles.addButton}>
            <FiPlus size={16} /> Add Supplier
          </button>
        </div>
        <p style={styles.subtitle}>Maintain contact records and logistics info for inventory vendors.</p>
      </header>

      <div className="placeholder-page">
        <h3 className="placeholder-title">Suppliers Registry</h3>
        <p className="placeholder-desc">
          Add vendor details, contact email, phone numbers, and physical addresses. Connect with database records to manage supplier info.
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

export default Suppliers;
