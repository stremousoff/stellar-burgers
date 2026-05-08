import reducer, {
  getIngredientsThunk,
  initialState
} from '../slices/ingredientsSlice';

describe('тестирование редьюсера ingredientsSlice', () => {
  const mockIngredients = [
    { _id: '1', name: 'Ингредиент 1', type: 'main', price: 100 },
    { _id: '2', name: 'Ингредиент 2', type: 'bun', price: 200 }
  ];

  it('должен возвращать начальное состояние', () => {
    expect(reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialState
    );
  });

  it('должен менять isLoading на true при вызове getIngredientsThunk.pending', () => {
    const action = { type: getIngredientsThunk.pending.type };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен записывать ингредиенты и менять isLoading на false при getIngredientsThunk.fulfilled', () => {
    const action = {
      type: getIngredientsThunk.fulfilled.type,
      payload: mockIngredients
    };
    const state = reducer({ ...initialState, isLoading: true }, action);
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.error).toBeNull();
  });

  it('должен записывать ошибку и менять isLoading на false при getIngredientsThunk.rejected', () => {
    const errorText = 'Ошибка загрузки';
    const action = {
      type: getIngredientsThunk.rejected.type,
      error: { message: errorText }
    };
    const state = reducer({ ...initialState, isLoading: true }, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorText);
  });
});
