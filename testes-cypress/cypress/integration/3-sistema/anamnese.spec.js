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

describe('Anamnese', () => {
    beforeEach(() => {
      var login_url = Cypress.env('login_url');
      cy.visit(login_url)
    })
  
    it('navegar até prontuários', () => {
      //login  
      cy.get('#exampleInputEmail').clear().type(Cypress.env('user'))
        .should('have.length', 1)

      cy.get('#exampleInputPassword').clear().type(Cypress.env('password'))
        .should('have.length', 1)

      cy.get('.btn').click();

      cy.get('[ng-class="{ active: isActive(\'/pacientes\') }"] > .nav-link').click();

      cy.get('#busca').clear().type('willians martins');

      cy.get('tbody > .ng-scope > :nth-child(1)').click();

      cy.get('#anamnese-tab').click();

      cy.get('#1').clear().type('motivo1');

      cy.get(':nth-child(12) > .btn-primary').click();

      cy.contains('Atualização efetuada com sucesso.').should('exist');
    })
})    