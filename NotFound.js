import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="container" style={{ textAlign: 'center', marginTop: '80px' }}>
            {/* Using a bright red for the error code to signal an issue */}
            <h1 style={errorCodeStyle}>404</h1>
            
            <h2 style={{ marginBottom: '10px' }}>
                Oops! Page Not Found
            </h2>
            
            <p style={{ opacity: 0.7, marginBottom: '30px', maxWidth: '400px', marginInline: 'auto' }}>
                The story you are looking for doesn't exist or has been moved.
            </p>
            
            <button 
                className="btn btn-primary"
                onClick={() => navigate('/')} 
                style={{ paddingInline: '40px', borderRadius: '30px' }}
            >
                Return to Home
            </button>
        </div>
    );
}

// Minimal specific style for the 404 text
const errorCodeStyle = { 
    fontSize: 'clamp(80px, 15vw, 120px)', 
    fontWeight: '800',
    color: 'var(--error-red)', 
    margin: '0',
    lineHeight: '1'
};

export default NotFound;
