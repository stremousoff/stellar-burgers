import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  initialState
} from '../slices/constructorSlice';

describe('тестирование редьюсера burgerConstructor', () => {
  const mockIngredient = {
    _id: '1',
    name: 'Дикая котлета',
    type: 'main',
    price: 100
  } as any;

  const mockBun = {
    _id: '2',
    name: 'Краторная булка',
    type: 'bun',
    price: 200
  } as any;

  it('должен обрабатывать добавление ингредиента (addIngredient)', () => {
    const newState = reducer(initialState, addIngredient(mockIngredient));
    expect(newState.ingredients.length).toBe(1);
    expect(newState.ingredients[0]).toEqual(
      expect.objectContaining({
        _id: '1',
        name: 'Дикая котлета',
        type: 'main'
      })
    );
    expect(newState.ingredients[0].id).toBeDefined(); // Проверка наличия уникального ID
  });

  it('должен обрабатывать добавление булки (addIngredient)', () => {
    const newState = reducer(initialState, addIngredient(mockBun));
    expect(newState.bun).toEqual(
      expect.objectContaining({
        _id: '2',
        name: 'Краторная булка',
        type: 'bun'
      })
    );
  });

  it('должен обрабатывать удаление ингредиента (removeIngredient)', () => {
    const stateWithItem = {
      ...initialState,
      ingredients: [{ ...mockIngredient, id: 'test-id' }]
    };
    const newState = reducer(stateWithItem, removeIngredient('test-id'));
    expect(newState.ingredients.length).toBe(0);
  });

  it('должен обрабатывать изменение порядка (moveIngredient)', () => {
    const stateWithItems = {
      ...initialState,
      ingredients: [
        { ...mockIngredient, id: '1', name: 'Первый' },
        { ...mockIngredient, id: '2', name: 'Второй' }
      ]
    };

    const newState = reducer(
      stateWithItems,
      moveIngredient({ index: 0, step: 1 })
    );
    expect(newState.ingredients[0].name).toBe('Второй');
    expect(newState.ingredients[1].name).toBe('Первый');
  });
});
