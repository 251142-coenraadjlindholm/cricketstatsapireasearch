import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from './Home';
import Comparison from './Comparison';
import Timeline from './Timeline';
import Footer from './Footer';
//Vra oor Logo
//Hoof komponent wat die navigasie en routing hanteer tussen die Home en Comparison bladsye.
function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="navbar">
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/comparison">Comparison</Link>
            <Link to="/timeline">Timeline</Link>
          </nav>
          <div className="navbar-center">
            <img src="/CricketLogo.png" alt="Cricket Logo" className="navbar-logo" />
          </div>
        </header>

        <main className="page-frame">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/comparison" element={<Comparison />} />
            <Route path="/timeline" element={<Timeline />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

