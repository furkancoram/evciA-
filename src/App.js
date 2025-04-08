// App.js - Sekmeli Yapı
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import EvciAI from './SohbetEkrani';
import HomePage from './HomePage';

const App = () => {
  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sol Menü */}
        <nav style={{ width: '220px', backgroundColor: '#111', color: '#fff', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ color: '#0d6efd' }}>EvciAI</h2>
          <Link to="/" style={navStyle}>🏠 Anasayfa</Link>
          <Link to="/explore" style={navStyle}>🔍 Keşfet</Link>
          <Link to="/notifications" style={navStyle}>🔔 Bildirimler</Link>
          <Link to="/messages" style={navStyle}>💬 Mesajlar</Link>
          <Link to="/chat" style={navStyle}>🤖 Sohbet</Link>
        </nav>

        {/* Sayfa içeriği */}
        <div style={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<EvciAI />} />
            <Route path="/explore" element={<div style={pageStyle}>Keşfet Sayfası (Yapım Aşamasında)</div>} />
            <Route path="/notifications" element={<div style={pageStyle}>Bildirimler Sayfası (Yapım Aşamasında)</div>} />
            <Route path="/messages" element={<div style={pageStyle}>Mesajlar Sayfası (Yapım Aşamasında)</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

const navStyle = {
  color: '#fff',
  textDecoration: 'none',
  fontSize: '16px'
};

const pageStyle = {
  padding: '40px',
  fontSize: '24px'
};

export default App;
