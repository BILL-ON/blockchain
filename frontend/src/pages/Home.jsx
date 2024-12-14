import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()
  return (
<div style={{
      padding: '2rem',
      textAlign: 'center',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        marginBottom: '1rem'
      }}>
        Welcome to NFT Marketplace
      </h1>
      <p style={{
        fontSize: '1.2rem',
        color: '#666',
        marginBottom: '2rem'
      }}>
        Discover, create, and trade unique digital assets on the XRP Ledger
      </p>
      
      <div style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center'
      }}>
        <button onClick={() => {navigate('/Faq')}} style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Explore
        </button>
        <button onClick={() => {navigate('/register')}}  style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#fff',
          color: '#000',
          border: '1px solid #000',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Create
        </button>
      </div>
    </div>
  )
}
