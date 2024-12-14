// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MySellOffers from './pages/MySellOffers';
import Myassets from './pages/Myassets/Myassets';
import NFTDetails from './pages/NFTDetails';
import CreateRWA from './pages/CreateRWA';
import Login from './components/Login';
import Register from './components/Register';
import TokenSearch from './pages/TokenSearch';
import Faq from './pages/Faq'

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/my-sell-offers" element={<MySellOffers />} />
          <Route path="/myassets" element={<Myassets />} />
          <Route path="/nft/:id" element={<NFTDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/createRWA" element={<CreateRWA />} />
          <Route path="/TokenSearch" element={<TokenSearch />} />
          <Route path="/Faq" element={<Faq />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;