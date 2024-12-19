import React, { useState } from 'react';
import { ip } from '../../ip';
import { isInstalled, createNFTOffer, getAddress } from '@gemwallet/api';
import { stringToHex } from '../../utils/StringToHex';

export default function ModalNewBuyOffer({ 
  onClose, 
  tokenId,
  owner,
  onOfferCreated 
}) {
  const [formData, setFormData] = useState({
    amount: '',
    expiration: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

   try {


      const walletResponse = await isInstalled()

      if (!walletResponse.result.isInstalled) {
        setError('GemWallet extension is not installed')
        setIsCreatingOffer(false)
        return
      }


      const createOfferPayload = {
        NFTokenID: tokenId,
        amount: (formData.amount * 1000000).toString(),
        fee: "20",
        owner,
        flags: {
          tfSellNFToken: false // If enabled, indicates that the offer is a sell offer. Otherwise, it is a buy offer.
        },
        memos: [
          {
            memo: {
              memoType: stringToHex("Buy"),
              memoData: stringToHex("RWA NFT Offer")
            }
          }
        ]
      }

      const createOfferResponse = await createNFTOffer(createOfferPayload)
      if (createOfferResponse.type === 'response') {
        onOfferCreated && onOfferCreated();
        handleClose();
      } else {
        setError('You rejected the transaction!!!!')
      }
    } catch (err) {
      console.log(err)
      setError('Failed to create buy offer')
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClose = () => {
    setFormData({
      amount: '',
      expiration: ''
    });
    setError('');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '500px'
      }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Create Buy Offer</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Amount (XRP):
            </label>
            <input
              type="string"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0"
              step="0.000001"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>

          {error && (
            <div style={{ 
              color: 'red', 
              marginBottom: '1rem', 
              padding: '0.5rem',
              backgroundColor: '#fff5f5',
              borderRadius: '4px'
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? "Creating..." : "Create Offer"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: '#fff',
                color: '#000',
                border: '1px solid #000',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}