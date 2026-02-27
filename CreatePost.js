import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // Added for UX
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); 
        setIsSubmitting(true); // Disable button during request
        
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/auth/login', { email, password });

            if (response.data.token) {
                // Requirement 2.a.iv: Persistence
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userId', response.data.user.id); 
                
                // Requirement 1.g: State Synchronization
                setIsLoggedIn(true); 
                
                alert('Login Successful!'); 
                navigate('/'); 
            }
        } catch (error) {
            // Requirement 3.e.ii: Clear Error Feedback
            const message = error.response?.data?.message || "Server unreachable.";
            alert('Login Failed: ' + message);
        } finally {
            setIsSubmitting(false); // Re-enable button
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