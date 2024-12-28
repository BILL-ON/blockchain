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
})