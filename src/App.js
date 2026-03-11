import logo from './LogoCricket.png';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from './Home';
import Comparison from './Comparison';
import React from 'react';

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="navbar">
          <nav className="nav-links" aria-label="Main navigation">
            <Link to="/">Home</Link>
            <Link to="/comparison">Comparison</Link>
          </nav>
          <div className="brand-logo">
            <img src={logo} className="logo" alt="Cricket Stats logo" />
            <span>CS | Cricket Hub</span>
          </div>
        </header>

        <main className="page-frame">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/comparison" element={<Comparison />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
