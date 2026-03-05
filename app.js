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
import PostDetails from './PostDetails.js';

//  Protected Route Helper Component
const ProtectedRoute = ({ isLoggedIn, children }) => {
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const navigate = useNavigate();

    useEffect(() => {
        // Sync theme with the HTML body for CSS variables to work
        document.body.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            localStorage.clear(); // Clears token, userId, and username
            setIsLoggedIn(false);
            navigate('/login');
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
                    {/* Public Routes - Anyone can see these */}
                    <Route path="/" element={<PostList />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                    <Route path="/register" element={<Register />} />

                    {/* Add this here so people can read the full story without logging in */}
                    <Route path="/post/:id" element={<PostDetails />} />

                    {/* Protected Routes - Only for logged-in users */}
                    <Route path="/edit-post/:id" element={
                        <ProtectedRoute isLoggedIn={isLoggedIn}><EditPost /></ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                        <ProtectedRoute isLoggedIn={isLoggedIn}><Profile /></ProtectedRoute>
                    } />
                    <Route path="/create-post" element={
                        <ProtectedRoute isLoggedIn={isLoggedIn}><CreatePost /></ProtectedRoute>
                    } />

                    {/* 404 Route - Keep this at the VERY bottom */}
                    <Route path="*" element={<NotFound />} />
                </Routes>

            </div>
        </>
    );
}

export default App;
