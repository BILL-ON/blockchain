// src/pages/Login.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const [seed, setSeed] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Check if seed is empty
    if (!seed) {
      setError('Seed is missing!!!!!!!')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ seed })
      })

      const data = await response.json()

      if (response.ok) {
        // Store token and wallet address
        localStorage.setItem('token', data.token)
        localStorage.setItem('walletAddress', data.wallet.address)
        localStorage.setItem('publicKey', data.wallet.publicKey)
        navigate('/')
      } else {
        setError(data.error || 'Invalid seed')
      }
    } catch (err) {
      setError('Invalid seed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      maxWidth: '400px',
      margin: '2rem auto',
      padding: '2rem',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      borderRadius: '8px'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Login with Seed Phrase</h2>

      {error && (
        <div style={{
          color: 'red',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Seed Phrase:
          </label>
          <input
            type="password"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
            placeholder="Enter your seed phrase"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: isLoading ? 0.7 : 1
          }}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        <p style={{ 
          marginTop: '1rem', 
          textAlign: 'center',
          color: '#666' 
        }}>
          Don't have a wallet?{' '}
          <a 
            href="/register" 
            style={{ 
              color: '#000', 
              textDecoration: 'none' 
            }}
          >
            Create one now
          </a>
        </p>
      </form>
    </div>
  )
}

export default Login