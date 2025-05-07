import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, MessageSquare, Bell, Bookmark, Shield, HelpCircle, Info, Home, LogOut, Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">Dormzy</Link>
        
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/houses">Houses</Link>
          <Link to="/explore">Explore</Link>
        </nav>
        
        <div className="dropdown">
          <div className="dropdown-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </div>
          
          {isMenuOpen && (
            <div className="dropdown-menu">
              {currentUser ? (
                <>
                  <Link to="/profile" className="dropdown-item">
                    <User size={18} />
                    My Profile
                  </Link>
                  <Link to="/messages" className="dropdown-item">
                    <MessageSquare size={18} />
                    Messages
                    <span className="profile-menu-badge">12</span>
                  </Link>
                  <Link to="/notifications" className="dropdown-item">
                    <Bell size={18} />
                    Notifications
                    <span className="profile-menu-badge">2</span>
                  </Link>
                  <Link to="/saved" className="dropdown-item">
                    <Bookmark size={18} />
                    Saved Lists
                  </Link>
                  <div className="dropdown-divider"></div>
                  <Link to="/upload" className="dropdown-item">
                    <Upload size={18} />
                    Upload Listing
                  </Link>
                  <Link to="/contact" className="dropdown-item">
                    <HelpCircle size={18} />
                    Contact Us
                  </Link>
                  <Link to="/about" className="dropdown-item">
                    <Info size={18} />
                    About Us
                  </Link>
                  <Link to="/host" className="dropdown-item">
                    <Home size={18} />
                    Become a Host
                  </Link>
                  <Link to="/help" className="dropdown-item">
                    <HelpCircle size={18} />
                    Help Centre
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item">
                    <LogOut size={18} />
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="dropdown-item">
                    Log In
                  </Link>
                  <Link to="/signup" className="dropdown-item">
                    Sign Up
                  </Link>
                  <div className="dropdown-divider"></div>
                  <Link to="/contact" className="dropdown-item">
                    Contact Us
                  </Link>
                  <Link to="/about" className="dropdown-item">
                    About Us
                  </Link>
                  <Link to="/host" className="dropdown-item">
                    Become a Host
                  </Link>
                  <Link to="/help" className="dropdown-item">
                    Help Centre
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;