import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAddress, isInstalled, mintNFT } from "@gemwallet/api"
import { ip } from '../ip'

const CreateRWA = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    valuation: '',
    location: '',
    size: ''
  })

  const stringToHex = (str) => {
    return Array.from(new TextEncoder().encode(str))
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('')
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const walletResponse = await isInstalled()
      if (!walletResponse.result.isInstalled) {
        setError('GemWallet extension is not installed')
        setIsLoading(false)
        return
      }

      const metadata = {
        name: formData.name,
        description: formData.description,
        properties: {
          valuation: formData.valuation,
          location: formData.location,
          size: formData.size
        }
      }

      const metadataHex = stringToHex(JSON.stringify(metadata))

      const mintPayload = {
        URI: metadataHex,
        flags: {
          tfOnlyXRP: true,
          tfTransferable: true,
          tfBurnable: true
        },
        NFTokenTaxon: 0,
        transferFee: 0,
        memos: [
          {
            memo: {
              memoType: stringToHex('Description'),
              memoData: stringToHex(formData.description)
            }
          }
        ]
      }

      const mintResponse = await mintNFT(mintPayload)
      
      if (mintResponse.type === 'response' && mintResponse.result) {
        const response = await fetch(`${ip}/api/rwa/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            ...formData,
            nftId: mintResponse.result.NFTokenID,
            transactionHash: mintResponse.result.hash
          })
        })

        const data = await response.json()

        if (response.ok) {
          navigate('/myassets')
        } else {
          setError(data.error || 'Creation failed')
        }
      } else {
        setError('NFT minting failed')
      }
    } catch (err) {
      setError(err.message || 'Creation failed')
    } finally {
      setIsLoading(false)
    }
  }

  // Rest of the component remains the same...
  return (
    <div style={{
      maxWidth: '600px',
      margin: '2rem auto',
      padding: '2rem',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      borderRadius: '8px'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create NFT</h2>

      {error && (
        <div style={{
          color: 'red',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Name:
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Description:
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              minHeight: '100px'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Valuation:
          </label>
          <input
            type="number"
            name="valuation"
            value={formData.valuation}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Location:
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Size:
          </label>
          <input
            type="text"
            name="size"
            value={formData.size}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: isLoading ? 0.7 : 1
          }}
        >
          {isLoading ? 'Creating...' : 'Create NFT'}
        </button>
      </form>
    </div>
  )
}

export default CreateRWA