import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { 
  fetchCategories, 
  addCategory, 
  editCategory, 
  removeCategory 
} from '../store/slices/categorySlice';
import { fetchProducts } from '../store/slices/productSlice';

const Categories = () => {
  const dispatch = useDispatch();

  // Redux state
  const { items: categories, loading, error } = useSelector(state => state.categories);
  const { items: products } = useSelector(state => state.products);

  // Local state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);

  // Handle toast notifications for Redux errors
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ name: '', description: '' });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setModalMode('edit');
    setEditingId(category._id);
    setFormData({
      name: category.name,
      description: category.description || ''
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
    if (!formData.name.trim()) {
      errors.name = 'Category name is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (modalMode === 'add') {
      dispatch(addCategory(formData))
        .unwrap()
        .then(() => {
          toast.success('Category created successfully');
          setIsModalOpen(false);
        })
        .catch(err => {
          toast.error(err || 'Failed to create category');
        });
    } else {
      dispatch(editCategory({ id: editingId, categoryData: formData }))
        .unwrap()
        .then(() => {
          toast.success('Category updated successfully');
          setIsModalOpen(false);
        })
        .catch(err => {
          toast.error(err || 'Failed to update category');
        });
    }
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm('Are you sure you want to delete this category? This might affect products using it.')) {
      dispatch(removeCategory(id))
        .unwrap()
        .then(() => {
          toast.success('Category deleted successfully');
        })
        .catch(err => {
          toast.error(err || 'Failed to delete category');
        });
    }
  };

  const isDataLoading = loading && categories.length === 0;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerTop}>
          <h2 style={styles.title}>Categories Management</h2>
          <button className="btn btn-primary" onClick={openAddModal}>
            <FiPlus size={16} /> Add Category
          </button>
        </div>
        <p style={styles.subtitle}>Organize and classify products for streamlined cataloging.</p>
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
                <th>Category Name</th>
                <th>Description</th>
                <th style={{ textAlign: 'center', width: '150px' }}>Products Count</th>
                <th style={{ textAlign: 'center', width: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((cat) => {
                  const productCount = products.filter(p => {
                    const pCatId = p.category?._id || p.category;
                    return pCatId === cat._id;
                  }).length;

                  return (
                    <tr key={cat._id}>
                      <td style={{ fontWeight: '600', width: '250px' }}>{cat.name}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {cat.description || <span style={{ color: 'var(--text-muted)' }}>No description provided</span>}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: '600' }}>
                        <span className="badge badge-info" style={{ minWidth: '35px', justifyContent: 'center' }}>
                          {productCount}
                        </span>
                      </td>
                      <td>
                        <div style={styles.actionsCell}>
                          <button className="btn-icon" onClick={() => openEditModal(cat)} title="Edit Category">
                            <FiEdit2 size={16} />
                          </button>
                          <button className="btn-icon btn-icon-danger" onClick={() => handleDeleteCategory(cat._id)} title="Delete Category">
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                    No categories registered yet. Click "Add Category" to get started.
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
              <h3 className="modal-title">{modalMode === 'add' ? 'Add New Category' : 'Edit Category'}</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <FiX />
              </button>
            </header>

            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Category Name *</label>
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
                  <label className="form-label">Description</label>
                  <textarea 
                    name="description" 
                    className="form-textarea" 
                    value={formData.description} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>

              <footer className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {modalMode === 'add' ? 'Create Category' : 'Save Changes'}
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

export default Categories;
