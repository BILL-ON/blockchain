import React from 'react'
import ListSellOffer from './ListSellOffer'
import ListBuyOffer from './ListBuyOffer'
import { useState, useEffect } from 'react';
import ModalNewBuyOffer from './ModalNewBuyOffer';

export default function DetailRWA({ closePage, asset }) {
  const [openModalNewBuyOffer , setOpenModalNewBuyOffer] = useState(false)
  const [updateBuyList , setUpdateBuyList] = useState(0)

  function closeModal() {
    setOpenModalNewBuyOffer(false)
    setUpdateBuyList(updateBuyList + 1)
  }

  return (
    <div style={{margin: "100px"}}>
      <button
        onClick={() => { closePage() }}
        style={{
          width: '100px',
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
        <ListSellOffer closePage={() => {closePage()}} tokenId={asset.tokenId} />
        </div>
        <div>
        <div style={{display: 'flex', gap: '20px'}}>
          <h2>Buy Offers</h2>
          <button onClick={() => {setOpenModalNewBuyOffer(true)}} style={{
          width: '140px',
          padding: '0.75rem',
          backgroundColor: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '1rem',
          marginBottom: "20px"
          }}>Add a buy offer</button>
        </div>
        <ListBuyOffer closePage={() => {closePage()}} tokenId={asset.tokenId} updateBuyList={updateBuyList} />
        </div>
      </div>

      { openModalNewBuyOffer && <ModalNewBuyOffer onClose={() => {closeModal()}} tokenId={asset.tokenId} owner={asset.walletAddress} />}
      
    </div>
  )
}
