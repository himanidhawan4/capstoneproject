import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [strength, setStrength] = useState({ label: '', color: '#ccc', width: '0%' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePasswordChange = (val) => {
    setFormData({...formData, password: val});
    let s = 0;
    if (val.length > 7) s++;
    if (/[0-9]/.test(val)) s++;
    if (/[A-Z]/.test(val)) s++;
    if (/[!@#$%]/.test(val)) s++;

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
    try {
      await axios.post('http://127.0.0.1:5000/api/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container" style={{maxWidth: '450px'}}>
      <form className="card" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        {error && <div className="error-msg">{error}</div>}
        <input className="input" placeholder="Username" onChange={e => setFormData({...formData, username: e.target.value})} required />
        <input className="input" type="email" placeholder="Email" style={{marginTop: '15px'}} onChange={e => setFormData({...formData, email: e.target.value})} required />
        <input className="input" type="password" placeholder="Password" style={{marginTop: '15px'}} onChange={e => handlePasswordChange(e.target.value)} required />
        
        <div style={{height: '6px', background: '#eee', borderRadius: '3px', marginTop: '10px', overflow: 'hidden'}}>
          <div style={{width: strength.width, background: strength.color, height: '100%', transition: '0.3s'}} />
        </div>
        <small>Strength: {strength.label}</small>

        <button className="btn btn-primary" style={{width: '100%', marginTop: '20px'}} type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
