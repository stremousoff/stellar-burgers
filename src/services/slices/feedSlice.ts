import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrdersData, TOrder } from '@utils-types';
import { create } from 'domain';
import { get } from 'http';

export const fetchFeed = createAsyncThunk('feed/fetchFeed', async () => {
  const feed = await getFeedsApi();
  return feed;
});

type TFeedState = TOrdersData & {
  isLoading: boolean;
  error: string | null;
};

export const feedInit: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: true,
  error: null
};

export const orderSlice = createSlice({
  name: 'feed',
  initialState: feedInit,
  reducers: {},
  selectors: {
    getFeed: (state) => state,
    getOrdersFeed: (state) => state.orders,
    getTotal: (state) => state.total,
    getTotalToday: (state) => state.totalToday,
    getIsLoading: (state) => state.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Unknown error';
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.isLoading = false;
        state.error = null;
      });
  }
});

export default orderSlice.reducer;

export const {
  getFeed,
  getOrdersFeed,
  getOrdersFeed: getOrders,
  getTotal,
  getTotalToday,
  getIsLoading
} = orderSlice.selectors;
