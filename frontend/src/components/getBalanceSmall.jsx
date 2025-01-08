import React, { useState, useEffect } from 'react';
import { ip } from '../ip';

const SmallWalletBalance = () => {
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await fetch(`${ip}/api/rwa/get-balance`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.status === 200) {
        response.json()
          .then(res => {
            setBalance(res.balanceXrp);
          }).catch(err => {
            setError('Failed to fetch balance');
          })
      } else {
        setError('Failed to fetch balance');
      }
    } catch (err) {
      setError('Error connecting to wallet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
    }}>
      {isLoading ? (
        <p style={{ color: '#666' }}>Loading...</p>
      ) : error ? (
        <p style={{ color: '#dc2626' }}>{error}</p>
      ) : (
        <div style={{
          fontSize: '24px',
          fontWeight: '700'
        }}>
          {balance}
        </div>
      )}
    </div>
  );
};

export default SmallWalletBalance;