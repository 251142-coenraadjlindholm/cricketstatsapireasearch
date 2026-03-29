import React from 'react';
import { Link } from "react-router-dom";
import './App.css'; // Reuse app styles

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
<img src="/CricketLogo.png" alt="Cricket Hub Logo" className="footer-logo" />
          <span className="footer-name">Cricket Stats</span>
        </div>

        <nav className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/comparison">Comparison</Link>
          <Link to="/timeline">Timeline</Link>
        </nav>
        
        <div className="footer-info">
          <p>Built by <span className="Student-Name">[Coenraad Lindholm 251142]</span></p>
          <p>Powered by Cricbuzz API</p>
          <p>&copy; 2026 Cricket Stats Dashboard. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

