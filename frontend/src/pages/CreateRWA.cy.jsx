import React from 'react'
import CreateRWA from '../pages/CreateRWA'
import { ip } from '../ip'
import { BrowserRouter as Router } from 'react-router-dom'

describe('<CreateRWA />', () => {
  describe('CreateRWA Component', () => {
    beforeEach(() => {
      cy.mount(
        <Router>
          <CreateRWA />
        </Router>
      )

      // Default successful response for RWA creation
      cy.intercept('POST', `${ip}/api/rwa/create`, {
        statusCode: 200,
        body: {
          tokenId: 'test_token_id',
          metadata: {
            name: 'Test RWA',
            description: 'Test Description',
            valuation: '1000',
            properties: {
              location: 'Test Location',
              size: '100sqm'
            }
          }
        }
      }).as('createRWARequest')
    })

    it('renders create RWA form correctly', () => {
      cy.contains('h2', 'Create NFT').should('be.visible')
      cy.get('input[name="name"]').should('exist')
      cy.get('textarea[name="description"]').should('exist')
      cy.get('input[name="valuation"]').should('exist')
      cy.get('input[name="location"]').should('exist')
      cy.get('input[name="size"]').should('exist')
      cy.get('input[name="seed"]').should('exist')
      cy.get('button').contains('Create NFT').should('be.visible')
    })

    it('handles form submission with valid data', () => {
      const testData = {
        name: 'Test RWA',
        description: 'Test Description',
        valuation: '1000',
        location: 'Test Location',
        size: '100sqm',
        seed: 'test_seed_phrase'
      }

      // Fill in the form
      cy.get('input[name="name"]').type(testData.name)
      cy.get('textarea[name="description"]').type(testData.description)
      cy.get('input[name="valuation"]').type(testData.valuation)
      cy.get('input[name="location"]').type(testData.location)
      cy.get('input[name="size"]').type(testData.size)
      cy.get('input[name="seed"]').type(testData.seed)

      // Submit the form
      cy.get('button').contains('Create NFT').click()

      // Verify the request
      cy.wait('@createRWARequest').then((interception) => {
        expect(interception.request.body).to.deep.equal(testData)
        expect(interception.request.headers).to.have.property('authorization')
      })
    })

    it('shows error when submitting with missing fields', () => {
      // Try to submit empty form
      cy.get('button').contains('Create NFT').click()
      
      // Check that the form validation prevents submission
      // and shows the browser's default validation messages
      cy.get('input[name="name"]').then($input => {
        expect($input[0].validationMessage).to.not.be.empty
      })
    })

    it('handles server error response', () => {
      // Override the intercept for this specific test
      cy.intercept('POST', `${ip}/api/rwa/create`, {
        statusCode: 500,
        body: {
          error: 'Creation failed'
        }
      }).as('createRWAError')

      // Fill in the form
      cy.get('input[name="name"]').type('Test RWA')
      cy.get('textarea[name="description"]').type('Test Description')
      cy.get('input[name="valuation"]').type('1000')
      cy.get('input[name="location"]').type('Test Location')
      cy.get('input[name="size"]').type('100sqm')
      cy.get('input[name="seed"]').type('test_seed_phrase')

      // Submit the form
      cy.get('button').contains('Create NFT').click()

      // Wait for error response
      cy.wait('@createRWAError')

      // Check error message is displayed
      cy.contains('Creation failed').should('be.visible')
    })

    it('shows loading state during creation', () => {
      // Add delay to see loading state
      cy.intercept('POST', `${ip}/api/rwa/create`, {
        delay: 1000,
        statusCode: 200,
        body: {
          tokenId: 'test_token_id',
          metadata: {
            name: 'Test RWA',
            description: 'Test Description',
            valuation: '1000',
            properties: {
              location: 'Test Location',
              size: '100sqm'
            }
          }
        }
      }).as('delayedCreateRWA')

      // Fill in the form
      cy.get('input[name="name"]').type('Test RWA')
      cy.get('textarea[name="description"]').type('Test Description')
      cy.get('input[name="valuation"]').type('1000')
      cy.get('input[name="location"]').type('Test Location')
      cy.get('input[name="size"]').type('100sqm')
      cy.get('input[name="seed"]').type('test_seed_phrase')

      // Submit the form
      cy.get('button').contains('Create NFT').click()

      // Verify loading state
      cy.get('button').contains('Creating...').should('be.visible')
      cy.get('button').should('be.disabled')
    })

    it('validates number input for valuation', () => {
      // Try to enter non-numeric value
      cy.get('input[name="valuation"]').type('invalid')
      
      // Check that the input is empty or only contains numbers
      cy.get('input[name="valuation"]').should('have.value', '')
      
      // Enter valid number
      cy.get('input[name="valuation"]').type('1000')
      cy.get('input[name="valuation"]').should('have.value', '1000')
    })
  })
})