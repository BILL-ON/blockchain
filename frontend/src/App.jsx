// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Myassets from './pages/Myassets';
import NFTDetails from './pages/NFTDetails';
import CreateRWA from './pages/CreateRWA';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/myassets" element={<Myassets />} />
          <Route path="/nft/:id" element={<NFTDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/createRWA" element={<CreateRWA />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;