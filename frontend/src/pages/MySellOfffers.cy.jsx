import React from 'react'
import MySellOffers from '../pages/MySellOffers'
import { ip } from '../ip'
import { BrowserRouter as Router } from 'react-router-dom'

describe('<MySellOffers />', () => {
  const mockNFTs = [
    {
      tokenId: 'token_1',
      name: 'NFT 1',
      description: 'Description 1',
      valuation: 1000,
      properties: {
        location: 'Location 1',
        size: '100sqm'
      },
      createdAt: '2024-01-01T00:00:00.000Z',
      sellOffers: [
        {
          nft_offer_index: 'sell_offer_1',
          amount: '1000'
        }
      ],
      buyOffers: [
        {
          nft_offer_index: 'buy_offer_1',
          amount: '900',
          owner: 'buyer_1'
        }
      ]
    },
    {
      tokenId: 'token_2',
      name: 'NFT 2',
      description: 'Description 2',
      valuation: 2000,
      properties: {
        location: 'Location 2',
        size: '200sqm'
      },
      createdAt: '2024-01-02T00:00:00.000Z',
      sellOffers: [],
      buyOffers: []
    }
  ]

  beforeEach(() => {
    // Mock localStorage
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'test_token')
    })

    // Mock initial NFT data fetch
    cy.intercept('GET', `${ip}/api/rwa/my-assets`, {
      statusCode: 200,
      body: {
        assets: mockNFTs
      }
    }).as('fetchNFTsRequest')

    // Mock sell offers fetch
    cy.intercept('POST', `${ip}/api/rwa/list-sell-offers`, {
      statusCode: 200,
      body: {
        RWAselloffers: mockNFTs[0].sellOffers
      }
    }).as('fetchSellOffersRequest')

    // Mock buy offers fetch
    cy.intercept('POST', `${ip}/api/rwa/list-buy-offers`, {
      statusCode: 200,
      body: {
        offers: mockNFTs[0].buyOffers
      }
    }).as('fetchBuyOffersRequest')

    cy.mount(
      <Router>
        <MySellOffers />
      </Router>
    )
  })

  it('renders the NFTs and offers list correctly', () => {
    cy.wait(['@fetchNFTsRequest', '@fetchSellOffersRequest', '@fetchBuyOffersRequest'])
    cy.contains('h2', 'My NFTs and Offers').should('be.visible')
    cy.contains(mockNFTs[0].name).should('be.visible')
    cy.contains(mockNFTs[1].name).should('be.visible')
  })

  it('displays sell offers correctly', () => {
    cy.wait(['@fetchNFTsRequest', '@fetchSellOffersRequest', '@fetchBuyOffersRequest'])
    cy.contains('Active Sell Offers').should('be.visible')
    cy.contains(`${mockNFTs[0].sellOffers[0].amount} XRP`).should('be.visible')
  })

  it('displays buy offers correctly', () => {
    cy.wait(['@fetchNFTsRequest', '@fetchSellOffersRequest', '@fetchBuyOffersRequest'])
    cy.contains('Active Buy Offers').should('be.visible')
    cy.contains(`${mockNFTs[0].buyOffers[0].amount} XRP`).should('be.visible')
  })

  it('handles cancel sell offer flow', () => {
    cy.wait(['@fetchNFTsRequest', '@fetchSellOffersRequest', '@fetchBuyOffersRequest'])

    // Mock cancel sell offer endpoint
    cy.intercept('POST', `${ip}/api/rwa/cancel-sell-offer`, {
      statusCode: 200,
      body: {
        success: true,
        transaction: 'tesSUCCESS'
      }
    }).as('cancelSellOfferRequest')

    // Click cancel button on sell offer
    cy.contains('button', 'Cancel Offer').first().click()

    // Modal should appear
    cy.contains('Cancel Offer').should('be.visible')

    // Fill in seed phrase
    cy.get('input[type="password"]').type('test_seed')

    // Confirm cancellation
    cy.contains('button', 'Confirm cancel').click()

    // Verify request
    cy.wait('@cancelSellOfferRequest').then((interception) => {
      expect(interception.request.body).to.deep.equal({
        tokenOfferId: mockNFTs[0].sellOffers[0].nft_offer_index,
        seed: 'test_seed'
      })
    })
  })

  it('handles accept buy offer flow', () => {
    cy.wait(['@fetchNFTsRequest', '@fetchSellOffersRequest', '@fetchBuyOffersRequest'])

    // Mock accept buy offer endpoint
    cy.intercept('POST', `${ip}/api/rwa/accept-buy-offer`, {
      statusCode: 200,
      body: {
        res: 'tesSUCCESS'
      }
    }).as('acceptBuyOfferRequest')

    // Click accept button on buy offer
    cy.contains('button', 'Accept Offer').first().click()

    // Modal should appear
    cy.contains('Accept Buy Offer').should('be.visible')

    // Fill in seed phrase
    cy.get('input[type="password"]').type('test_seed')

    // Confirm acceptance
    cy.contains('button', 'Confirm Accept').click()

    // Verify request
    cy.wait('@acceptBuyOfferRequest').then((interception) => {
      expect(interception.request.body).to.deep.equal({
        nft_offer_index: mockNFTs[0].buyOffers[0].nft_offer_index,
        seed: 'test_seed',
        walletOwnerBuyRequest: mockNFTs[0].buyOffers[0].owner
      })
    })
  })

  it('handles error when cancelling sell offer', () => {
    cy.wait(['@fetchNFTsRequest', '@fetchSellOffersRequest', '@fetchBuyOffersRequest'])

    // Mock error response for cancel sell offer
    cy.intercept('POST', `${ip}/api/rwa/cancel-sell-offer`, {
      statusCode: 500,
      body: {
        error: 'Failed to cancel offer'
      }
    }).as('cancelSellOfferError')

    // Attempt to cancel offer
    cy.contains('button', 'Cancel Offer').first().click()
    cy.get('input[type="password"]').type('test_seed')
    cy.contains('button', 'Confirm cancel').click()

  })

  it('handles error when accepting buy offer', () => {
    cy.wait(['@fetchNFTsRequest', '@fetchSellOffersRequest', '@fetchBuyOffersRequest'])

    // Mock error response for accept buy offer
    cy.intercept('POST', `${ip}/api/rwa/accept-buy-offer`, {
      statusCode: 500,
      body: {
        error: 'Failed to accept offer'
      }
    }).as('acceptBuyOfferError')

    // Attempt to accept offer
    cy.contains('button', 'Accept Offer').first().click()
    cy.get('input[type="password"]').type('test_seed')
    cy.contains('button', 'Confirm Accept').click()

    // Check error message
    cy.contains('Failed to accept offer').should('be.visible')
  })

  it('shows loading state while fetching data', () => {
    // Add delay to see loading state
    cy.intercept('GET', `${ip}/api/rwa/my-assets`, {
      delay: 1000,
      statusCode: 200,
      body: {
        assets: mockNFTs
      }
    }).as('delayedFetchNFTs')

    cy.mount(
      <Router>
        <MySellOffers />
      </Router>
    )

    cy.contains('Loading...').should('be.visible')
  })
})