import React, { useState, useEffect } from 'react';
import { isInstalled, getPublicKey } from "@gemwallet/api"

const ProfileInfo = () => {
  const [adress, setAdress] = useState(null);
  const [publicKey, setpublicKey] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      isInstalled().then(response => {
        if (response.result.isInstalled) {
          const token = localStorage.getItem('token');
          const payload = JSON.parse(atob(token.split('.')[1]));
          setAdress(payload.walletAddress.result.address) 
          getPublicKey().then((response) => {
            if (response?.type !== "reject") {
              setpublicKey(response.result.publicKey);
            } else {
              setError('You refused the connection with GemWallets')
            }
          })
        } else {
          setError('You don\'t have the extension of GemWallets !!!')
        }
      })
    } catch (err) {
      console.log(err)
      setError('Error connecting to wallet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      padding: '16px',
      marginBottom: '12px'
    }}>
      <h3 style={{
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '8px'
      }}>Wallet Adress</h3>
      {isLoading ? (
        <p style={{ color: '#666' }}>Loading...</p>
      ) : error ? (
        <p style={{ color: '#dc2626' }}>{error}</p>
      ) : (
        <div style={{
          fontSize: '24px',
          fontWeight: '700'
        }}>
          {adress}
        </div>
      )}
    </div>
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      padding: '16px',
      marginBottom: '12px'
    }}>
      <h3 style={{
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '8px'
      }}>Public Key</h3>
      {isLoading ? (
        <p style={{ color: '#666' }}>Loading...</p>
      ) : error ? (
        <p style={{ color: '#dc2626' }}>{error}</p>
      ) : (
        <div style={{
          fontSize: '24px',
          fontWeight: '700'
        }}>
          {publicKey}
        </div>
      )}
    </div>
    </div>
  );
};

export default ProfileInfo;