import { useState, useEffect } from 'react';
import { ip } from '../../ip';
import { isInstalled, cancelNFTOffer } from '@gemwallet/api';
import { stringToHex } from '../../utils/StringToHex';

export default function ListBuyOffer({ closePage, tokenId, updateBuyList }) {
  const [offers, setOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userWalletAddress, setUserWalletAddress] = useState('');

  useEffect(() => {
    fetchUserWallet();
    fetchRWAsListOffers();
  }, [updateBuyList]);

  const fetchUserWallet = async () => {
    try {
      const token = localStorage.getItem('token');
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserWalletAddress(payload.walletAddress.result.address);
    } catch (error) {
      console.error('Error getting wallet address:', error);
    }
  };

  const fetchRWAsListOffers = async () => {
    try {
      const response = await fetch(`${ip}/api/rwa/list-buy-offers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ tokenId: tokenId })
      });
      const data = await response.json();
      setOffers(data.offers || []);
    } catch (error) {
      alert('Failed to fetch offers');
    }
  };

  const handleCancelOffer = async (e) => {
    e.preventDefault();
    if (!selectedOffer) return;

    setIsLoading(true);

    try {


      const walletResponse = await isInstalled()

      if (!walletResponse.result.isInstalled) {
        setError('GemWallet extension is not installed')
        setIsDeleting(false)
        return
      }

      const payload = {
        NFTokenOffers: [selectedOffer.nft_offer_index],
        fee: "20",
        memos: [
          {
            memo: {
              memoType: stringToHex('Cancel'),
              memoData: stringToHex('Cancel NFT buy offer')
            }
          }
        ]
      };

      const cancelResponse = await cancelNFTOffer(payload);
      
      console.log(cancelResponse)
      if (cancelResponse.type === "response") {
        await fetchRWAsListOffers(); // Refresh the offers list
        closeModal();
      }
    } catch (error) {
      alert('Failed to cancel offer')
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedOffer(null);
  };

  const isUserOffer = (offer) => {
    return offer.owner === userWalletAddress;
  };

  return (
    <div>
      {offers.length > 0 && (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {offers.map(offer => (
            <div
              key={offer.nft_offer_index}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1.5rem',
                backgroundColor: '#fff'
              }}
            >
              <div style={{ marginBottom: '1rem' }}>
                <strong>Amount:</strong> {offer.amount} drops
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Offer ID:</strong> {offer.nft_offer_index}
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Owner:</strong> {offer.owner}
                {isUserOffer(offer) && (
                  <span style={{ 
                    marginLeft: '0.5rem', 
                    backgroundColor: '#e2e8f0', 
                    padding: '0.2rem 0.5rem', 
                    borderRadius: '4px',
                    fontSize: '0.8rem'
                  }}>
                    (Your offer)
                  </span>
                )}
              </div>
              {isUserOffer(offer) && (
                <button
                  onClick={() => setSelectedOffer(offer)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#ff4444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedOffer && (
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
            <h3 style={{ marginBottom: '1.5rem' }}>Cancel Buy Offer for {selectedOffer.amount} drops</h3>
            <form onSubmit={handleCancelOffer}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: '#ff4444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    opacity: isLoading ? 0.7 : 1
                  }}
                >
                  {isLoading ? "Cancelling..." : "Confirm Cancel"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
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
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}