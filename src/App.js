import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from './Home';
import Comparison from './Comparison';

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="navbar">
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/comparison">Comparison</Link>
          </nav>
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

