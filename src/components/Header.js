import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/dashboard" className="logo">
            <span className="logo-icon">🚛</span>
            FleetLink
          </Link>
          
          <nav className="nav">
            <Link 
              to="/dashboard" 
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/add-vehicle" 
              className={`nav-link ${isActive('/add-vehicle') ? 'active' : ''}`}
            >
              Add Vehicle
            </Link>
            <Link 
              to="/search-book" 
              className={`nav-link ${isActive('/search-book') ? 'active' : ''}`}
            >
              Search & Book
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
