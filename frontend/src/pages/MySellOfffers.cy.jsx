import React from 'react'
import MySellOffers from '../pages/MySellOffers'
import { ip } from '../ip'
import { BrowserRouter } from 'react-router-dom'

describe('MySellOffers Component', () => {
 beforeEach(() => {
   // Mock GemWallet
   cy.window().then((win) => {
     win.GemWallet = {
       isInstalled: cy.stub().resolves({ result: { isInstalled: true } }),
       cancelNFTOffer: cy.stub().resolves({ type: 'response', result: { hash: 'test_hash' } }),
       acceptNFTOffer: cy.stub().resolves({ type: 'response', result: { hash: 'test_hash' } })
     }
   });

   // Mock API responses
   cy.intercept('GET', `${ip}/api/rwa/my-assets`, {
     statusCode: 200,
     body: {
       assets: [{
         tokenId: 'token_1',
         name: 'NFT 1',
         description: 'Test NFT',
         valuation: 1000,
         properties: { location: 'Test', size: '100sqm' }
       }]
     }
   }).as('fetchAssets');

   cy.intercept('POST', `${ip}/api/rwa/list-sell-offers`, {
     statusCode: 200,
     body: {
       RWAselloffers: [{
         nft_offer_index: 'offer_1',
         amount: '1000'
       }]
     }
   }).as('fetchSellOffers');

   cy.intercept('POST', `${ip}/api/rwa/list-buy-offers`, {
     statusCode: 200,
     body: {
       offers: []
     }
   }).as('fetchBuyOffers');

   cy.mount(
     <BrowserRouter>
       <MySellOffers />
     </BrowserRouter>
   );
 });

 it('displays NFTs and offers', () => {
   cy.wait(['@fetchAssets', '@fetchSellOffers', '@fetchBuyOffers']);
   cy.contains('My NFTs and Offers').should('be.visible');
   cy.contains('NFT 1').should('be.visible');
   cy.contains('1000 drops').should('be.visible');
 });

 it('handles cancel offer', () => {
   cy.wait(['@fetchAssets', '@fetchSellOffers']);
   cy.contains('Cancel Offer').click();
   cy.contains('Confirm cancel').click();
   cy.contains('Cancelling...').should('be.visible');
 });
});