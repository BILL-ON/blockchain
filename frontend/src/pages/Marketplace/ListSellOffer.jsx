import { useState, useEffect } from 'react';
import { ip } from '../../ip'

export default function ListSellOffer({ tokenId }) {
  const [offers, setOffers] = useState([])
  const [selectedOffer, setSelectedOffer] = useState(null)
  const [seed, setSeed] = useState('')  

  useEffect(() => {
    fetchRWAs();
  }, []);


  const fetchRWAs = async (e) => {
    // setLoading(true)
    console.log(tokenId)
    try {
      const response = await fetch(`${ip}/api/rwa/list-sell-offers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ tokenID: tokenId })
      })
      const data = await response.json()
      setOffers(data.RWAselloffers || [])
    } catch (error) {
      alert('Failed to fetch offers')
    } finally {
      // setLoading(false)
    }
  }


  const handleBuy = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${ip}/api/rwa/accept-sell-offer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          nft_offer_index: selectedOffer.nft_offer_index,
          seed
        })
      })
      
      if (response.ok) {
        setSelectedOffer(null)
        setSeed('')
      } else {
        throw new Error('Failed to accept offer')
      }
    } catch (error) {
      alert('Failed to buy: ' + error.message)
    }
  }

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
                <strong>Amount:</strong> {offer.amount} XRP
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Offer ID:</strong> {offer.nft_offer_index}
              </div>
              <button
                onClick={() => setSelectedOffer(offer)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#4CAF50',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Buy Now
              </button>
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
            <h3 style={{ marginBottom: '1.5rem' }}>Buy NFT for {selectedOffer.amount} XRP</h3>
            <form onSubmit={handleBuy}>
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
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Confirm Purchase
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOffer(null)
                    setSeed('')
                  }}
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
      )}
    </div>
  )
}
