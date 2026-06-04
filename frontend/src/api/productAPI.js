import axiosInstance from './axiosInstance';

export const getProducts = async () => {
  const response = await axiosInstance.get('/products');
  return response.data;
};

export const getProductById = async (id) => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await axiosInstance.post('/products', productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await axiosInstance.put(`/products/${id}`, productData);
  return response.data;
};

export const updateProductQuantity = async (id, quantity) => {
  const response = await axiosInstance.patch(`/products/${id}/quantity`, { quantity });
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axiosInstance.delete(`/products/${id}`);
  return response.data;
};

export const uploadProductImage = async (id, file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await axiosInstance.post(`/products/${id}/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
