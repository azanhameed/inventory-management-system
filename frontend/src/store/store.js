import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import categoryReducer from './slices/categorySlice';
import supplierReducer from './slices/supplierSlice';
import transactionReducer from './slices/transactionSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    categories: categoryReducer,
    suppliers: supplierReducer,
    transactions: transactionReducer,
    dashboard: dashboardReducer,
  },
});
