import React from 'react'

export default function Footer() {
    return (
        <footer style={{
          backgroundColor: '#f8f9fa',
          padding: '2rem 0',
          marginTop: 'auto',
          borderTop: '1px solid #dee2e6'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem',
            padding: '0 1rem'
          }}>
            <div>
              <h4 style={{ marginBottom: '1rem' }}>XRPL RWA Platform</h4>
              <p style={{ color: '#6c757d' }}>Student project for EPITECH Blockchain course - Real World Asset tokenization on XRPL</p>
            </div>
    
            <div>
              <h4 style={{ marginBottom: '1rem' }}>Navigation</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><a href="/marketplace" style={{ color: '#6c757d', textDecoration: 'none' }}>Marketplace</a></li>
                <li><a href="/createRWA" style={{ color: '#6c757d', textDecoration: 'none' }}>Create Asset</a></li>
                <li><a href="/myassets" style={{ color: '#6c757d', textDecoration: 'none' }}>My Assets</a></li>
                <li><a href="/faq" style={{ color: '#6c757d', textDecoration: 'none' }}>FAQ</a></li>
              </ul>
            </div>
    
            <div>
              <h4 style={{ marginBottom: '1rem' }}>Built With</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ color: '#6c757d' }}>XRPL</li>
                <li style={{ color: '#6c757d' }}>React</li>
                <li style={{ color: '#6c757d' }}>Node.js</li>
                <li style={{ color: '#6c757d' }}>Express</li>
              </ul>
            </div>
          </div>
    
          <div style={{
            textAlign: 'center',
            marginTop: '2rem',
            padding: '1rem 0',
            borderTop: '1px solid #dee2e6',
            color: '#6c757d'
          }}>
            <p>© 2024 EPITECH Blockchain Project</p>
          </div>
        </footer>
      );
}
