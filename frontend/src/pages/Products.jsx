import React from 'react';
import { FiPlus, FiSearch } from 'react-icons/fi';

const Products = () => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerTop}>
          <h2 style={styles.title}>Products Directory</h2>
          <button style={styles.addButton}>
            <FiPlus size={16} /> Add Product
          </button>
        </div>
        <p style={styles.subtitle}>Manage, filter, and track items in your inventory catalog.</p>
      </header>

      <div style={styles.searchBar}>
        <FiSearch style={styles.searchIcon} />
        <input type="text" placeholder="Search products by name or SKU..." style={styles.searchInput} disabled />
      </div>

      <div className="placeholder-page">
        <h3 className="placeholder-title">Products Catalogue</h3>
        <p className="placeholder-desc">
          Add new inventory items, check low stock status, and adjust prices or details here. Connect with the backend REST API to search and manage products.
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
    transition: 'background-color 0.2s',
  },
  searchBar: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    maxWidth: '400px',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    color: 'var(--text-muted)',
  },
  searchInput: {
    width: '100%',
    padding: '0.6rem 1rem 0.6rem 2.25rem',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
  },
};

export default Products;
