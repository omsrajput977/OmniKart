import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../services/api';

// Helper to normalize backend populated cart structure: [{ product: { ... }, quantity: N }]
const normalizeCart = (cartArray = []) => {
  return cartArray
    .map((item) => {
      if (!item) return null;
      if (item.product && typeof item.product === 'object') {
        return {
          ...item.product,
          quantity: item.quantity,
          cartItemId: item._id,
        };
      }
      return item;
    })
    .filter(Boolean);
};

// 1. Fetch Cart from MongoDB
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/cart');
    return normalizeCart(response.data?.cart || []);
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
  }
});

// 2. Add Item to Cart (POST /cart/:productId)
export const addToCartApi = createAsyncThunk('cart/addToCartApi', async (product, { rejectWithValue }) => {
  try {
    const productId = product._id || product.id;
    const response = await axiosInstance.post(`/cart/${productId}`);
    return normalizeCart(response.data?.cart || []);
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add item to cart');
  }
});

// 3. Update Quantity (PATCH /cart/:productId)
export const updateQuantityApi = createAsyncThunk('cart/updateQuantityApi', async ({ id, quantity }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch(`/cart/${id}`, { quantity });
    return normalizeCart(response.data?.cart || []);
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update quantity');
  }
});

// 4. Remove Item from Cart (DELETE /cart/:productId)
export const removeFromCartApi = createAsyncThunk('cart/removeFromCartApi', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete(`/cart/${id}`);
    return normalizeCart(response.data?.cart || []);
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to remove item');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add to Cart
      .addCase(addToCartApi.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })

      // Update Quantity
      .addCase(updateQuantityApi.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })

      // Remove from Cart
      .addCase(removeFromCartApi.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      });
  },
});

export default cartSlice.reducer;
