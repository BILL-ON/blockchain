import { useState, useEffect } from 'react';
import { ip } from '../../ip'
import { isInstalled, acceptNFTOffer } from '@gemwallet/api';
import { stringToHex } from '../../utils/StringToHex';

export default function ListSellOffer({ closePage, tokenId }) {
  const [offers, setOffers] = useState([])
  const [selectedOffer, setSelectedOffer] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchRWAsListOffers();
  }, []);


  const fetchRWAsListOffers = async (e) => {
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
    }
  }


  const handleBuy = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {

      const walletResponse = await isInstalled()

      if (!walletResponse.result.isInstalled) {
        setError('GemWallet extension is not installed')
        setIsDeleting(false)
        return
      }

      const payload = {
        NFTokenSellOffer: selectedOffer.nft_offer_index,
        fee: "20",
        memos: [
          {
            memo: {
              memoType: stringToHex('Accept'),
              memoData: stringToHex('Accept sell NFT offer')
            }
          }
        ]
      };

      const acceptNFTOfferResponse = await acceptNFTOffer(payload);
      
      if (acceptNFTOfferResponse.type === "response") {
        const response = await fetch(`${ip}/api/rwa/accept-sell-offer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            tokenId
          })
        })
        if (response.ok) {
          setSelectedOffer(null)
          closePage()
        } else {
          throw new Error('Failed to accept offer on the back')
        }
      }
    } catch (error) {
      alert('Failed to buy: ' + error.message)
    } finally {
      setIsLoading(false)
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
                <strong>Amount:</strong> {offer.amount} drops
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
            <h3 style={{ marginBottom: '1.5rem' }}>Buy NFT for {selectedOffer.amount} drops</h3>
            <form onSubmit={handleBuy}>
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
                    cursor: 'pointer',
                    opacity: isLoading ? 0.7 : 1
                  }}
                >
                  {isLoading ? "Purchasing..." : "Confirm Purchase"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOffer(null)
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
