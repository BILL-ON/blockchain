import React from 'react'
import Dashboard from '../../pages/Marketplace/Dashboard'
import { ip } from '../../ip'
import { BrowserRouter } from 'react-router-dom'

describe('Marketplace Dashboard', () => {
  beforeEach(() => {
    // Mock GemWallet
    cy.window().then((win) => {
      win.GemWallet = {
        isInstalled: cy.stub().resolves({ result: { isInstalled: true } }),
        createNFTOffer: cy.stub().resolves({ type: 'response', result: { hash: 'test_hash' } }),
        acceptNFTOffer: cy.stub().resolves({ type: 'response', result: { hash: 'test_hash' } })
      }
    });

    // Mock API responses
    cy.intercept('GET', `${ip}/api/rwa/all`, {
      statusCode: 200,
      body: [{
        tokenId: 'token_1',
        name: 'Asset 1',
        description: 'Test Asset',
        valuation: 1000,
        properties: { location: 'Location 1', size: '100sqm' }
      }]
    }).as('fetchRWAs');

    cy.mount(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
  });

  it('displays available RWAs', () => {
    cy.wait('@fetchRWAs');
    cy.contains('Available RWAs').should('be.visible');
    cy.contains('Asset 1').should('be.visible');
  });

  it('handles view details', () => {
    cy.wait('@fetchRWAs');
    cy.contains('View details').click();
    cy.contains('Buy Offers').should('be.visible');
    cy.contains('Sell Offers').should('be.visible');
  });
});
