import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

export type TConstructorSlice = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

export const initialState: TConstructorSlice = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      }),
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ index: number; step: number }>
    ) => {
      const { index, step } = action.payload;
      const newIndex = index + step;
      if (newIndex < 0 || newIndex >= state.ingredients.length) return;

      const movedItem = state.ingredients[index];
      state.ingredients.splice(index, 1);
      state.ingredients.splice(newIndex, 0, movedItem);
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  },
  selectors: {
    getConstructorState: (state) => state
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;

export const { getConstructorState } = constructorSlice.selectors;

export default constructorSlice.reducer;
