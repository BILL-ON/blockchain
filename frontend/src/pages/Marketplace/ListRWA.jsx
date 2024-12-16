import { useState, useEffect } from 'react';
import { ip } from '../../ip';
import DetailRWA from './DetailRWA';

const RWACardList = () => {
  const [rwas, setRwas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openPageDetails, setOpenPageDetails] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [updateRWAs, setUpdateRWAs] = useState(0);

  useEffect(() => {
    fetchRWAs();
  }, [updateRWAs]);

  const fetchRWAs = async () => {
    try {
      const response = await fetch(`${ip}/api/rwa/all`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.status === 200) {
        const data = await response.json();
        setRwas(data);
      }

    } catch (error) {
      setRwas([]);
      alert('Failed to fetch RWAs');
    } finally {
      setLoading(false);
    }
  };

  function handleOpenPageDetails(newSelectedAsset) {
    console.log(newSelectedAsset)
    setSelectedAsset(newSelectedAsset)
    setOpenPageDetails(true)
  };

  function handleClosePageDetails() {
    setOpenPageDetails(false)
    setUpdateRWAs(updateRWAs + 1)
  }

  if (loading) {
    return (
      <div style={{
        maxWidth: '800px',
        margin: '2rem auto',
        padding: '0 1rem',
        textAlign: 'center'
      }}>
        Loading...
      </div>
    );
  }
  return (
    <>
      {
        openPageDetails ? 
          <DetailRWA closePage={() => {handleClosePageDetails()}} asset={selectedAsset} /> 
        :
          <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
            <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Available RWAs</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              {rwas && rwas.map((rwa) => (
                <div
                  key={rwa.tokenId}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  <h3 style={{
                    marginBottom: '1rem',
                    fontSize: '1.25rem',
                    fontWeight: 'bold'
                  }}>
                    {rwa.name}
                  </h3>

                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Description:</strong>
                    <p style={{ marginTop: '0.25rem' }}>{rwa.description}</p>
                  </div>

                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Valuation:</strong>
                    <p style={{ marginTop: '0.25rem' }}>{rwa.valuation} XRP</p>
                  </div>

                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Location:</strong>
                    <p style={{ marginTop: '0.25rem' }}>{rwa.properties.location}</p>
                  </div>

                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Size:</strong>
                    <p style={{ marginTop: '0.25rem' }}>{rwa.properties.size}</p>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Owner:</strong>
                    <p style={{
                      marginTop: '0.25rem',
                      fontSize: '0.875rem',
                      wordBreak: 'break-all'
                    }}>
                      {rwa.walletAddress}
                    </p>
                  </div>

                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Token ID:</strong>
                    <p style={{
                      marginTop: '0.25rem',
                      fontSize: '0.875rem',
                      wordBreak: 'break-all'
                    }}>
                      {rwa.tokenId}
                    </p>
                  </div>
                  <button
                    onClick={() => { handleOpenPageDetails(rwa) }}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#000',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginTop: '1rem'
                    }}
                  >
                    View details
                  </button>
                </div>
              ))}
            </div>
          </div>
      }
    </>
  );
};

export default RWACardList;