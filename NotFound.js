import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotFound() {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: 'center', marginTop: '100px', padding: '20px' }}>
            <h1 style={{ fontSize: '72px', color: '#ff4d4d' }}>404</h1>
            <h2>Oops! Page Not Found</h2>
            <p style={{ color: '#888', marginBottom: '30px' }}>
                The story you are looking for doesn't exist or has been moved.
            </p>
            <button 
                onClick={() => navigate('/')} 
                style={{
                    padding: '12px 24px',
                    borderRadius: '30px',
                    border: 'none',
                    backgroundColor: '#007bff',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                }}
            >
                Return to Home
            </button>
        </div>
    );
}

export default NotFound;