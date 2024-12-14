// src/pages/Register.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ip } from '../ip'

const Register = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [walletInfo, setWalletInfo] = useState(null)

  const handleCreateWallet = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch(`${ip}/api/auth/create-wallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (response.ok) {
        // Store wallet info and token
        setWalletInfo(data.wallet)
        localStorage.setItem('token', data.token)
        localStorage.setItem('walletAddress', data.wallet.address)
      } else {
        setError(data.error || 'Failed to create wallet')
      }
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinue = () => {
    navigate('/')
  }

  return (
    <div style={{
      maxWidth: '500px',
      margin: '2rem auto',
      padding: '2rem',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      borderRadius: '8px'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Your XRPL Wallet</h2>
      
      {error && (
        <div style={{
          color: 'red',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {!walletInfo ? (
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '2rem', color: '#666' }}>
            Click below to generate your XRPL wallet. Make sure to save your seed phrase - it's the only way to recover your wallet!
          </p>
          <button
            onClick={handleCreateWallet}
            disabled={isLoading}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Creating Wallet...' : 'Create Wallet'}
          </button>
        </div>
      ) : (
        <div>
          <div style={{ 
            backgroundColor: '#f9f9f9', 
            padding: '1rem', 
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>Your Wallet Information</h3>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Address:</strong> {walletInfo.address}
            </p>
            <p style={{ marginBottom: '0.5rem', overflow: "scroll" }}>
              <strong>Public Key:</strong> {walletInfo.publicKey}
            </p>
            <p style={{ 
              marginBottom: '0.5rem',
              backgroundColor: '#fff3cd',
              padding: '0.5rem',
              borderRadius: '4px'
            }}>
              <strong>Seed Phrase:</strong> {walletInfo.seed}
            </p>
          </div>
          
          <div style={{ 
            backgroundColor: '#ffe6e6', 
            padding: '1rem', 
            borderRadius: '4px',
            marginBottom: '2rem'
          }}>
            <p style={{ color: '#cc0000' }}>
              ⚠️ IMPORTANT: Save your seed phrase somewhere safe. You will need it to access your wallet. This is the only time you'll see it!
            </p>
          </div>

          <button
            onClick={handleContinue}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            I've Saved My Seed Phrase - Continue
          </button>
        </div>
      )}
    </div>
  )
}

export default Register