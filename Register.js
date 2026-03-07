import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [strength, setStrength] = useState({ label: '', color: '#ccc', width: '0%' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle visibility
  
  const navigate = useNavigate();

  const handlePasswordChange = (val) => {
    setFormData({...formData, password: val});
    let s = 0;
    // Password Strength Logic
    if (val.length > 7) s++;
    if (/[0-9]/.test(val)) s++;
    if (/[A-Z]/.test(val)) s++;
    if (/[!@#$%^&*]/.test(val)) s++;

    const levels = [
      { label: 'Weak', color: '#ff4d4d', width: '25%' },
      { label: 'Fair', color: '#ffa500', width: '50%' },
      { label: 'Good', color: '#f1c40f', width: '75%' },
      { label: 'Strong', color: '#2ecc71', width: '100%' }
    ];
    setStrength(val.length > 0 ? (levels[s-1] || levels[0]) : { label: '', color: '#ccc', width: '0%' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (strength.width !== '100%') {
        return setError("Please provide a Strong password (8+ chars, number, uppercase, and symbol).");
    }

    setLoading(true);
    setError('');

    try {
      await axios.post('http://127.0.0.1:5000/api/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{maxWidth: '450px', marginTop: '50px'}}>
      <form className="card" onSubmit={handleSubmit}>
        <h2 style={{ textAlign: 'center', marginTop: 0 }}>Create Account</h2>
        
        {/* Error Feedback */}
        {error && (
          <div style={{ color: '#721c24', background: '#f8d7da', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
            {error}
          </div>
        )}
        
        <div className="form-group">
          <label className="label">Username</label>
          <input 
            className="input" 
            placeholder="Username" 
            onChange={e => setFormData({...formData, username: e.target.value})} 
            required 
          />
        </div>

        <div className="form-group">
          <label className="label">Email</label>
          <input 
            className="input" 
            type="email" 
            placeholder="Email" 
            onChange={e => setFormData({...formData, email: e.target.value})} 
            required 
          />
        </div>

        <div className="form-group" style={{ marginBottom: '5px' }}>
          <label className="label">Password</label>
          <div style={{ position: 'relative' }}>
            <input 
              className="input" 
              type={showPassword ? "text" : "password"} // Switches type dynamically
              placeholder="••••••••" 
              onChange={e => handlePasswordChange(e.target.value)} 
              required 
              style={{ paddingRight: '50px' }} // Space for the toggle button
            />
            {/* Show/Hide Toggle Button */}
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--primary-blue)',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.75rem'
              }}
            >
              {showPassword ? "HIDE" : "SHOW"}
            </button>
          </div>
        </div>
        
        {/* Strength Meter Bar */}
        <div style={{height: '6px', background: '#eee', borderRadius: '3px', overflow: 'hidden'}}>
          <div style={{width: strength.width, background: strength.color, height: '100%', transition: '0.3s'}} />
        </div>
        <small style={{ display: 'block', marginBottom: '20px', marginTop: '5px' }}>
            Strength: <span style={{ color: strength.color, fontWeight: 'bold' }}>{strength.label}</span>
        </small>

        {/* Responsive Register Button */}
        <button className="btn btn-primary" style={{width: '100%'}} type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default Register;
