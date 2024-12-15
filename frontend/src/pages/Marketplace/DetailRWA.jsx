import React from 'react'
import ListSellOffer from './ListSellOffer'

export default function DetailRWA({ closePage, tokenId }) {
  return (
    <div style={{margin: "100px"}}>
      <button
        onClick={() => { closePage() }}
        style={{
          width: '20%',
          padding: '0.75rem',
          backgroundColor: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '1rem',
          marginBottom: "20px"
        }}
      >
        Back
      </button>
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", flexDirection: "row"}}>
        <div>
        <h2>Sell Offers</h2>
        <ListSellOffer tokenId={tokenId} />
        </div>
        <div>
        <h2>Buy Offers</h2>
        </div>
      </div>
    </div>
  )
}
