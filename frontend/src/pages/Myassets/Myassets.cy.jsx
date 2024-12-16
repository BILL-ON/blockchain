import React from 'react'
import Myassets from './Myassets'
import { ip } from '../../ip'
import { BrowserRouter as Router } from 'react-router-dom'

describe('<Myassets />', () => {
  const mockAssets = [
    {
      tokenId: 'token_1',
      name: 'Asset 1',
      description: 'Description 1',
      valuation: 1000,
      properties: {
        location: 'Location 1',
        size: '100sqm'
      },
      createdAt: '2024-01-01T00:00:00.000Z'
    },
    {
      tokenId: 'token_2',
      name: 'Asset 2',
      description: 'Description 2',
      valuation: 2000,
      properties: {
        location: 'Location 2',
        size: '200sqm'
      },
      createdAt: '2024-01-02T00:00:00.000Z'
    }
  ]

  beforeEach(() => {
    // Mock localStorage
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'test_token')
    })

    // Default successful response for fetching assets
    cy.intercept('GET', `${ip}/api/rwa/my-assets`, {
      statusCode: 200,
      body: {
        assets: mockAssets
      }
    }).as('fetchAssetsRequest')

    cy.mount(
      <Router>
        <Myassets />
      </Router>
    )
  })

  it('renders the assets list correctly', () => {
    cy.wait('@fetchAssetsRequest')
    cy.contains('h2', 'My Assets').should('be.visible')
    cy.get('[data-testid="asset-card"]').should('have.length', 2)
  })

  it('displays asset details correctly', () => {
    cy.wait('@fetchAssetsRequest')
    
    // Check first asset details
    cy.contains(mockAssets[0].name).should('be.visible')
    cy.contains(mockAssets[0].description).should('be.visible')
    cy.contains(mockAssets[0].properties.location).should('be.visible')
    cy.contains(mockAssets[0].properties.size).should('be.visible')
    cy.contains(mockAssets[0].valuation).should('be.visible')
    cy.contains(mockAssets[0].tokenId).should('be.visible')
  })

  it('handles create sell offer flow', () => {
    cy.wait('@fetchAssetsRequest')

    // Mock create sell offer endpoint
    cy.intercept('POST', `${ip}/api/rwa/create-sell-offer`, {
      statusCode: 200,
      body: {
        offerID: 'offer_1',
        transaction: { result: 'success' }
      }
    }).as('createSellOfferRequest')

    // Click create sell offer button on first asset
    cy.contains('button', 'Create Sell Offer').first().click()

    // Modal should appear
    cy.contains('Create Sell Offer for Asset 1').should('be.visible')

    // Fill in sell offer form
    cy.get('input[type="number"]').type('1000')
    cy.get('input[type="password"]').type('test_seed')

    // Submit form
    cy.contains('button', 'Create Offer').click()

    // Verify request
    cy.wait('@createSellOfferRequest').then((interception) => {
      expect(interception.request.body).to.deep.equal({
        tokenID: mockAssets[0].tokenId,
        amount: '1000',
        seed: 'test_seed'
      })
    })
  })

  it('handles delete asset flow', () => {
    cy.wait('@fetchAssetsRequest')

    // Mock delete endpoint
    cy.intercept('DELETE', `${ip}/api/rwa/delete-rwa`, {
      statusCode: 200,
      body: {
        tokenId: mockAssets[0].tokenId,
        transaction: 'tesSUCCESS'
      }
    }).as('deleteAssetRequest')

    // Click delete button on first asset
    cy.get('[data-testid="button-trash"]').first().click()

    // Delete modal should appear
    cy.contains('Delete RWA:').should('be.visible')

    // Fill in seed phrase
    cy.get('input[type="password"]').type('test_seed')

    // Confirm deletion
    cy.contains('button', 'Delete RWA').click()

    // Verify request
    cy.wait('@deleteAssetRequest').then((interception) => {
      expect(interception.request.body).to.deep.equal({
        tokenId: mockAssets[0].tokenId,
        seed: 'test_seed'
      })
    })
  })

  it('handles error when fetching assets', () => {
    // Override the intercept for this specific test
    cy.intercept('GET', `${ip}/api/rwa/my-assets`, {
      statusCode: 500,
      body: {
        error: 'Failed to fetch assets'
      }
    }).as('fetchAssetsError')

    cy.mount(
      <Router>
        <Myassets />
      </Router>
    )

    cy.wait('@fetchAssetsError')
  })

  it('handles error in create sell offer', () => {
    cy.wait('@fetchAssetsRequest')

    // Mock error response for create sell offer
    cy.intercept('POST', `${ip}/api/rwa/create-sell-offer`, {
      statusCode: 500,
      body: {
        error: 'Failed to create sell offer'
      }
    }).as('createSellOfferError')

    // Click create sell offer button
    cy.contains('button', 'Create Sell Offer').first().click()

    // Fill in form
    cy.get('input[type="number"]').type('1000')
    cy.get('input[type="password"]').type('test_seed')

    // Submit form
    cy.contains('button', 'Create Offer').click()

  })

  it('handles error in delete asset', () => {
    cy.wait('@fetchAssetsRequest')

    // Mock error response for delete
    cy.intercept('DELETE', `${ip}/api/rwa/delete-rwa`, {
      statusCode: 500,
      body: {
        error: 'Failed to delete token'
      }
    }).as('deleteAssetError')

    // Click delete button
    cy.get('[data-testid="button-trash"]').first().click()

    // Fill in seed phrase
    cy.get('input[type="password"]').type('test_seed')

    // Confirm deletion
    cy.contains('button', 'Delete RWA').click()

    // Check error message
    cy.contains('Failed to delete token').should('be.visible')
  })

  it('refreshes asset list after successful deletion', () => {
    cy.wait('@fetchAssetsRequest')

    // Mock successful delete
    cy.intercept('DELETE', `${ip}/api/rwa/delete-rwa`, {
      statusCode: 200,
      body: {
        tokenId: mockAssets[0].tokenId,
        transaction: 'tesSUCCESS'
      }
    }).as('deleteAssetRequest')

    // Mock subsequent fetch with one less asset
    cy.intercept('GET', `${ip}/api/rwa/my-assets`, {
      statusCode: 200,
      body: {
        assets: [mockAssets[1]]
      }
    }).as('refreshAssetsRequest')

    // Delete first asset
    cy.get('[data-testid="button-trash"]').first().click()
    cy.get('input[type="password"]').type('test_seed')
    cy.contains('button', 'Delete RWA').click()

    // Verify refresh request was made
    cy.wait('@deleteAssetRequest')
    cy.wait('@refreshAssetsRequest')
    
    // Verify only one asset is now displayed
    cy.get('[data-testid="asset-card"]').should('have.length', 1)
  })
})