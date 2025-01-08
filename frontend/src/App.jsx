// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MySellOffers from './pages/MySellOffers';
import Myassets from './pages/Myassets/Myassets';
import NFTDetails from './pages/NFTDetails';
import CreateRWA from './pages/CreateRWA';
import Login from './components/Login';
import Dashboard from './pages/Marketplace/Dashboard';
import Faq from './pages/Faq'
import Footer from './components/Footer';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <div style={{ 
        minHeight: '100vh',
        minWidth: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Navbar />
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/my-sell-offers" element={<MySellOffers />} />
            <Route path="/myassets" element={<Myassets />} />
            <Route path="/nft/:id" element={<NFTDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/createRWA" element={<CreateRWA />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/Faq" element={<Faq />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );

}

export default App;