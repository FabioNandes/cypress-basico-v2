// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { faker } from '@faker-js/faker';

Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function(){
    const longText = faker.lorem.paragraph();

    cy.get('#firstName').type('Fabio');
    cy.get('#lastName').type('Nandes');
    cy.get('#email').type('fabionandes@mail.com');
    cy.get('#open-text-area').type(longText, {delay:0});
    
    cy.contains('button', 'Enviar').click();
    cy.get('.success').should('be.visible');
})