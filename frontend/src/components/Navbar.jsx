import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
            <Link to="/register" style={{ textDecoration: 'none', color: 'black' }}>
              Register
            </Link>
            <Link to="/login" style={{ textDecoration: 'none', color: 'black' }}>
              Login
            </Link>
            <Link to="/Faq" style={{ textDecoration: 'none', color: 'black' }}>
              FAQ
            </Link>
            <button onClick={() => {
              const vuri = import.meta.env;
              console.log(`VITE IP : ${JSON.stringify(vuri)}`);
            }}>GIB URI</button>
          </>
        ) : (
          // Links for authenticated users
          <>
            <Link to="/createRWA" style={{ textDecoration: 'none', color: 'black' }}>
              Create RWA
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
            <button onClick={() => {
              const vuri = import.meta.env.VITE_IP_BACK;
              console.log(`VITE IP : ${vuri}`);
            }}>GIB URI</button>

          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;