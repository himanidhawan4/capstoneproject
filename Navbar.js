// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ isLoggedIn, setIsLoggedIn, theme, toggleTheme }) {
  const navigate = useNavigate();

  // Integrated Logout Logic (Requirement 2.a / 3.e.i)
  const onLogoutClick = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      setIsLoggedIn(false); // Update state so UI reacts immediately
      alert("Logged out successfully!");
      navigate('/login');
    }
  };

  return (
    <nav style={{ 
      padding: '15px', 
      backgroundColor: 'var(--nav-bg)', 
      display: 'flex', 
      gap: '15px',
      borderBottom: '1px solid var(--border-color)',
      alignItems: 'center'
    }}>
      
      <Link to="/" style={{ color: 'var(--text-color)', textDecoration: 'none', fontWeight: 'bold' }}>Home</Link>
      <Link to="/about" style={{ color: 'var(--text-color)', textDecoration: 'none' }}>About</Link>

      {!isLoggedIn ? (
        <>
          <Link to="/register" style={{ color: 'var(--text-color)', textDecoration: 'none' }}>Sign Up</Link>
          <Link to="/login" style={{ color: 'var(--text-color)', textDecoration: 'none' }}>Login</Link>
        </>
      ) : (
        <>
          <Link to="/create-post" style={{ color: 'var(--text-color)', textDecoration: 'none' }}>Write Post</Link>
          <Link to="/profile" style={{ color: 'var(--text-color)', textDecoration: 'none' }}>Profile</Link>
          <button 
            onClick={onLogoutClick} 
            style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
          >
            Sign Out
          </button>
        </>
      )}

      <button onClick={toggleTheme} style={{ marginLeft: 'auto', cursor: 'pointer', background: 'none', border: 'none', fontSize: '20px' }}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </nav>
  );
}

export default Navbar;