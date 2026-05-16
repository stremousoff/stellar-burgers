describe('тестирование конструктора бургера', () => {
  beforeEach(() => {
    // 1. Перехват API запросов с использованием фикстур
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' });

    // 2. Имитация авторизации (подстановка токенов)
    cy.setCookie('accessToken', 'test-accessToken');
    localStorage.setItem('refreshToken', 'test-refreshToken');

    // 3. Переход на страницу конструктора
    cy.visit('/');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    cy.clearLocalStorage('refreshToken');
  });

  it('должна работать работа модальных окон ингредиента', () => {
    // Проверка открытия: выбираем конкретную булку, чтобы избежать ошибок с ценой
    cy.get('[data-testid="ingredient"]').contains('Краторная булка').click();
    cy.get('[data-testid="modal"]').should('be.visible');

    // Проверка, что в модальном окне именно тот ингредиент, по которому был клик
    cy.get('[data-testid="modal"]').should('contain', 'Краторная булка');

    // Закрытие по нажатию на Esc
    cy.get('body').type('{esc}');
    cy.get('[data-testid="modal"]').should('not.exist');

    // Закрытие по клику на оверлей
    cy.get('[data-testid="ingredient"]').contains('Краторная булка').click();
    cy.get('[data-testid="modal-overlay"]').click({ force: true });
    cy.get('[data-testid="modal"]').should('not.exist');

    // Закрытие по клику на крестик
    cy.get('[data-testid="ingredient"]').contains('Краторная булка').click();
    cy.get('[data-testid="modal-close"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('должен собрать бургер и оформить заказ', () => {
    // 1. Добавление ингредиентов через кнопку "Добавить"
    cy.get('[data-testid="ingredient"]')
      .contains('Краторная булка')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();

    cy.get('[data-testid="ingredient"]')
      .contains('Биокотлета')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();

    // 2. Проверка, что в конструкторе содержатся булки (вверху и внизу) и ингредиент
    cy.get('.constructor-element_pos_top').should('contain', 'Краторная булка');
    cy.get('.constructor-element_pos_bottom').should(
      'contain',
      'Краторная булка'
    );
    cy.get('.constructor-element').should('contain', 'Биокотлета');

    // 3. Оформление заказа
    cy.get('button')
      .contains('Оформить заказ')
      .should('not.be.disabled')
      .click();

    // 4. Проверка открытия модального окна и номера заказа
    cy.get('[data-testid="modal"]').should('be.visible');
    cy.get('[data-testid="order-number"]').should('contain', '12345');

    // 5. Закрытие модального окна
    cy.get('[data-testid="modal-close"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');

    // 6. Проверка, что конструктор очистился
    cy.get('[data-testid="constructor-drop-target"]').should(
      'contain',
      'Выберите булки'
    );
  });
});
