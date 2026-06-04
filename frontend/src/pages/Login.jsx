import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser, clearAuthError } from '../store/slices/authSlice';
import { FiLayers, FiMail, FiLock } from 'react-icons/fi';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAuthError());
    }
  }, [error, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errors.email = 'Please enter a valid email address';
      }
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    dispatch(loginUser(formData));
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.loginCard}>
        <div style={styles.brand}>
          <FiLayers style={styles.brandIcon} />
          <h2 style={styles.brandName}>INVENTO</h2>
        </div>
        <h3 style={styles.title}>Sign in to your account</h3>
        
        <form onSubmit={handleFormSubmit} style={styles.form}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={styles.inputContainer}>
              <FiMail style={styles.inputIcon} />
              <input 
                type="email" 
                name="email" 
                className="form-input" 
                style={styles.input}
                value={formData.email} 
                onChange={handleInputChange} 
              />
            </div>
            {formErrors.email && <span className="error-text">{formErrors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={styles.inputContainer}>
              <FiLock style={styles.inputIcon} />
              <input 
                type="password" 
                name="password" 
                className="form-input" 
                style={styles.input}
                value={formData.password} 
                onChange={handleInputChange} 
              />
            </div>
            {formErrors.password && <span className="error-text">{formErrors.password}</span>}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={styles.footer}>
          <span style={styles.footerText}>New to INVENTO?</span>{' '}
          <Link to="/register" style={styles.footerLink}>Create an account</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: 'var(--bg-primary)',
    padding: '1.5rem',
  },
  loginCard: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '420px',
    boxShadow: 'var(--card-shadow)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  brandIcon: {
    color: 'var(--accent-color)',
    fontSize: '2rem',
  },
  brandName: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
    letterSpacing: '0.05em',
    margin: 0,
  },
  title: {
    fontSize: '1.1rem',
    color: 'var(--text-secondary)',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    color: 'var(--text-muted)',
  },
  input: {
    paddingLeft: '2.25rem',
  },
  submitBtn: {
    width: '100%',
    justifyContent: 'center',
    padding: '0.75rem',
    marginTop: '1.5rem',
  },
  footer: {
    marginTop: '2rem',
    fontSize: '0.875rem',
  },
  footerText: {
    color: 'var(--text-secondary)',
  },
  footerLink: {
    color: 'var(--accent-color)',
    fontWeight: '600',
  },
};

export default Login;
