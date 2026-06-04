import axiosInstance from './axiosInstance';

export const getSuppliers = async () => {
  const response = await axiosInstance.get('/suppliers');
  return response.data;
};

export const createSupplier = async (supplierData) => {
  const response = await axiosInstance.post('/suppliers', supplierData);
  return response.data;
};

export const updateSupplier = async (id, supplierData) => {
  const response = await axiosInstance.put(`/suppliers/${id}`, supplierData);
  return response.data;
};

export const deleteSupplier = async (id) => {
  const response = await axiosInstance.delete(`/suppliers/${id}`);
  return response.data;
};
