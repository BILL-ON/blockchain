import React, { useState } from 'react';
import { ip } from '../../ip'

export default function BuyOfferOnMyRWA({ nft, onOfferAccepted }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [seedPhrase, setSeedPhrase] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleAcceptOffer = async () => {
    if (!seedPhrase || !selectedOffer) return;

    setIsProcessing(true);
    setError('');

    try {
      const response = await fetch(`${ip}/api/rwa/accept-buy-offer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          nft_offer_index: selectedOffer.nft_offer_index,
          seed: seedPhrase,
          walletOwnerBuyRequest: selectedOffer.owner
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to accept offer');
      }

      // Success handling
      onOfferAccepted && onOfferAccepted();
      setIsModalOpen(false);
      setSeedPhrase('');
      setSelectedOffer(null);
    } catch (err) {
      setError(err.message || 'Failed to accept offer');
    } finally {
      setIsProcessing(false);
    }
  };

  const openConfirmModal = (offer) => {
    setSelectedOffer(offer);
    setIsModalOpen(true);
    setError('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSeedPhrase('');
    setSelectedOffer(null);
    setError('');
  };

  return (
    <>
      <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
        <h4 style={{ marginBottom: '1rem' }}>Active Buy Offers</h4>
        {nft.buyOffers && nft.buyOffers.length > 0 ? (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {nft.buyOffers.map(offer => (
              <div
                key={offer.nft_offer_index}
                style={{
                  backgroundColor: '#f9f9f9',
                  padding: '1rem',
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}
              >
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Amount:</strong> {offer.amount} drops
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Offer ID:</strong> {offer.nft_offer_index}
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Owner:</strong> {offer.owner}
                </div>
                <button
                  onClick={() => openConfirmModal(offer)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'green',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  Accept Offer
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#666', fontSize: '0.9rem' }}>No active buy offers</p>
        )}
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '400px'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>Accept Buy Offer</h3>
            <p style={{ marginBottom: '1rem' }}>
              You are about to accept a buy offer for {selectedOffer?.amount} drops from {selectedOffer?.owner}
            </p>
            <input
              type="password"
              placeholder="Enter your seed phrase"
              value={seedPhrase}
              onChange={(e) => setSeedPhrase(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                marginBottom: '1rem',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
            {error && (
              <div style={{ color: 'red', marginBottom: '1rem' }}>
                {error}
              </div>
            )}
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={closeModal}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAcceptOffer}
                disabled={!seedPhrase || isProcessing}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: seedPhrase ? 'green' : '#cccccc',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: seedPhrase ? 'pointer' : 'not-allowed',
                  opacity: isProcessing ? 0.7 : 1
                }}
              >
                {isProcessing ? 'Processing...' : 'Confirm Accept'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}