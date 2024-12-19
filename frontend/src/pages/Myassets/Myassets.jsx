import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ip } from '../../ip'
import { FaTrash } from "react-icons/fa";
import DeleteModal from './DeleteModal';
import { isInstalled, createNFTOffer } from '@gemwallet/api';
import { stringToHex } from '../../utils/StringToHex';

const MyAssets = () => {
  const navigate = useNavigate()
  const [assets, setAssets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [sellAmount, setSellAmount] = useState('')
  const [isCreatingOffer, setIsCreatingOffer] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [selectedDeleteAsset, setSelectedDeleteAsset] = useState('')
  const [updateAssets, setUpdateAssets] = useState(0)

  useEffect(() => {
    fetchAssets()
  }, [updateAssets])

  const fetchAssets = async () => {
    try {
      const response = await fetch(`${ip}/api/rwa/my-assets`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      const data = await response.json()

      if (response.ok) {
        setAssets(data.assets)
      } else {
        setError(data.error || 'Failed to fetch assets')
      }
    } catch (err) {
      setError('Failed to fetch assets')
    } finally {
      setIsLoading(false)
    }
  }
  const handleCreateOffer = async (e) => {
    e.preventDefault()
    try {

      setIsCreatingOffer(true)

      const walletResponse = await isInstalled()

      if (!walletResponse.result.isInstalled) {
        setError('GemWallet extension is not installed')
        setIsCreatingOffer(false)
        return
      }

      const createOfferPayload = {
        NFTokenID: selectedAsset.tokenId,
        amount: (sellAmount * 1000000).toString(),
        fee: "20",
        flags: {
          tfSellNFToken: true // If enabled, indicates that the offer is a sell offer. Otherwise, it is a buy offer.
        },
        memos: [
          {
            memo: {
              memoType: stringToHex("Sell"),
              memoData: stringToHex("RWA NFT Offer")
            }
          }
        ]
      }
      // console.log(createOfferPayload)

      const createOfferResponse = await createNFTOffer(createOfferPayload)
      if (createOfferResponse.type === 'response') {
        setSelectedAsset(null);
      } else {
        setError('You rejected the transaction!!!!')
      }
    } catch (err) {
      console.log(err)
      setError('Failed to create sell offer')
    } finally {
      setIsCreatingOffer(false)
    }
  }

  function handleDeleteRWA(asset) {
    setOpenDeleteModal(true);
    setSelectedDeleteAsset(asset);
  }

  function closeDeleteModal() {
    setOpenDeleteModal(false);
    setSelectedDeleteAsset('');
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '2rem auto',
      padding: '0 1rem'
    }}>
      <h2 style={{ marginBottom: '2rem' }}>My Assets</h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '2rem'
      }}>
        {assets.map(asset => (
          <div
            data-testid="asset-card"
            key={asset.tokenId}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1.5rem',
              backgroundColor: '#fff'
            }}
          >
            {asset.error ? (
              <div style={{ color: 'red' }}>
                {asset.error}
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <h3 style={{ marginBottom: '1rem' }}>{asset.name}</h3>
                  <button data-testid='button-trash' onClick={() => { handleDeleteRWA(asset) }} style={{ border: "none", backgroundColor: "white", cursor: "pointer" }}>
                    <FaTrash />
                  </button>
                </div>
                <p style={{
                  color: '#666',
                  marginBottom: '1rem',
                  height: '3em',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {asset.description}
                </p>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.5rem',
                  fontSize: '0.9rem'
                }}>
                  <div>
                    <strong>Location:</strong><br />
                    {asset.properties.location}
                  </div>
                  <div>
                    <strong>Size:</strong><br />
                    {asset.properties.size}
                  </div>
                  <div>
                    <strong>Valuation:</strong><br />
                    {asset.valuation}
                  </div>
                </div>
                <div style={{
                  marginTop: '1rem',
                  padding: '0.5rem',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  wordBreak: 'break-all'
                }}>
                  <strong>Token ID:</strong> {asset.tokenId}
                </div>

                {/* New Create Sell Offer Button */}
                <button
                  onClick={() => setSelectedAsset(asset)}
                  style={{
                    width: '100%',
                    marginTop: '1rem',
                    padding: '0.75rem',
                    backgroundColor: '#000',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Create Sell Offer
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Sell Offer Modal */}
      {selectedAsset && (
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
            <h3 style={{ marginBottom: '1.5rem' }}>Create Sell Offer for {selectedAsset.name}</h3>
            {error && (
              <div style={{
                color: 'red',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleCreateOffer}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Amount (XRP):
                </label>
                <input
                  type="number"
                  value={sellAmount}
                  onChange={(e) => setSellAmount(e.target.value)}
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
                  disabled={isCreatingOffer}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: '#000',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    opacity: isCreatingOffer ? 0.7 : 1
                  }}
                >
                  {isCreatingOffer ? 'Creating...' : 'Create Offer'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAsset(null)
                    setSellAmount('')
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
      {openDeleteModal && <DeleteModal close={() => { closeDeleteModal() }} rwa={selectedDeleteAsset} onSuccess={() => { setUpdateAssets(updateAssets + 1) }} />}
    </div>
  )
}

export default MyAssets