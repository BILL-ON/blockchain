import { useState, useEffect } from 'react'
import { ip } from '../ip'
import BuyOfferOnMyRWA from './MyOffers/BuyOfferOnMyRWA'
import { isInstalled, cancelNFTOffer } from "@gemwallet/api"
import { stringToHex } from '../utils/StringToHex'

const MyNFTsAndOffers = () => {
  const [nfts, setNfts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOfferId, setSelectedOfferId] = useState(null)
  const [isCancellingOffer, setIsCancellingOffer] = useState(false)

  useEffect(() => {
    fetchNFTs()
  }, [])

  const fetchNFTs = async () => {
    try {
      // Fetch base NFT data
      const nftResponse = await fetch(`${ip}/api/rwa/my-assets`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const nftData = await nftResponse.json();
      
      if (!nftResponse.ok) {
        throw new Error(nftData.error || 'Failed to fetch NFTs');
      }
  
      // Fetch both sell and buy offers for each NFT
      const nftsWithAllOffers = await Promise.all(
        nftData.assets.map(async (nft) => {
          try {
            // Fetch sell offers
            const sellOfferResponse = await fetch(`${ip}/api/rwa/list-sell-offers`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({ tokenID: nft.tokenId })
            });
            const sellOfferData = await sellOfferResponse.json();
  
            // Fetch buy offers
            const buyOfferResponse = await fetch(`${ip}/api/rwa/list-buy-offers`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({ tokenId: nft.tokenId })
            });
            const buyOfferData = await buyOfferResponse.json();
            console.log(buyOfferData.offers)
  
            // Combine all data into a single NFT object
            return {
              ...nft,
              sellOffers: sellOfferData.RWAselloffers || [],
              buyOffers: buyOfferData.offers || []
            };
          } catch (error) {
            console.error(`Error fetching offers for NFT ${nft.tokenId}:`, error);
            return {
              ...nft,
              sellOffers: [],
              buyOffers: []
            };
          }
        })
      );
      setNfts(nftsWithAllOffers);
    } catch (err) {
      console.error('Failed to fetch NFTs:', err);
      setError('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleCancelOffer = async () => {
    setIsCancellingOffer(true);
    try {


      const walletResponse = await isInstalled()

      if (!walletResponse.result.isInstalled) {
        setError('GemWallet extension is not installed')
        setIsDeleting(false)
        return
      }

      const payload = {
        NFTokenOffers: [selectedOfferId],
        fee: "20",
        memos: [
          {
            memo: {
              memoType: stringToHex('Cancel'),
              memoData: stringToHex('Cancel NFT offer')
            }
          }
        ]
      };

      const cancelResponse = await cancelNFTOffer(payload);
      
      if (cancelResponse.type === "response") {
        fetchNFTs()
        setIsModalOpen(false)
        setSelectedOfferId(null)
      }
    } catch (error) {
      alert('Failed to cancel offer: ' + error.message)
    } finally {
      setIsCancellingOffer(false);
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
                        <strong>Amount:</strong> {offer.amount} drops
                      </div>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <strong>Offer ID:</strong> {offer.nft_offer_index}
                      </div>
                      <button
                        onClick={() => {
                          setSelectedOfferId(offer.nft_offer_index)
                          setIsModalOpen(true)
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
            <BuyOfferOnMyRWA nft={nft} onOfferAccepted={() => {fetchNFTs()}}/>

          </div>
        ))}
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
            <h3 style={{ marginBottom: '1rem' }}>Cancel Offer</h3>
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setSelectedOfferId(null)
                }}
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
                onClick={() => {handleCancelOffer()}}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#ff4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  opacity: isCancellingOffer ? 0.7 : 1
                }}
              >
                {isCancellingOffer ? 'Cancelling...' : 'Confirm cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyNFTsAndOffers