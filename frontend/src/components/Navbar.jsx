// src/components/common/Navbar.jsx
import { Link } from 'react-router-dom';

function Navbar() {
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
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/register" style={{ textDecoration: 'none', color: 'black' }}>
          Register
        </Link>
        <Link to="/login" style={{ textDecoration: 'none', color: 'black' }}>
          Login
        </Link>
        <Link to="/createRWA" style={{ textDecoration: 'none', color: 'black' }}>
          Create RWA
        </Link>
        <Link to="/myassets" style={{ textDecoration: 'none', color: 'black' }}>
          My assets
        </Link>
        <Link to="/my-sell-offers" style={{ textDecoration: 'none', color: 'black' }}>
          My sell-offers
        </Link>
        <Link to="/TokenSearch" style={{ textDecoration: 'none', color: 'black' }}>
          Search token
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;