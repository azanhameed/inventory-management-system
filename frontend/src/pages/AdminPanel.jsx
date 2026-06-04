import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FiUsers, FiShield, FiUserCheck, FiTrendingUp } from 'react-icons/fi';
import axiosInstance from '../api/axiosInstance';

const AdminPanel = () => {
  const { user: currentUser } = useSelector(state => state.auth);

  // States
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, adminCount: 0, staffCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, statsRes] = await Promise.all([
        axiosInstance.get('/users'),
        axiosInstance.get('/users/stats')
      ]);
      setUsers(usersRes.data);
      setStats(statsRes.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load administration data');
      toast.error(err.response?.data?.message || 'Failed to load administration data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await axiosInstance.put(`/users/${userId}/role`, { role: newRole });
      toast.success(`User role updated to ${newRole}`);
      
      // Update local state directly
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: response.data.role } : u));
      
      // Refresh statistics counts
      const statsRes = await axiosInstance.get('/users/stats');
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to change user role');
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.title}>Administration Panel</h2>
        <p style={styles.subtitle}>Manage platform users, adjust role permissions, and view authentication metrics.</p>
      </header>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-color)' }}>
            <FiUsers />
          </div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)' }}>
            <FiShield />
          </div>
          <div className="stat-info">
            <h3>Admins</h3>
            <p>{stats.adminCount}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--info-color)' }}>
            <FiUserCheck />
          </div>
          <div className="stat-info">
            <h3>Staff Members</h3>
            <p>{stats.staffCount}</p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="dashboard-card">
        <h3 className="dashboard-card-title">Registered Users</h3>
        <div className="table-container" style={{ margin: 0 }}>
          <table className="modern-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email Address</th>
                <th>Created At</th>
                <th>Role Badge</th>
                <th style={{ width: '200px', textAlign: 'center' }}>Role Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map(u => (
                  <tr key={u._id}>
                    <td style={{ fontWeight: '600' }}>
                      {u.username} {u._id === currentUser?._id && <span style={styles.selfTag}>(You)</span>}
                    </td>
                    <td>{u.email}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'badge-danger' : 'badge-info'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <div style={styles.actionsWrapper}>
                        <select 
                          className="form-select"
                          style={styles.roleSelect}
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          disabled={u._id === currentUser?._id && u.role === 'admin'} // Protect self demotion
                        >
                          <option value="staff">Staff</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                    No users registered.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
  selfTag: {
    fontSize: '0.75rem',
    color: 'var(--accent-color)',
    fontWeight: '500',
    marginLeft: '4px',
  },
  actionsWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
  roleSelect: {
    maxWidth: '120px',
    padding: '0.35rem 0.5rem',
    fontSize: '0.85rem',
  },
};

export default AdminPanel;
