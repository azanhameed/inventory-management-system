import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { 
  fetchSuppliers, 
  addSupplier, 
  editSupplier, 
  removeSupplier 
} from '../store/slices/supplierSlice';

const Suppliers = () => {
  const dispatch = useDispatch();

  // Redux state
  const { items: suppliers, loading, error } = useSelector(state => state.suppliers);
  const { user } = useSelector(state => state.auth);

  // Local state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  // Handle toast notifications for Redux errors
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ name: '', email: '', phone: '', address: '' });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (supplier) => {
    setModalMode('edit');
    setEditingId(supplier._id);
    setFormData({
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone || '',
      address: supplier.address || ''
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
    if (!formData.name.trim()) errors.name = 'Supplier name is required';
    if (!formData.email.trim()) {
      errors.email = 'Supplier email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errors.email = 'Please provide a valid email address';
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (modalMode === 'add') {
      dispatch(addSupplier(formData))
        .unwrap()
        .then(() => {
          toast.success('Supplier registered successfully');
          setIsModalOpen(false);
        })
        .catch(err => {
          toast.error(err || 'Failed to register supplier');
        });
    } else {
      dispatch(editSupplier({ id: editingId, supplierData: formData }))
        .unwrap()
        .then(() => {
          toast.success('Supplier details updated successfully');
          setIsModalOpen(false);
        })
        .catch(err => {
          toast.error(err || 'Failed to update supplier details');
        });
    }
  };

  const handleDeleteSupplier = (id) => {
    if (window.confirm('Are you sure you want to delete this supplier? This might affect products referencing them.')) {
      dispatch(removeSupplier(id))
        .unwrap()
        .then(() => {
          toast.success('Supplier removed successfully');
        })
        .catch(err => {
          toast.error(err || 'Failed to delete supplier');
        });
    }
  };

  const isDataLoading = loading && suppliers.length === 0;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerTop}>
          <h2 style={styles.title}>Suppliers Directory</h2>
          <button className="btn btn-primary" onClick={openAddModal}>
            <FiPlus size={16} /> Add Supplier
          </button>
        </div>
        <p style={styles.subtitle}>Maintain contact records and logistics info for inventory vendors.</p>
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
                <th>Supplier Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Address</th>
                <th style={{ textAlign: 'center', width: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length > 0 ? (
                suppliers.map((sup) => (
                  <tr key={sup._id}>
                    <td style={{ fontWeight: '600' }}>{sup.name}</td>
                    <td>{sup.email}</td>
                    <td>{sup.phone || <span style={{ color: 'var(--text-muted)' }}>N/A</span>}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {sup.address || <span style={{ color: 'var(--text-muted)' }}>No address registered</span>}
                    </td>
                    <td>
                      <div style={styles.actionsCell}>
                        <button className="btn-icon" onClick={() => openEditModal(sup)} title="Edit Supplier">
                          <FiEdit2 size={16} />
                        </button>
                        {user?.role === 'admin' && (
                          <button className="btn-icon btn-icon-danger" onClick={() => handleDeleteSupplier(sup._id)} title="Delete Supplier">
                            <FiTrash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                    No suppliers registered yet. Click "Add Supplier" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <header className="modal-header">
              <h3 className="modal-title">{modalMode === 'add' ? 'Add New Supplier' : 'Edit Supplier'}</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <FiX />
              </button>
            </header>

            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Supplier Name *</label>
                  <input 
                    type="text" 
                    name="name" 
                    className="form-input" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                  />
                  {formErrors.name && <span className="error-text">{formErrors.name}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input 
                    type="email" 
                    name="email" 
                    className="form-input" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                  />
                  {formErrors.email && <span className="error-text">{formErrors.email}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input 
                    type="text" 
                    name="phone" 
                    className="form-input" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Address</label>
                  <textarea 
                    name="address" 
                    className="form-textarea" 
                    value={formData.address} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>

              <footer className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {modalMode === 'add' ? 'Register Supplier' : 'Save Changes'}
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
  actionsCell: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
  },
};

export default Suppliers;
