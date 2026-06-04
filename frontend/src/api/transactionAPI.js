import axiosInstance from './axiosInstance';

export const getTransactions = async () => {
  const response = await axiosInstance.get('/transactions');
  return response.data;
};

export const createTransaction = async (transactionData) => {
  const response = await axiosInstance.post('/transactions', transactionData);
  return response.data;
};
