import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

export const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

export const getIngredientsThunk = createAsyncThunk(
  'ingredients/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getIngredientsApi();
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    getIngredients: (state) => state.ingredients,
    getIsLoading: (state) => state.isLoading,
    getError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredientsThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getIngredientsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.ingredients = action.payload;
      })
      .addCase(getIngredientsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Unknown error';
      });
  }
});

export default ingredientsSlice.reducer;

export const { getIngredients, getIsLoading, getError } =
  ingredientsSlice.selectors;
