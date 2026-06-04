import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as supplierAPI from '../../api/supplierAPI';

// Async Thunks
export const fetchSuppliers = createAsyncThunk(
  'suppliers/fetchSuppliers',
  async (_, { rejectWithValue }) => {
    try {
      return await supplierAPI.getSuppliers();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch suppliers');
    }
  }
);

export const addSupplier = createAsyncThunk(
  'suppliers/addSupplier',
  async (supplierData, { rejectWithValue }) => {
    try {
      return await supplierAPI.createSupplier(supplierData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create supplier');
    }
  }
);

export const editSupplier = createAsyncThunk(
  'suppliers/editSupplier',
  async ({ id, supplierData }, { rejectWithValue }) => {
    try {
      return await supplierAPI.updateSupplier(id, supplierData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update supplier');
    }
  }
);

export const removeSupplier = createAsyncThunk(
  'suppliers/removeSupplier',
  async (id, { rejectWithValue }) => {
    try {
      await supplierAPI.deleteSupplier(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete supplier');
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null
};

const supplierSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {
    clearSupplierError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Suppliers
      .addCase(fetchSuppliers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Supplier
      .addCase(addSupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSupplier.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(addSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Edit Supplier
      .addCase(editSupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editSupplier.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(editSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove Supplier
      .addCase(removeSupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeSupplier.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item._id !== action.payload);
      })
      .addCase(removeSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearSupplierError } = supplierSlice.actions;
export default supplierSlice.reducer;
