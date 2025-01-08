import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import xrp from '../assets/xrp.png'
import SmallWalletBalance from './getBalanceSmall';

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    // Check for token on component mount and token changes
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    checkAuth();
    window.addEventListener('auth-change', checkAuth);
    return () => {
      window.removeEventListener('auth-change', checkAuth);
    };
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    // Optionally redirect to login page
    window.location.href = '/login';
  };

  return (
    <nav style={{
      padding: '1rem',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #eaeaea',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'black', fontWeight: 'bold' }}>
        NFT Marketplace
      </Link>
      
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {!isAuthenticated ? (
          // Links for non-authenticated users
          <>
            <Link to="/login" style={{ textDecoration: 'none', color: 'black' }}>
              Login
            </Link>
            <Link to="/Faq" style={{ textDecoration: 'none', color: 'black' }}>
              FAQ
            </Link>
          </>
        ) : (
          // Links for authenticated users
          <>
            <div style={{ display: "flex", textAlign: 'center', alignItems: 'center', gap: "8px", padding: "8px", borderRadius: "16px", borderWidth: '1px', borderColor: "#000000", borderStyle: 'solid', fontSize: "24px" }}>
              <SmallWalletBalance/>
              <img src={xrp} height={20} width={20}/>
            </div>
            <Link to="/createRWA" style={{ textDecoration: 'none', color: 'black' }}>
              Create RWA
            </Link>
            <Link to="/Profile" style={{ textDecoration: 'none', color: 'black' }}>
              My Profile
            </Link>
            <Link to="/myassets" style={{ textDecoration: 'none', color: 'black' }}>
              My Assets
            </Link>
            <Link to="/my-sell-offers" style={{ textDecoration: 'none', color: 'black' }}>
              My Sell Offers
            </Link>
            <Link to="/Dashboard" style={{ textDecoration: 'none', color: 'black' }}>
              Marketplace
            </Link>
            <Link to="/Faq" style={{ textDecoration: 'none', color: 'black' }}>
              FAQ
            </Link>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#ff4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;