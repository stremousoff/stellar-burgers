import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const postOrderThunk = createAsyncThunk(
  'order/postOrder',
  async (data: string[]) => {
    const res = await orderBurgerApi(data);
    return res.order;
  }
);

export interface TOrderState {
  order: TOrder | null;
  orderRequest: boolean;
  error: string | null;
}

export const initialState: TOrderState = {
  order: null,
  orderRequest: false,
  error: null
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.orderRequest = false;
    }
  },
  selectors: {
    getOrder: (state) => state.order,
    getOrderRequest: (state): boolean => state.orderRequest
  },
  extraReducers: (builder) => {
    builder
      .addCase(postOrderThunk.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(postOrderThunk.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.order = action.payload as unknown as TOrder;
      })
      .addCase(postOrderThunk.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка оформления заказа';
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export const { getOrder, getOrderRequest } = orderSlice.selectors;
export default orderSlice.reducer;
