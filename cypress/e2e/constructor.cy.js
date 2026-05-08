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
    cy.visit('http://localhost:4000');
  });

  it('должна работать работа модальных окон ингредиента', () => {
    // 1. Проверка открытия
    cy.get('[data-testid="ingredient"]').first().click();
    cy.get('[data-testid="modal"]').should('be.visible');

    // 2. Закрытие по нажатию на Esc
    cy.get('body').type('{esc}');
    cy.get('[data-testid="modal"]').should('not.exist');

    // 3. Снова открываем для проверки оверлея
    cy.get('[data-testid="ingredient"]').first().click();
    cy.get('[data-testid="modal"]').should('be.visible');

    // 4. Закрытие по клику на оверлей (пустое место)
    // Мы используем force: true, так как оверлей может быть перекрыт самим окном
    cy.get('[data-testid="modal-overlay"]').click({ force: true });
    cy.get('[data-testid="modal"]').should('not.exist');

    // 5. Снова открываем для проверки крестика (финально)
    cy.get('[data-testid="ingredient"]').first().click();
    cy.get('[data-testid="modal-close"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('должен собрать бургер и оформить заказ', () => {
    // 1. Добавление ингредиентов через кнопку "Добавить"
    // (Используем contains для поиска конкретных названий из ваших моков)
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

    // 2. Проверка, что кнопка оформления заказа стала активной, и клик по ней
    cy.get('button')
      .contains('Оформить заказ')
      .should('not.be.disabled')
      .click();

    // 3. Проверка открытия модального окна и номера заказа
    cy.get('[data-testid="modal"]').should('be.visible');
    cy.get('[data-testid="order-number"]').should('contain', '12345');

    // 4. Закрытие модального окна
    cy.get('[data-testid="modal-close"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');

    // 5. Проверка, что конструктор очистился (появился текст-заглушка)
    cy.get('[data-testid="constructor-drop-target"]').should(
      'contain',
      'Выберите булки'
    );
  });
});
