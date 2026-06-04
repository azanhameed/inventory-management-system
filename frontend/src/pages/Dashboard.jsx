import React from 'react';
import { FiBox, FiFolder, FiTruck, FiRepeat, FiTrendingUp } from 'react-icons/fi';

const Dashboard = () => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.title}>System Dashboard</h2>
        <p style={styles.subtitle}>Overview and quick statistics of your inventory management operations.</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><FiBox /></div>
          <div className="stat-info">
            <h3>Total Products</h3>
            <p>124</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FiFolder /></div>
          <div className="stat-info">
            <h3>Categories</h3>
            <p>12</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FiTruck /></div>
          <div className="stat-info">
            <h3>Suppliers</h3>
            <p>8</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FiTrendingUp /></div>
          <div className="stat-info">
            <h3>Total Value</h3>
            <p>$45,230</p>
          </div>
        </div>
      </div>

      <div className="placeholder-page">
        <h3 className="placeholder-title">Dashboard Overview</h3>
        <p className="placeholder-desc">
          This dashboard displays real-time key metrics of stock value, inventory counts, categories, and supplier distribution. The next step is to bind the Redux actions to display dynamic database metrics here.
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
    marginBottom: '1rem',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '0.25rem',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: 'var(--text-secondary)',
  },
};

export default Dashboard;
