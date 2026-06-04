import React from 'react';
import { FiBell, FiUser, FiLayers } from 'react-icons/fi';

const Navbar = () => {
  return (
    <header style={styles.navbar}>
      <div style={styles.brandContainer}>
        <FiLayers style={styles.logoIcon} />
        <h1 style={styles.title}>Inventory Management System</h1>
      </div>
      <div style={styles.actionsContainer}>
        <button style={styles.iconButton} aria-label="Notifications">
          <FiBell size={20} />
          <span style={styles.notificationDot}></span>
        </button>
        <div style={styles.divider}></div>
        <div style={styles.userProfile}>
          <div style={styles.avatar}>
            <FiUser size={18} />
          </div>
          <span style={styles.userName}>Admin</span>
        </div>
      </div>
    </header>
  );
};

const styles = {
  navbar: {
    position: 'fixed',
    top: 0,
    right: 0,
    left: 'var(--sidebar-width)',
    height: 'var(--navbar-height)',
    backgroundColor: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2rem',
    zIndex: 100,
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logoIcon: {
    color: 'var(--accent-color)',
    fontSize: '1.5rem',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em',
    margin: 0,
  },
  actionsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
  },
  iconButton: {
    position: 'relative',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.5rem',
    borderRadius: '8px',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: 'var(--bg-tertiary)',
      color: 'var(--text-primary)',
    },
  },
  notificationDot: {
    position: 'absolute',
    top: '6px',
    right: '6px',
    width: '8px',
    height: '8px',
    backgroundColor: 'var(--danger-color)',
    borderRadius: '50%',
    border: '2px solid var(--bg-secondary)',
  },
  divider: {
    width: '1px',
    height: '24px',
    backgroundColor: 'var(--border-color)',
  },
  userProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent-glow)',
    color: 'var(--accent-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: 'var(--text-primary)',
  },
};

export default Navbar;
