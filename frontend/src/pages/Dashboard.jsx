import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../store/slices/dashboardSlice';
import { fetchProducts } from '../store/slices/productSlice';
import { 
  FiBox, 
  FiFolder, 
  FiTruck, 
  FiTrendingUp, 
  FiAlertTriangle, 
  FiArrowUpRight,
  FiArrowDownLeft
} from 'react-icons/fi';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Cell
} from 'recharts';

const Dashboard = () => {
  const dispatch = useDispatch();
  
  const { stats, loading: statsLoading, error: statsError } = useSelector(state => state.dashboard);
  const { items: products, loading: productsLoading, error: productsError } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchProducts());
  }, [dispatch]);

  const isLoading = statsLoading || productsLoading;
  const error = statsError || productsError;

  // Process data for Recharts top 5 products by quantity
  const topProductsData = [...products]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)
    .map(p => ({
      name: p.name.length > 15 ? p.name.substring(0, 12) + '...' : p.name,
      quantity: p.quantity
    }));

  // Filter low stock products for display
  const lowStockItemsList = products.filter(p => p.quantity <= p.lowStockThreshold);

  if (isLoading && products.length === 0) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.title}>System Dashboard</h2>
        <p style={styles.subtitle}>Overview and quick statistics of your inventory management operations.</p>
      </header>

      {error && (
        <div className="error-banner">
          Error loading dashboard data: {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-color)' }}>
            <FiBox />
          </div>
          <div className="stat-info">
            <h3>Total Products</h3>
            <p>{stats.totalProducts}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--info-color)' }}>
            <FiFolder />
          </div>
          <div className="stat-info">
            <h3>Categories</h3>
            <p>{stats.totalCategories}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)' }}>
            <FiTruck />
          </div>
          <div className="stat-info">
            <h3>Suppliers</h3>
            <p>{stats.totalSuppliers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)' }}>
            <FiAlertTriangle />
          </div>
          <div className="stat-info">
            <h3>Low Stock Items</h3>
            <p>{stats.lowStockCount}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning-color)' }}>
            <FiTrendingUp />
          </div>
          <div className="stat-info">
            <h3>Inventory Value</h3>
            <p>${stats.totalStockValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      {/* Charts and Alerts Grid */}
      <div className="dashboard-grid">
        {/* Chart Card */}
        <div className="dashboard-card">
          <h3 className="dashboard-card-title">Top 5 Products by Quantity</h3>
          <div style={{ width: '100%', height: 300 }}>
            {topProductsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProductsData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#263152" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                    itemStyle={{ color: 'var(--accent-color)' }}
                  />
                  <Bar dataKey="quantity" fill="var(--accent-color)" radius={[4, 4, 0, 0]}>
                    {topProductsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#818cf8' : 'var(--accent-color)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={styles.noData}>No product quantity data available.</div>
            )}
          </div>
        </div>

        {/* Low Stock Alerts Table */}
        <div className="dashboard-card">
          <h3 className="dashboard-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiAlertTriangle color="var(--warning-color)" /> Low Stock Alerts
          </h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {lowStockItemsList.length > 0 ? (
              <table className="modern-table" style={{ fontSize: '0.85rem' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '0.5rem 1rem' }}>Product</th>
                    <th style={{ padding: '0.5rem 1rem' }}>SKU</th>
                    <th style={{ padding: '0.5rem 1rem' }}>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockItemsList.map(item => (
                    <tr key={item._id}>
                      <td style={{ padding: '0.5rem 1rem', fontWeight: '600' }}>{item.name}</td>
                      <td style={{ padding: '0.5rem 1rem', color: 'var(--text-secondary)' }}>{item.SKU}</td>
                      <td style={{ padding: '0.5rem 1rem' }}>
                        <span className="badge badge-danger" style={{ padding: '0.15rem 0.5rem', fontSize: '0.7rem' }}>
                          {item.quantity} left
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={styles.noData}>No low stock products. All items fully stocked!</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="dashboard-card" style={{ marginTop: '1.5rem' }}>
        <h3 className="dashboard-card-title">Recent Stock Activity</h3>
        <div className="table-container" style={{ margin: 0 }}>
          {stats.recentTransactions && stats.recentTransactions.length > 0 ? (
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentTransactions.map((tx) => (
                  <tr key={tx._id} className={tx.type === 'stock-in' ? 'tr-stock-in' : 'tr-stock-out'}>
                    <td style={{ fontWeight: '500' }}>{tx.product?.name || 'Deleted Product'}</td>
                    <td>{tx.product?.SKU || 'N/A'}</td>
                    <td>
                      <span className={`badge ${tx.type === 'stock-in' ? 'badge-success' : 'badge-danger'}`}>
                        {tx.type === 'stock-in' ? 'Stock In' : 'Stock Out'}
                      </span>
                    </td>
                    <td style={{ fontWeight: '600' }}>
                      {tx.type === 'stock-in' ? (
                        <span style={{ color: 'var(--success-color)', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                          <FiArrowArrowUpRight /> +{tx.quantity}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--danger-color)', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                          <FiArrowArrowDownLeft /> -{tx.quantity}
                        </span>
                      )}
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={styles.noData}>No recent stock activities found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Internal mini components for tx arrows
const FiArrowArrowUpRight = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <line x1="7" y1="17" x2="17" y2="7"></line>
    <polyline points="7 7 17 7 17 17"></polyline>
  </svg>
);

const FiArrowArrowDownLeft = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <line x1="17" y1="7" x2="7" y2="17"></line>
    <polyline points="17 17 7 17 7 7"></polyline>
  </svg>
);

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  header: {
    marginBottom: '0.5rem',
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
  noData: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    textAlign: 'center',
    padding: '2rem',
  },
  alertsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    maxHeight: '280px',
    overflowY: 'auto',
  },
  alertRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 1rem',
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
  },
  alertName: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  alertSku: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },
};

export default Dashboard;
