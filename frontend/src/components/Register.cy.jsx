import Register from '../../src/components/Register'
import { ip } from '../../src/ip'
import { BrowserRouter as Router } from 'react-router-dom';

describe('Register Component', () => {
  beforeEach(() => {
    // Mount component
    cy.mount(
      <Router >

        <Register />
      </Router>
    )

    // Intercept wallet creation request
    cy.intercept('POST', `${ip}/api/auth/create-wallet`, {
      statusCode: 200,
      body: {
        success: true,
        wallet: {
          address: 'test_wallet_address',
          seed: 'test_seed_phrase',
          publicKey: 'test_public_key'
        },
        token: 'test_jwt_token.dgzadyza.dzgdzhd'
      }
    }).as('createWalletRequest')
  })

  it('renders initial state correctly', () => {
    cy.contains('h2', 'Create Your XRPL Wallet').should('be.visible')
    cy.get('button').contains('Create Wallet').should('be.visible')
  })

  it('shows loading state during wallet creation', () => {
    // Add delay to see loading state
    cy.intercept('POST', `${ip}/api/auth/create-wallet`, {
      delay: 1000,
      statusCode: 200,
      body: {
        success: true,
        wallet: {
          address: 'test_wallet_address',
          seed: 'test_seed_phrase',
          publicKey: 'test_public_key'
        },
        token: 'test_jwt_token.dgzadyza.dzgdzhd'
      }
    }).as('delayedCreateWallet')

    cy.get('button').contains('Create Wallet').click()
    cy.get('button').contains('Creating Wallet...').should('be.visible')
    cy.get('button').should('be.disabled')
  })

  it('displays wallet information after successful creation', () => {
    cy.get('button').contains('Create Wallet').click()

    cy.wait('@createWalletRequest')

    // Check if wallet info is displayed
    cy.contains('Your Wallet Information').should('be.visible')
    cy.contains('test_wallet_address').should('be.visible')
    cy.contains('test_seed_phrase').should('be.visible')
    cy.contains('test_public_key').should('be.visible')
  })

  it('handles creation error', () => {
    // Override intercept for error case
    cy.intercept('POST', `${ip}/api/auth/create-wallet`, {
      statusCode: 500,
      body: {
        success: false,
        error: 'Failed to create wallet'
      }
    }).as('createWalletError')

    cy.get('button').contains('Create Wallet').click()
    cy.wait('@createWalletError')
    cy.contains('Failed to create wallet').should('be.visible')
  })

  it('allows navigation to continue after wallet creation', () => {
    cy.get('button').contains('Create Wallet').click()
    cy.wait('@createWalletRequest')

    cy.get('button').contains("I've Saved My Seed Phrase").should('be.visible')
    cy.get('button').contains("I've Saved My Seed Phrase").click()
  })

  it('saves wallet info to localStorage', () => {
    cy.get('button').contains('Create Wallet').click()
    cy.wait('@createWalletRequest')

    // Verify localStorage
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.eq('test_jwt_token.dgzadyza.dzgdzhd')
      expect(win.localStorage.getItem('walletAddress')).to.eq('test_wallet_address')
    })
  })

})