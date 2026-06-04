import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  FiGrid, 
  FiBox, 
  FiFolder, 
  FiTruck, 
  FiRepeat, 
  FiLayers,
  FiShield
} from 'react-icons/fi';

const Sidebar = () => {
  const { user } = useSelector(state => state.auth);

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: <FiGrid size={18} /> },
    { path: '/products', label: 'Products', icon: <FiBox size={18} /> },
    { path: '/categories', label: 'Categories', icon: <FiFolder size={18} /> },
    { path: '/suppliers', label: 'Suppliers', icon: <FiTruck size={18} /> },
    { path: '/transactions', label: 'Transactions', icon: <FiRepeat size={18} /> },
  ];

  if (user && user.role === 'admin') {
    menuItems.push({ path: '/admin', label: 'Admin Panel', icon: <FiShield size={18} /> });
  }

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logoContainer}>
        <FiLayers style={styles.logoIcon} />
        <span style={styles.logoText}>INVENTO</span>
      </div>
      <nav style={styles.nav}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              ...styles.link,
              backgroundColor: isActive ? 'var(--accent-color)' : 'transparent',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: isActive ? '0 4px 14px 0 rgba(99, 102, 241, 0.4)' : 'none',
            })}
          >
            <span style={styles.iconWrapper}>{item.icon}</span>
            <span style={styles.label}>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div style={styles.footer}>
        <p style={styles.footerText}>v1.0.0</p>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    width: 'var(--sidebar-width)',
    backgroundColor: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 101,
  },
  logoContainer: {
    height: 'var(--navbar-height)',
    display: 'flex',
    alignItems: 'center',
    padding: '0 2rem',
    gap: '0.75rem',
    borderBottom: '1px solid var(--border-color)',
  },
  logoIcon: {
    color: 'var(--accent-color)',
    fontSize: '1.75rem',
  },
  logoText: {
    fontSize: '1.25rem',
    fontWeight: '800',
    letterSpacing: '0.05em',
    color: 'var(--text-primary)',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    padding: '1.5rem 1rem',
    flexGrow: 1,
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1.25rem',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '1rem',
  },
  label: {
    fontSize: '0.95rem',
    fontWeight: '500',
  },
  footer: {
    padding: '1.5rem',
    borderTop: '1px solid var(--border-color)',
    textAlign: 'center',
  },
  footerText: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
};

export default Sidebar;
