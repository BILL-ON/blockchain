// src/pages/MyNFTsAndOffers.jsx
import { useState, useEffect } from 'react'

const MyNFTsAndOffers = () => {
  const [nfts, setNfts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchNFTs()
  }, [])

  const fetchNFTs = async () => {
    try {
      // Fetch NFTs
      const nftResponse = await fetch('http://localhost:3000/api/rwa/my-assets', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const nftData = await nftResponse.json()

      if (!nftResponse.ok) {
        throw new Error(nftData.error || 'Failed to fetch NFTs')
      }

      // For each NFT, fetch its sell offers
      const nftsWithOffers = await Promise.all(
        nftData.assets.map(async (nft) => {
          try {
            const offerResponse = await fetch('http://localhost:3000/api/rwa/list-sell-offers', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({ tokenID: nft.tokenId })
            })
            const offerData = await offerResponse.json()
            
            return {
              ...nft,
              sellOffers: offerData.RWAselloffers || []
            }
          } catch (error) {
            return {
              ...nft,
              sellOffers: []
            }
          }
        })
      )

      setNfts(nftsWithOffers)
    } catch (err) {
      setError('Failed to fetch data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelOffer = async (tokenOfferId, seed) => {
    try {
      const response = await fetch('http://localhost:3000/api/rwa/cancel-sell-offer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          tokenOfferId,
          seed
        })
      })

      if (response.ok) {
        // Refresh the NFTs and offers
        console.log("INNNNNNN")
        fetchNFTs()
      } else {
        const data = await response.json()
        throw new Error(data.error)
      }
    } catch (error) {
      alert('Failed to cancel offer: ' + error.message)
    }
  }

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
      <h2 style={{ marginBottom: '2rem' }}>My NFTs and Offers</h2>

      <div style={{ display: 'grid', gap: '2rem' }}>
        {nfts.map(nft => (
          <div 
            key={nft.tokenId}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1.5rem',
              backgroundColor: '#fff'
            }}
          >
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>{nft.name}</h3>
              <p style={{ color: '#666', marginBottom: '1rem' }}>{nft.description}</p>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '0.5rem',
                fontSize: '0.9rem'
              }}>
                <div>
                  <strong>Location:</strong><br/>
                  {nft.properties.location}
                </div>
                <div>
                  <strong>Size:</strong><br/>
                  {nft.properties.size}
                </div>
                <div>
                  <strong>Valuation:</strong><br/>
                  {nft.valuation}
                </div>
                <div>
                  <strong>Created:</strong><br/>
                  {new Date(nft.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div style={{ 
                marginTop: '1rem',
                padding: '0.5rem',
                backgroundColor: '#f9f9f9',
                borderRadius: '4px',
                fontSize: '0.8rem'
              }}>
                <strong>Token ID:</strong> {nft.tokenId}
              </div>
            </div>

            <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>Active Sell Offers</h4>
              
              {nft.sellOffers && nft.sellOffers.length > 0 ? (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {nft.sellOffers.map(offer => (
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
                        <strong>Amount:</strong> {offer.amount} XRP
                      </div>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <strong>Offer ID:</strong> {offer.nft_offer_index}
                      </div>
                      <button
                        onClick={() => {
                          const seed = prompt('Enter your seed phrase to cancel this offer:')
                          if (seed) {
                            handleCancelOffer(offer.nft_offer_index, seed)
                          }
                        }}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#ff4444',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        Cancel Offer
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#666', fontSize: '0.9rem' }}>No active sell offers</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyNFTsAndOffers