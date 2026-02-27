import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:5000/api/auth/register', { 
        username, 
        email, 
        password 
      });
      alert('Registration Successful! Please login.');
      navigate('/login');
    } catch (error) {
      alert('Registration Failed: ' + (error.response?.data?.message || "Error"));
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleRegister} style={formCardStyle}>
        <h2 style={{ color: 'var(--text-color)', marginBottom: '20px' }}>Create Account</h2>
        
        <input 
          type="text" 
          placeholder="Username" 
          style={inputStyle} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
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
        
        <button type="submit" style={buttonStyle}>Register</button>
      </form>
    </div>
  );
}

// Shared Component Styles for consistency
const containerStyle = {
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  minHeight: '75vh' 
};

const formCardStyle = {
  backgroundColor: 'var(--card-bg)', 
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
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-color)',
  color: 'var(--text-color)',
  boxSizing: 'border-box' // Prevents input from overflowing the card
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold',
  marginTop: '10px'
};

export default Register;