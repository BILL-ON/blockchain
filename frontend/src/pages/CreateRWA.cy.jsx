import React from 'react'
import CreateRWA from '../pages/CreateRWA'
import { ip } from '../ip'
import { BrowserRouter as Router } from 'react-router-dom'

describe('CreateRWA Component', () => {
 beforeEach(() => {
   // Mock GemWallet API
   cy.window().then((win) => {
     win.GemWallet = {
       isInstalled: cy.stub().resolves({ result: { isInstalled: true } }),
       mintNFT: cy.stub().resolves({ type: 'response', result: { hash: 'test_hash', NFTokenID: 'test_token' } })
     }
   });

   // Mock API response
   cy.intercept('POST', `${ip}/api/rwa/create`, {
     statusCode: 200,
     body: {
       tokenId: 'test_token_id',
       metadata: { name: 'Test RWA' }
     }
   }).as('createRWARequest');

   cy.mount(
     <Router>
       <CreateRWA />
     </Router>
   );
 });

 it('renders form correctly', () => {
   cy.contains('Create NFT').should('be.visible');
   cy.get('input[name="name"]').should('exist');
   cy.get('textarea[name="description"]').should('exist');
   cy.get('input[name="valuation"]').should('exist');
 });

 it('handles form submission', () => {
   cy.get('input[name="name"]').type('Test RWA');
   cy.get('textarea[name="description"]').type('Test Description'); 
   cy.get('input[name="valuation"]').type('1000');
   cy.get('input[name="location"]').type('Test Location');
   cy.get('input[name="size"]').type('100sqm');
   
   cy.get('button').contains('Create NFT').click();
   cy.contains('Creating...').should('be.visible');
   cy.get('button').should('be.disabled');
 });

 it('shows validation errors', () => {
   cy.get('button').contains('Create NFT').click();
   cy.get('input[name="name"]').then($input => {
     expect($input[0].validationMessage).to.not.be.empty;
   });
 });
});