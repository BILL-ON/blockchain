import React, { useState } from 'react';
import { ip } from '../../ip'
import { isInstalled, acceptNFTOffer } from '@gemwallet/api';
import { stringToHex } from '../../utils/StringToHex';

export default function BuyOfferOnMyRWA({ nft, onOfferAccepted }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleAcceptOffer = async () => {
    if (!selectedOffer) return;

    setIsProcessing(true);
    setError('');

    try {
      const walletResponse = await isInstalled()

      if (!walletResponse.result.isInstalled) {
        setError('GemWallet extension is not installed')
        setIsDeleting(false)
        return
      }

      const payload = {
        NFTokenBuyOffer: selectedOffer.nft_offer_index,
        fee: "20",
        memos: [
          {
            memo: {
              memoType: stringToHex('Accept'),
              memoData: stringToHex('Accept buy NFT offer')
            }
          }
        ]
      };

      const acceptNFTOfferResponse = await acceptNFTOffer(payload);
      
      if (acceptNFTOfferResponse.type === "response") {
        const response = await fetch(`${ip}/api/rwa/accept-buy-offer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            tokenId: nft.tokenId,
            walletOwnerBuyRequest: selectedOffer.owner
          })
        })
        if (response.ok) {
          onOfferAccepted && onOfferAccepted();
          setIsModalOpen(false);
          setSelectedOffer(null);
        } else {
          throw new Error('Failed to accept offer on the back')
        }
      }
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
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'green',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
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