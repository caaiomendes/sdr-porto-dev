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

describe('entradas_saidas', () => {
  Cypress.config('defaultCommandTimeout', 10000);

    beforeEach(() => {
      var login_url = Cypress.env('login_url');
      cy.visit(login_url)
    })
  
    it('cadastrarArquivo', () => {
      //login  
      cy.get('#exampleInputEmail').clear().type(Cypress.env('user_admin'))
        .should('have.length', 1)

      cy.get('#exampleInputPassword').clear().type(Cypress.env('password_admin'))
        .should('have.length', 1)

      cy.get('.btn').click();

      cy.get('[ng-class="{ active: isActive(\'/caixas\') }"] > .nav-link').click();
      cy.get('a[href*="entradas-saidas"]').click();
      cy.get('.selecionarClinica:first').click();
      cy.get('#novo').click();

      // cy.get('#data').should('have.value', '23-03-2022');

      cy.get('#origem').clear().type('origem1');
      
      cy.get('#tipo').select('receita');
      cy.get('#select_receita').select('2');
      
      cy.get('#valor').clear().type('123,00');

      cy.get('#btn-salvar').click();

      cy.contains('Registro criado com sucesso').should('be.visible');
  
      
      cy.get('.swal-button--confirm').click();
      
      cy.contains('Registro criado com sucesso').should('not.be.visible');
      
      //tem que quebrar
      cy.get('td:contains("origem")').should('exist');
    })
})    