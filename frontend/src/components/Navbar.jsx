import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FiBell, FiLayers, FiAlertTriangle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { items: products } = useSelector(state => state.products);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Filter low stock items
  const lowStockItems = products.filter(p => p.quantity <= p.lowStockThreshold);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header style={styles.navbar}>
      <div style={styles.brandContainer}>
        <FiLayers style={styles.logoIcon} />
        <h1 style={styles.title}>Inventory Management System</h1>
      </div>
      
      <div style={styles.actionsContainer}>
        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button 
            style={styles.iconButton} 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-label="Notifications"
          >
            <FiBell size={20} />
            {lowStockItems.length > 0 && <span style={styles.notificationDot}></span>}
          </button>

          {isDropdownOpen && (
            <div style={styles.dropdown}>
              <div style={styles.dropdownHeader}>
                <strong>Stock Alerts</strong>
                <span style={styles.alertCount}>{lowStockItems.length} warning(s)</span>
              </div>
              <div style={styles.dropdownBody}>
                {lowStockItems.length > 0 ? (
                  lowStockItems.map(item => (
                    <Link 
                      key={item._id} 
                      to="/products" 
                      onClick={() => setIsDropdownOpen(false)}
                      style={styles.dropdownItem}
                    >
                      <FiAlertTriangle color="var(--danger-color)" style={{ flexShrink: 0 }} />
                      <div style={styles.dropdownItemInfo}>
                        <div style={styles.itemName}>{item.name}</div>
                        <div style={styles.itemStock}>Only {item.quantity} units left (Threshold: {item.lowStockThreshold})</div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div style={styles.noAlerts}>No stock warnings. All items fully stocked!</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div style={styles.divider}></div>
        
        {/* Simple User Display */}
        <span style={styles.adminText}>Admin</span>
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
    cursor: 'pointer',
    border: 'none',
    background: 'none',
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
  adminText: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '0.75rem',
    width: '320px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    boxShadow: 'var(--card-shadow)',
    zIndex: 200,
    overflow: 'hidden',
  },
  dropdownHeader: {
    padding: '0.75rem 1rem',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.85rem',
    backgroundColor: 'var(--bg-tertiary)',
  },
  alertCount: {
    fontSize: '0.75rem',
    color: 'var(--danger-color)',
    fontWeight: '600',
  },
  dropdownBody: {
    maxHeight: '260px',
    overflowY: 'auto',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    borderBottom: '1px solid var(--border-color)',
    textDecoration: 'none',
    color: 'var(--text-primary)',
    transition: 'background-color 0.2s',
  },
  dropdownItemInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  itemName: {
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  itemStock: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
  },
  noAlerts: {
    padding: '1.5rem',
    textAlign: 'center',
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
  },
};

export default Navbar;
