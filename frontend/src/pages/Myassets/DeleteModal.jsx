import { useState } from 'react';
import { ip } from '../../ip';
import { isInstalled, burnNFT } from "@gemwallet/api"
import { stringToHex } from '../../utils/StringToHex'

const DeleteRWAModal = ({ rwa, close, onSuccess }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async (e) => {
    e.preventDefault();
    setIsDeleting(true);
    setError(null);

    const walletResponse = await isInstalled()

    if (!walletResponse.result.isInstalled) {
      setError('GemWallet extension is not installed')
      setIsDeleting(false)
      return
    }

    const burnPayload = {
      NFTokenID: rwa.tokenId,
      fee: "20",
      memos: [
        {
          memo: {
            memoType: stringToHex("Delete"),
            memoData: stringToHex("RWA NFT Deletion")
          }
        }
      ]
    }

    const burnResponse = await burnNFT(burnPayload)

    try {
      const response = await fetch(`${ip}/api/rwa/delete-rwa`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          tokenId: rwa.tokenId
        })
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess();
        close();
      } else {
        throw new Error(data.error || 'Failed to delete RWA');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
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
        <h3 style={{ marginBottom: '1.5rem', color: 'black' }}>Delete RWA: {rwa.name}</h3>

        {error && (
          <div style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            backgroundColor: '#ffebee',
            color: '#c62828',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleDelete}>
          <div style={{ marginBottom: '1rem' }}>
            <p style={{
              marginBottom: '1rem',
              color: '#666'
            }}>
              Are you sure you want to delete this RWA? This action cannot be undone.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              disabled={isDeleting}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: '#dc3545',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                opacity: isDeleting ? 0.7 : 1
              }}
            >
              {isDeleting ? 'Deleting...' : 'Delete RWA'}
            </button>
            <button
              type="button"
              onClick={() => { close() }}
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
  );
};

export default DeleteRWAModal;