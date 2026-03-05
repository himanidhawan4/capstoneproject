import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ isLoggedIn, setIsLoggedIn, theme, toggleTheme }) {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    const onLogoutClick = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            localStorage.clear(); 
            setIsLoggedIn(false); 
            navigate('/login');
        }
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">🚀 CommunityBlog</Link>
                
                <div className="nav-links">
                    <Link to="/" className="nav-item">Feed</Link>
                    <Link to="/about" className="nav-item">About</Link>

                    {isLoggedIn ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {/* Avatar Icon */}
                            <div className="nav-avatar">
                                {username ? username.charAt(0).toUpperCase() : 'U'}
                            </div>
                            
                            <span className="nav-greeting">Hi, {username || 'User'}</span>
                            
                            <Link to="/create-post" className="nav-item">Write</Link>
                            <Link to="/profile" className="nav-item">Profile</Link>
                            
                            <button onClick={onLogoutClick} className="btn-logout">
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="nav-item">Login</Link>
                            <Link to="/register" className="btn btn-primary" style={{ borderRadius: '20px', padding: '6px 16px' }}>
                                Join Free
                            </Link>
                        </>
                    )}

                    <button onClick={toggleTheme} className="theme-toggle" title="Toggle Mode">
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
