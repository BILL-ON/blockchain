import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ip } from '../ip';
import { isInstalled, getAddress } from "@gemwallet/api";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasGemWallet, setHasGemWallet] = useState(true);

  async function sendAddress(address) {
    try {
      const response = await fetch(`${ip}/api/auth/connect-wallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ address })
      })

      const data = await response.json()
      console.log(data)

      if (data.wallet.address.type === 'response') {
        // Store token and wallet address
        localStorage.setItem('token', data.token)
        localStorage.setItem('walletAddress', data.wallet.address)
        window.dispatchEvent(new Event('auth-change'));
        navigate('/')
      } else {
        setError(data.error || 'Got an error with the back')
      }
    } catch (err) {
      setError('Got an error with the back')
    } finally {
      setIsLoading(false)
    };
  }

  const handleConnect = async (e) => {
    e.preventDefault();
    try {
      isInstalled().then(response => {
        if (response.result.isInstalled) {
          getAddress().then((response) => {
            if (response?.type !== "reject") {
              sendAddress(response);
            } else {
              setError('You refused the connection with GemWallets')
            }
          })
        } else {
          setError('You don\'t have the extension of GemWallets !!!')
        }
      })
      
    } catch(error) {
      setError('An error occured on our end')
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '2rem auto',
      padding: '2rem',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      borderRadius: '8px'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Connect with GemWallet</h2>
      {error && (
        <div style={{
          color: 'red',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}
      
      {!hasGemWallet ? (
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '1rem' }}>
            Please install the GemWallet Chrome extension to continue.
          </p>
          <a 
            href="https://chrome.google.com/webstore/detail/GemWallet/nljnapkakcehgpoheplcfgknhjfdnkli"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#000',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              border: '1px solid #000',
              borderRadius: '4px'
            }}
          >
            Install GemWallet Extension
          </a>
        </div>
      ) : (
        <button
          onClick={handleConnect}
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
          {isLoading ? 'Connecting...' : 'Connect with GemWallet'}
        </button>
      )}

      <p style={{
        marginTop: '1rem',
        textAlign: 'center',
        color: '#666'
      }}>
        Don't have a wallet?{' '}
        <a
          href="https://chromewebstore.google.com/detail/gemwallet/egebedonbdapoieedfcfkofloclfghab"
          style={{
            color: '#000',
            textDecoration: 'none'
          }}
        >
          Create one now
        </a>
      </p>
    </div>
  );
};

export default Login;