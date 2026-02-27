import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Added setIsLoggedIn to props to sync state with App.js
function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); 
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/auth/login', { email, password });

            // Ensure the backend sends both token and user object
            if (response.data.token) {
                // Requirement 2.a.iv: Persistent Auth State
                localStorage.setItem('token', response.data.token);
                // Saving userId here allows us to check post ownership in PostList
                localStorage.setItem('userId', response.data.user.id); 
                
                // Update global state instantly so Navbar shows "Sign Out"
                setIsLoggedIn(true); 
                
                alert('Login Successful!'); // Requirement 3.e.i
                
                // Navigate to home without a page reload
                navigate('/'); 
            }
        } catch (error) {
            // Requirement 3.e.ii: Clear error feedback
            const message = error.response?.data?.message || "Server unreachable.";
            alert('Login Failed: ' + message);
        }
    };

    return (
        <div style={containerStyle}>
            <form onSubmit={handleLogin} style={formStyle}>
                <h2 style={{ color: 'var(--text-color)', marginBottom: '20px', textAlign: 'center' }}>Welcome Back</h2>
                
                <input 
                    type="email" 
                    placeholder="Email Address" 
                    style={inputStyle} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    style={inputStyle} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                
                <button type="submit" style={buttonStyle}>Login</button>
            </form>
        </div>
    );
}

// Styling 
const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' };
const formStyle = { backgroundColor: 'var(--card-bg)', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', width: '100%', maxWidth: '400px' };
const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '5px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', boxSizing: 'border-box' };
const buttonStyle = { width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };

export default Login;