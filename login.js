import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const res = await axios.post('http://127.0.0.1:5000/api/auth/login', { email, password });
            
            if (res.data.token) {
                // Persistent Session Storage
                localStorage.setItem('token', res.data.token);
                
                // Handling different backend response structures safely
                const userData = res.data.user || res.data;
                localStorage.setItem('userId', userData.id || userData._id);
                localStorage.setItem('username', userData.username);
                
                setIsLoggedIn(true);
                navigate('/'); 
            }
        } catch (err) {
            setError(err.response?.data?.message || "Invalid email or password.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '400px' }}>
            <form className="card" onSubmit={handleLogin}>
                <h2 style={{ textAlign: 'center', marginTop: 0 }}>Welcome Back</h2>

                {error && <div className="error-msg" style={{color: 'var(--error-red)', textAlign: 'center', marginBottom: '10px'}}>{error}</div>}

                <div className="form-group">
                    <label className="label">Email Address</label>
                    <input
                        className="input"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group" style={{ position: 'relative' }}>
                    <label className="label">Password</label>
                    <input
                        className="input"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={eyeToggleStyle}
                    >
                        {showPassword ? '🙈' : '👁️'}
                    </button>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '10px' }}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Verifying...' : 'Sign In'}
                </button>

                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
                    Don't have an account? <span 
                        onClick={() => navigate('/register')} 
                        style={{ color: 'var(--primary-blue)', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Register here
                    </span>
                </p>
            </form>
        </div>
    );
}

const eyeToggleStyle = {
    position: 'absolute',
    right: '10px',
    top: '38px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px'
};

export default Login;
