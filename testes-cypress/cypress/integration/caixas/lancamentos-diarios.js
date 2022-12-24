// planejamento-financeiro.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test
Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
  })

describe('Lançamentos Diários', () => {
  Cypress.config('defaultCommandTimeout', 10000);

    beforeEach(() => {
      var login_url = Cypress.env('login_url');
      cy.visit(login_url)
    })
  
    it('apoio', () => {
      //login  
      cy.get('#exampleInputEmail').clear().type(Cypress.env('user_admin'))
        .should('have.length', 1)

      cy.get('#exampleInputPassword').clear().type(Cypress.env('password_admin'))
        .should('have.length', 1)

      cy.get('.btn').click();

      cy.get('[ng-class="{ active: isActive(\'/caixas\') }"] > .nav-link').click();
      cy.get('a[href*="apoio"]').click();

      cy.get('.selecionarClinica:first').click();
      // cy.get('#novo').click();

      //preencher periodo
      cy.get('#ano').clear().type("2020");
      cy.get('#mes').clear().type("11");

      cy.get('.btn-success').click();

      //verificar se a tabela esta visivel
      cy.get('.tabela.tabela1').should('have.length', 1);

    })
})    