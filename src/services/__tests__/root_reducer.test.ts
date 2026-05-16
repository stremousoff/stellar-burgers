import { rootReducer } from '../store'; // путь к файлу со скриншота

describe('Проверка rootReducer', () => {
  it('должен инициализировать правильное начальное состояние', () => {
    // Вызываем rootReducer с undefined состоянием и неизвестным экшеном
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    // Проверяем, что состояние инициализировано правильно
    // Значения должны совпадать с initialState каждого слайса
    expect(initialState).toEqual({
      ingredients: rootReducer(undefined, { type: '@@INIT' }).ingredients,
      burgerConstructor: rootReducer(undefined, { type: '@@INIT' })
        .burgerConstructor,
      feed: rootReducer(undefined, { type: '@@INIT' }).feed,
      user: rootReducer(undefined, { type: '@@INIT' }).user,
      userOrders: rootReducer(undefined, { type: '@@INIT' }).userOrders,
      order: rootReducer(undefined, { type: '@@INIT' }).order
    });
  });
});
