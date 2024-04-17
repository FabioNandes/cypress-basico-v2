/// <reference types ="cypress"/>
import { faker } from '@faker-js/faker';
import { expect } from 'chai';

describe('Central de Atendimento ao cliente TAT', () => {

  beforeEach(() => {
    cy.visit('./src/index.html')
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
  });

  it('Preenche campos e envia formulário', () => {
    const longText = faker.lorem.paragraph();

    cy.clock()

    cy.get('#firstName').type('Fabio');
    cy.get('#lastName').type('Nandes');
    cy.get('#email').type('fabionandes@mail.com');
    cy.get('#open-text-area').type(longText, {delay:0});
    
    cy.contains('button', 'Enviar').click();
    cy.get('.success').should('be.visible');
    cy.tick(3000)
    cy.get('.success').should('not.be.visible');

  
    cy.get('button[type="submit"]').click();
    cy.get('.error').should('be.visible');


  })

  it('Mensagem de erro ao submeter com email inválido', () => {
    cy.get('#firstName').type('Fabio');
    cy.get('#lastName').type('Nandes');
    cy.get('#email').type('fabionandes@exemplo,');
    cy.get('#open-text-area').type('Teste');
    
    cy.contains('button', 'Enviar').click();

    cy.get('.error').should('be.visible');
  });

  it('Campo de telefone continua vazio ao usar valor não numérico', () => {
    cy.get('#phone')
      .type('abcnksdf')
      .should('have.value', '');
  });

  it('Mensagem de erro quando o telefone se torna obrigatório', () => {
    const longText = faker.lorem.paragraph();

    cy.get('#firstName').type('Fabio');
    cy.get('#lastName').type('Nandes');
    cy.get('#email').type('fabionandes@mail.com');
    cy.get('#phone-checkbox').check();
    cy.get('#open-text-area').type(longText, {delay:0});
    
    cy.contains('button', 'Enviar').click();

    cy.get('.error').should('be.visible');
  });



  it('envia o formulário com sucesso com comando customizado', () => {
    cy.get('#product')
      .select('YouTube')
      .should('have.value', 'youtube');
    
    cy.get('input[type="radio"][value="feedback"]')
      .check()
      .should('have.value', 'feedback');
      
    cy.fillMandatoryFieldsAndSubmit()
  });

  it('Marca radiobutton e checkboxes e verifica', () => {
    cy.get('input[type="radio"]')
      .should('have.length', 3)
      .each(function($radio){
        cy.wrap($radio).check()
        cy.wrap($radio).should('be.checked')
      })

    cy.get('input[type="checkbox"]')
      .check()
      .last().uncheck()
      .should('not.be.checked');
  });
  
  it('Seleciona arquivo da pasta fixtures simulando drag and drop e usando alias', () => {
    cy.fixture('example.json').as('sampleFile')
    
    cy.get('input[type="file"]')
      .should('not.have.value')
      .selectFile('@sampleFile', { action: 'drag-drop' })
      .should(function($input){
        expect($input[0].files[0].name).to.equal('example.json')
      })
  });


  it('Verifica abertura de aba Política de privacidade', () => {
    cy.get('#privacy a').should('have.attr', 'target', '_blank');

    //retira target blank para abrir na mesma aba
    cy.get('#privacy a')
      .invoke('removeAttr', 'target')
      .click()
    
    cy.contains('Talking About Testing').should('be.visible')
  });


  it('Exibe e esconde as mensagens de erro usando invoke', () => {
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide')
      .should('not.be.visible')
    
    cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible')
  });

  it('Preenche a área de texto usando invoke', () => {
    const longText = Cypress._.repeat('0123456789', 20)

    cy.get('#open-text-area')
      .invoke('val', longText)
      .should('have.value', longText)

  });

  it.only('Realiza uma requisição HTTP', () => {
    cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
      .should(function(response){
        const { status, statusText, body } = response
        expect(status).to.equal(200)
        expect(statusText).to.equal('OK')
        expect(body).to.include('CAC TAT')
      })
  });

})