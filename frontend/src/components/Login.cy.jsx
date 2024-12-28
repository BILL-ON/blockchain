import React from 'react';
import Login from '../../src/components/Login';
import { BrowserRouter } from 'react-router-dom';

describe('Login Component Tests', () => {
  it('renders login form correctly', () => {
    cy.mount(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    cy.contains('Connect with GemWallet').should('be.visible');
  });
});