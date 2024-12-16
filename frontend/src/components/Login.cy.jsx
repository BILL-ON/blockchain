import React from 'react'
import Login from './Login'
import { ip } from '../ip'
import { BrowserRouter as Router } from 'react-router-dom';

describe('<Login />', () => {



describe('Login Component', () => {
  beforeEach(() => {
    cy.mount(
      <Router>
      <Login />
    </Router>
    )
    
    cy.intercept('POST', `${ip}/api/auth/login`, {
      statusCode: 200,
      body: {
        success: true,
        wallet: {
          address: 'test_wallet_address',
          publicKey: 'test_public_key'
        },
        token: 'test_token'
      }
    }).as('loginRequest')
  })

  it('renders login form correctly', () => {
    cy.contains('h2', 'Login with Seed Phrase').should('be.visible')
    cy.get('input[type="password"]').should('exist')
    cy.get('button').contains('Login').should('be.visible')
  })

  it('shows error when submitting empty form', () => {
    cy.get('button').contains('Login').click()
    cy.contains('Seed is missing').should('be.visible')
  })

  it('handles successful login', () => {
    cy.get('input[type="password"]').type('test_seed_phrase')
    cy.get('button').contains('Login').click()
    
    // Verify the request
    cy.wait('@loginRequest').then((interception) => {
      expect(interception.request.body).to.deep.equal({
        seed: 'test_seed_phrase'
      })
    })
  })

  it('handles login error', () => {
    // Override the intercept for this specific test
    cy.intercept('POST', `${ip}/api/auth/login`, {
      statusCode: 401,
      body: {
        success: false,
        error: 'Invalid seed'
      }
    }).as('loginError')

    cy.get('input[type="password"]').type('wrong_seed')
    cy.get('button').contains('Login').click()
    
    cy.wait('@loginError')
    cy.contains('Invalid seed').should('be.visible')
  })

  it('shows loading state during login', () => {
    // Add delay to see loading state
    cy.intercept('POST', `${ip}/api/auth/login`, {
      delay: 1000,
      statusCode: 200,
      body: {
        success: true,
        wallet: {
          address: 'test_wallet_address',
          publicKey: 'test_public_key'
        },
        token: 'test_token'
      }
    }).as('delayedLogin')

    cy.get('input[type="password"]').type('test_seed_phrase')
    cy.get('button').contains('Login').click()
    
    cy.get('button').contains('Logging in...').should('be.visible')
    cy.get('button').should('be.disabled')
  })
})
})