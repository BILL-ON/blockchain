import { useState, useEffect } from 'react';
import { ip } from '../../ip';

export default function ListBuyOffer({ closePage, tokenId, updateBuyList }) {
  const [offers, setOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [seed, setSeed] = useState('');
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
      setUserWalletAddress(payload.walletAddress);
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
    if (!selectedOffer || !seed) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${ip}/api/rwa/cancel-buy-offer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          tokenOfferId: selectedOffer.nft_offer_index,
          seed: seed
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel offer');
      }

      // Success handling
      alert('Offer cancelled successfully');
      await fetchRWAsListOffers(); // Refresh the offers list
      closeModal();
    } catch (error) {
      alert(error.message || 'Failed to cancel offer');
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedOffer(null);
    setSeed('');
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
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Seed Phrase:
                </label>
                <input
                  type="password"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
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