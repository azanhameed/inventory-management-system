import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FiPlus, FiX } from 'react-icons/fi';
import { fetchTransactions, addTransaction } from '../store/slices/transactionSlice';
import { fetchProducts } from '../store/slices/productSlice';

const Transactions = () => {
  const dispatch = useDispatch();

  // Redux state
  const { items: transactions, loading: txLoading, error: txError } = useSelector(state => state.transactions);
  const { items: products, loading: productsLoading } = useSelector(state => state.products);

  // Local state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    product: '',
    type: 'stock-in',
    quantity: '1',
    note: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchProducts());
  }, [dispatch]);

  // Handle toast notifications for Redux errors
  useEffect(() => {
    if (txError) {
      toast.error(txError);
    }
  }, [txError]);

  const openAddModal = () => {
    setFormData({
      product: products[0]?._id || '',
      type: 'stock-in',
      quantity: '1',
      note: ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.product) {
      errors.product = 'Please select a product';
    }
    
    const qty = parseInt(formData.quantity, 10);
    if (isNaN(qty) || qty < 1) {
      errors.quantity = 'Quantity must be at least 1';
    }

    // Additional check for Stock Out: must not exceed available quantity
    if (formData.product && formData.type === 'stock-out') {
      const selectedProductObj = products.find(p => p._id === formData.product);
      if (selectedProductObj && qty > selectedProductObj.quantity) {
        errors.quantity = `Insufficient stock. Only ${selectedProductObj.quantity} units available.`;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const parsedData = {
      ...formData,
      quantity: parseInt(formData.quantity, 10)
    };

    dispatch(addTransaction(parsedData))
      .unwrap()
      .then(() => {
        toast.success('Stock transaction recorded successfully');
        setIsModalOpen(false);
        // Refresh products list so that the available stock updates in the state
        dispatch(fetchProducts());
      })
      .catch(err => {
        toast.error(err || 'Failed to record transaction');
      });
  };

  const isDataLoading = txLoading && transactions.length === 0;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerTop}>
          <h2 style={styles.title}>Stock Transactions</h2>
          <button className="btn btn-primary" onClick={openAddModal}>
            <FiPlus size={16} /> New Transaction
          </button>
        </div>
        <p style={styles.subtitle}>Track check-in and check-out logs for all inventory adjustments.</p>
      </header>

      {isDataLoading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Notes / Comments</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr key={tx._id} className={tx.type === 'stock-in' ? 'tr-stock-in' : 'tr-stock-out'}>
                    <td style={{ fontWeight: '600' }}>{tx.product?.name || <span style={{ color: 'var(--text-muted)' }}>Deleted Product</span>}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{tx.product?.SKU || 'N/A'}</td>
                    <td>
                      <span className={`badge ${tx.type === 'stock-in' ? 'badge-success' : 'badge-danger'}`}>
                        {tx.type === 'stock-in' ? 'Stock In' : 'Stock Out'}
                      </span>
                    </td>
                    <td style={{ fontWeight: '700', color: tx.type === 'stock-in' ? 'var(--success-color)' : 'var(--danger-color)' }}>
                      {tx.type === 'stock-in' ? `+${tx.quantity}` : `-${tx.quantity}`}
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {tx.note || <span style={{ color: 'var(--text-muted)' }}>No notes provided</span>}
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                    No stock transactions recorded yet. Click "New Transaction" to register stock adjustments.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Record Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <header className="modal-header">
              <h3 className="modal-title">Record Stock Movement</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <FiX />
              </button>
            </header>

            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Product *</label>
                  <select 
                    name="product" 
                    className="form-select" 
                    value={formData.product} 
                    onChange={handleInputChange}
                  >
                    <option value="">Select Product</option>
                    {products.map(p => (
                      <option key={p._id} value={p._id}>{p.name} (SKU: {p.SKU}) — Available: {p.quantity}</option>
                    ))}
                  </select>
                  {formErrors.product && <span className="error-text">{formErrors.product}</span>}
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Movement Type *</label>
                    <select 
                      name="type" 
                      className="form-select" 
                      value={formData.type} 
                      onChange={handleInputChange}
                    >
                      <option value="stock-in">Stock In (Increment)</option>
                      <option value="stock-out">Stock Out (Decrement)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Quantity *</label>
                    <input 
                      type="number" 
                      name="quantity" 
                      className="form-input" 
                      min="1"
                      value={formData.quantity} 
                      onChange={handleInputChange} 
                    />
                    {formErrors.quantity && <span className="error-text">{formErrors.quantity}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Transaction Notes / Reference</label>
                  <textarea 
                    name="note" 
                    className="form-textarea" 
                    placeholder="E.g. Restock shipment, damaged items write-off, order fulfillment..."
                    value={formData.note} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>

              <footer className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Record Transaction
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
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
};

export default Transactions;
