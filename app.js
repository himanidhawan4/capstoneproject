import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css'; 
import Navbar from './Components/Navbar.js';
import Login from './login.js';
import Register from './Register.js';
import CreatePost from './CreatePost.js';
import PostList from './PostList.js';
import About from './About.js';
import EditPost from './EditPost.js';
import NotFound from './Components/NotFound.js';
import Profile from './Profile.js';

//   Protected Route Helper Component
const ProtectedRoute = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const navigate = useNavigate(); // Added for SPA navigation

  useEffect(() => {
    //   Authentication State Persistence
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleLogout = () => {
    // Requirement 2.b.v: Defensive UI Confirmation
    if (window.confirm("Are you sure you want to log out?")) {
      // Requirement 2.a.iii: Secure token removal
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      setIsLoggedIn(false); 
      
      // Navigate to Home instantly without a page reload
      navigate('/'); 
    }
  };

  return (
    <>
      
      <Navbar 
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={setIsLoggedIn} 
        handleLogout={handleLogout} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />
      
      <div className="container">
        <Routes>
          {/* Requirement 2.b.ii: Public Community Feed */}
          <Route path="/" element={<PostList />} />
          <Route path="/about" element={<About />} />
          
          {/* Requirement 2.a: Authentication Routes */}
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register />} />
          
          {/* Requirement 2.b.iii: Edit Route (Requires ID) */}
          <Route path="/edit-post/:id" element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
                <EditPost />
            </ProtectedRoute>
          } />
 
          <Route
            path="/profile"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Profile />
              </ProtectedRoute>
            }
          />
 
          <Route 
            path="/create-post" 
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <CreatePost />
              </ProtectedRoute>
            } 
          />
 
          {/* Requirement 4.e: 404 Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
