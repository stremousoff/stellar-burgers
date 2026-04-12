import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

type TUserOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TUserOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

export const getOrdersThunk = createAsyncThunk(
  'userOrders/getOrdersThunk',
  async () => {
    const orders = await getOrdersApi();
    return orders;
  }
);

export const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {
    clearOrders: (state) => {
      state.orders = [];
    }
  },
  selectors: {
    getUserOrders: (state) => state.orders,
    getUserOrdersLoading: (state) => state.isLoading,
    getUserOrdersError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrdersThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrdersThunk.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoading = false;
      })
      .addCase(getOrdersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка загрузки заказов';
      });
  }
});

export const { clearOrders } = userOrdersSlice.actions;

export const { getUserOrders, getUserOrdersLoading, getUserOrdersError } =
  userOrdersSlice.selectors;

export default userOrdersSlice.reducer;
