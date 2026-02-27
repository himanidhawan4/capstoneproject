import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
// Requirement 1.g: Protected Route Helper Component
const ProtectedRoute = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    // Requirement 2.a.iv: Authentication State Persistence
    setIsLoggedIn(!!localStorage.getItem('token'));
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleLogout = () => {
    // Requirement 2.b.v: Confirmation prompt
    if (window.confirm("Are you sure you want to log out?")) {
      // Requirement 2.a.iii: Secure logout
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      setIsLoggedIn(false); 
      window.location.href = "/"; 
    }
  };

  return (
    <Router>
      <Navbar 
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={setIsLoggedIn} 
        handleLogout={handleLogout} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />
      <div className="container">
        <Routes>
          {/* Requirement 2.b.ii: View All Posts */}
          <Route path="/" element={<PostList />} />
          <Route path="/about" element={<About />} />
          
          {/* Requirement 2.a: Authentication Routes */}
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register />} />
          
          
          <Route path="/edit-post/:id" element={<EditPost />} />
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
 
          <Route path="*" element={<NotFound />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;