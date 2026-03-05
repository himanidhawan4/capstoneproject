import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Define styles BEFORE the component to avoid ReferenceErrors
const containerStyle = { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '70vh' 
};

const formStyle = { 
    backgroundColor: 'var(--card-bg, #ffffff)', 
    padding: '40px', 
    borderRadius: '10px', 
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)', 
    width: '100%', 
    maxWidth: '400px' 
};

const inputStyle = { 
    width: '100%', 
    padding: '12px', 
    marginBottom: '15px', 
    borderRadius: '5px', 
    border: '1px solid var(--border-color, #ccc)', 
    backgroundColor: 'var(--bg-color, #fff)', 
    color: 'var(--text-color, #333)', 
    boxSizing: 'border-box' 
};

const buttonStyle = { 
    width: '100%', 
    padding: '12px', 
    backgroundColor: '#007bff', 
    color: 'white', 
    border: 'none', 
    borderRadius: '5px', 
    cursor: 'pointer', 
    fontWeight: 'bold' 
};

function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); 
        setIsSubmitting(true); 
        
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/auth/login', { email, password });

            if (response.data.token) {
               
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userId', response.data.user.id); 
                
                // Requirement 1.g: State Synchronization
                setIsLoggedIn(true); 
                
                alert('Login Successful!'); 
                navigate('/'); 
            }
        } catch (error) {
            //  Clear Error Feedback
            const message = error.response?.data?.message || "Server unreachable.";
            alert('Login Failed: ' + message);
        } finally {
            setIsSubmitting(false); 
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
                    autoComplete="email"
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    style={inputStyle} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    autoComplete="current-password"
                />
                
                <button 
                    type="submit" 
                    style={{...buttonStyle, opacity: isSubmitting ? 0.7 : 1}} 
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}

export default Login;
