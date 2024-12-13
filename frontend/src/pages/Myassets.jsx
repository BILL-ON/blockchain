// src/pages/MyAssets.jsx
import { useState, useEffect } from 'react'

const MyAssets = () => {
  const [assets, setAssets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAssets()
  }, [])

  const fetchAssets = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/rwa/my-assets', {
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

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        Loading your assets...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '2rem',
        color: 'red' 
      }}>
        {error}
      </div>
    )
  }

  if (assets.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '2rem',
        color: '#666' 
      }}>
        You don't have any assets yet
      </div>
    )
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
                <h3 style={{ marginBottom: '1rem' }}>{asset.name}</h3>
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
                    <strong>Location:</strong><br/>
                    {asset.properties.location}
                  </div>
                  <div>
                    <strong>Size:</strong><br/>
                    {asset.properties.size}
                  </div>
                  <div>
                    <strong>Valuation:</strong><br/>
                    {asset.valuation}
                  </div>
                  <div>
                    <strong>Created:</strong><br/>
                    {new Date(asset.createdAt).toLocaleDateString()}
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
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAssets