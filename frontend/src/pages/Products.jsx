import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  FiPlus, 
  FiSearch, 
  FiEdit2, 
  FiTrash2, 
  FiX, 
  FiCheck, 
  FiAlertTriangle 
} from 'react-icons/fi';
import { 
  fetchProducts, 
  addProduct, 
  editProduct, 
  removeProduct, 
  patchProductQuantity 
} from '../store/slices/productSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import { fetchSuppliers } from '../store/slices/supplierSlice';

const Products = () => {
  const dispatch = useDispatch();

  // Redux state selectors
  const { items: products, loading: productsLoading, error: productsError } = useSelector(state => state.products);
  const { items: categories, loading: categoriesLoading } = useSelector(state => state.categories);
  const { items: suppliers, loading: suppliersLoading } = useSelector(state => state.suppliers);

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    SKU: '',
    category: '',
    supplier: '',
    price: '',
    quantity: '0',
    lowStockThreshold: '10',
    description: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Inline quantity edit state
  const [inlineEditingId, setInlineEditingId] = useState(null);
  const [inlineQuantityVal, setInlineQuantityVal] = useState(0);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    dispatch(fetchSuppliers());
  }, [dispatch]);

  // Handle toast notifications for Redux errors
  useEffect(() => {
    if (productsError) {
      toast.error(productsError);
    }
  }, [productsError]);

  // Search filter
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.SKU.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open modal for adding
  const openAddModal = () => {
    setModalMode('add');
    setFormData({
      name: '',
      SKU: '',
      category: categories[0]?._id || '',
      supplier: suppliers[0]?._id || '',
      price: '',
      quantity: '0',
      lowStockThreshold: '10',
      description: ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open modal for editing
  const openEditModal = (product) => {
    setModalMode('edit');
    setEditingId(product._id);
    setFormData({
      name: product.name,
      SKU: product.SKU,
      category: product.category?._id || product.category || '',
      supplier: product.supplier?._id || product.supplier || '',
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      lowStockThreshold: product.lowStockThreshold.toString(),
      description: product.description || ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error when editing field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Product name is required';
    if (!formData.SKU.trim()) errors.SKU = 'SKU code is required';
    if (!formData.category) errors.category = 'Please select a category';
    if (!formData.supplier) errors.supplier = 'Please select a supplier';
    
    if (formData.price === '' || isNaN(formData.price) || parseFloat(formData.price) < 0) {
      errors.price = 'Price must be a positive number';
    }
    if (formData.quantity === '' || isNaN(formData.quantity) || parseInt(formData.quantity, 10) < 0) {
      errors.quantity = 'Quantity cannot be negative';
    }
    if (formData.lowStockThreshold === '' || isNaN(formData.lowStockThreshold) || parseInt(formData.lowStockThreshold, 10) < 0) {
      errors.lowStockThreshold = 'Threshold cannot be negative';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const parsedData = {
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity, 10),
      lowStockThreshold: parseInt(formData.lowStockThreshold, 10)
    };

    if (modalMode === 'add') {
      dispatch(addProduct(parsedData))
        .unwrap()
        .then(() => {
          toast.success('Product created successfully');
          setIsModalOpen(false);
        })
        .catch(err => {
          toast.error(err || 'Failed to create product');
        });
    } else {
      dispatch(editProduct({ id: editingId, productData: parsedData }))
        .unwrap()
        .then(() => {
          toast.success('Product updated successfully');
          setIsModalOpen(false);
        })
        .catch(err => {
          toast.error(err || 'Failed to update product');
        });
    }
  };

  // Delete product
  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(removeProduct(id))
        .unwrap()
        .then(() => {
          toast.success('Product deleted successfully');
        })
        .catch(err => {
          toast.error(err || 'Failed to delete product');
        });
    }
  };

  // Start inline quantity editing
  const startInlineEdit = (product) => {
    setInlineEditingId(product._id);
    setInlineQuantityVal(product.quantity);
  };

  // Save inline quantity
  const saveInlineQuantity = (id) => {
    if (inlineQuantityVal < 0 || isNaN(inlineQuantityVal)) {
      toast.error('Quantity cannot be negative');
      return;
    }
    dispatch(patchProductQuantity({ id, quantity: parseInt(inlineQuantityVal, 10) }))
      .unwrap()
      .then(() => {
        toast.success('Quantity adjusted');
        setInlineEditingId(null);
      })
      .catch(err => {
        toast.error(err || 'Failed to update quantity');
      });
  };

  const isDataLoading = productsLoading && products.length === 0;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerTop}>
          <h2 style={styles.title}>Products Directory</h2>
          <button className="btn btn-primary" onClick={openAddModal}>
            <FiPlus size={16} /> Add Product
          </button>
        </div>
        <p style={styles.subtitle}>Manage, filter, and track items in your inventory catalog.</p>
      </header>

      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.searchBar}>
          <FiSearch style={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search products by name or SKU..." 
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isDataLoading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Supplier</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => {
                  const isLowStock = p.quantity <= p.lowStockThreshold;
                  const isEditingThisTx = inlineEditingId === p._id;

                  return (
                    <tr key={p._id}>
                      <td style={{ fontWeight: '600' }}>{p.name}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{p.SKU}</td>
                      <td>{p.category?.name || 'Uncategorized'}</td>
                      <td>{p.supplier?.name || 'No Supplier'}</td>
                      <td style={{ fontWeight: '500' }}>
                        ${p.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td>
                        {isEditingThisTx ? (
                          <div style={styles.inlineEditWrapper}>
                            <input 
                              type="number" 
                              value={inlineQuantityVal} 
                              onChange={(e) => setInlineQuantityVal(e.target.value)}
                              style={styles.inlineInput}
                              min="0"
                            />
                            <button className="btn-icon" onClick={() => saveInlineQuantity(p._id)} style={{ color: 'var(--success-color)' }}>
                              <FiCheck />
                            </button>
                            <button className="btn-icon" onClick={() => setInlineEditingId(null)} style={{ color: 'var(--danger-color)' }}>
                              <FiX />
                            </button>
                          </div>
                        ) : (
                          <div style={styles.quantityDisplay} title="Double click to quick edit" onDoubleClick={() => startInlineEdit(p)}>
                            <span style={{ fontWeight: '600' }}>{p.quantity}</span>
                            <button style={styles.quickEditBtn} onClick={() => startInlineEdit(p)}>edit</button>
                          </div>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${isLowStock ? 'badge-danger' : 'badge-success'}`}>
                          {isLowStock ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      <td>
                        <div style={styles.actionsCell}>
                          <button className="btn-icon" onClick={() => openEditModal(p)} title="Edit Product">
                            <FiEdit2 size={16} />
                          </button>
                          <button className="btn-icon btn-icon-danger" onClick={() => handleDeleteProduct(p._id)} title="Delete Product">
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                    No products found matching the criteria.
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
              <h3 className="modal-title">{modalMode === 'add' ? 'Add New Product' : 'Edit Product'}</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <FiX />
              </button>
            </header>
            
            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input 
                    type="text" 
                    name="name" 
                    className="form-input" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                  />
                  {formErrors.name && <span className="error-text">{formErrors.name}</span>}
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">SKU Code *</label>
                    <input 
                      type="text" 
                      name="SKU" 
                      className="form-input" 
                      value={formData.SKU} 
                      onChange={handleInputChange} 
                      disabled={modalMode === 'edit'} // SKU usually shouldn't change
                    />
                    {formErrors.SKU && <span className="error-text">{formErrors.SKU}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Price ($) *</label>
                    <input 
                      type="number" 
                      step="0.01"
                      name="price" 
                      className="form-input" 
                      value={formData.price} 
                      onChange={handleInputChange} 
                    />
                    {formErrors.price && <span className="error-text">{formErrors.price}</span>}
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select 
                      name="category" 
                      className="form-select" 
                      value={formData.category} 
                      onChange={handleInputChange}
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                    {formErrors.category && <span className="error-text">{formErrors.category}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Supplier *</label>
                    <select 
                      name="supplier" 
                      className="form-select" 
                      value={formData.supplier} 
                      onChange={handleInputChange}
                    >
                      <option value="">Select Supplier</option>
                      {suppliers.map(sup => (
                        <option key={sup._id} value={sup._id}>{sup.name}</option>
                      ))}
                    </select>
                    {formErrors.supplier && <span className="error-text">{formErrors.supplier}</span>}
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Initial Quantity *</label>
                    <input 
                      type="number" 
                      name="quantity" 
                      className="form-input" 
                      value={formData.quantity} 
                      onChange={handleInputChange} 
                      disabled={modalMode === 'edit'} // Direct quantity changes should go through Transactions or Quick edit
                    />
                    {formErrors.quantity && <span className="error-text">{formErrors.quantity}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Low Stock Threshold</label>
                    <input 
                      type="number" 
                      name="lowStockThreshold" 
                      className="form-input" 
                      value={formData.lowStockThreshold} 
                      onChange={handleInputChange} 
                    />
                    {formErrors.lowStockThreshold && <span className="error-text">{formErrors.lowStockThreshold}</span>}
                  </div>
                </div>

                <div className="form-group form-group-full">
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
                  {modalMode === 'add' ? 'Create Product' : 'Save Changes'}
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
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
  },
  searchBar: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    maxWidth: '400px',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    color: 'var(--text-muted)',
  },
  searchInput: {
    width: '100%',
    padding: '0.65rem 1rem 0.65rem 2.25rem',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  actionsCell: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  inlineEditWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  inlineInput: {
    width: '60px',
    backgroundColor: 'var(--bg-tertiary)',
    color: 'var(--text-primary)',
    border: '1px solid var(--accent-color)',
    borderRadius: '4px',
    padding: '4px 6px',
    outline: 'none',
    fontSize: '0.9rem',
  },
  quantityDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
  },
  quickEditBtn: {
    fontSize: '0.75rem',
    color: 'var(--accent-color)',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    padding: '2px 6px',
    borderRadius: '4px',
  },
};

export default Products;
