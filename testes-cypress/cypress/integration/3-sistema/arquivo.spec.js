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

describe('arquivo', () => {
  Cypress.config('defaultCommandTimeout', 10000);

    beforeEach(() => {
      var login_url = Cypress.env('login_url');
      cy.visit(login_url)
    })
  
    it('cadastrarArquivo', () => {
      //login  
      cy.get('#exampleInputEmail').clear().type(Cypress.env('user'))
        .should('have.length', 1)

      cy.get('#exampleInputPassword').clear().type(Cypress.env('password'))
        .should('have.length', 1)

      cy.get('.btn').click();

      cy.get('[ng-class="{ active: isActive(\'/pacientes\') }"] > .nav-link').click();

      cy.get('#busca').clear().type('willians martins');

      cy.get('tbody > .ng-scope > :nth-child(1)').click();

      cy.get('#arquivos-tab').click();
      cy.get('#novo').click();
      cy.get('#arquivo-nome').clear().type('arquivo-nome1');
      cy.get('#arquivo-tipo').clear().type('arquivo-tipo1');
      cy.get('#arquivo-descricao').clear().type('arquivo-descricao1');

      //upload
      cy.get('#arquivo-file')
      .attachFile('../fixtures/example.png');

      cy.get("#arquivo-salvar").click();

      cy.contains('Cadastro efetuado com sucesso!').should('exist');
      cy.contains('arquivo-nome1').should('exist');

      //entrar no arquivo
      cy.get('td').contains('arquivo-nome1').click({force: true});

      //apagar arquivo
      cy.get('#form-arquivos > :nth-child(2) > .btn-danger').click();
      cy.get(':nth-child(1) > .swal-button').click();

      //verificar se apagou
      cy.contains('Exclusão efetuada com sucesso.').should('exist');
      // cy.get('td').contains('arquivo-nome1').should('not.exist');
      // cy.get('.check-box-sub-text').should('not.exist');
      // cy.get('table').contains('td', 'arquivo-nome1').should('not.be.visible');
      cy.get('td:contains("arquivo-nome1")').should('not.exist');
    })
})    