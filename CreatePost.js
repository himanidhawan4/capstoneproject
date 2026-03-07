import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState(''); 
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (title.trim().length < 5) return setError("Title must be at least 5 characters.");
        if (content.trim().length < 20) return setError("Content must be at least 20 characters.");

        setLoading(true);
        try {
            await axios.post('http://127.0.0.1:5000/api/posts', 
                { title, content },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            navigate('/'); 
        } catch (err) {
            setError(err.response?.data?.message || "Failed to publish.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="card" style={{ maxWidth: '600px', margin: '40px auto', padding: '30px' }}>
                <h2>Create New Post</h2>
                {error && <div style={{ color: '#721c24', background: '#f8d7da', padding: '10px', marginBottom: '15px' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <input className="input" placeholder="Title (min 5 chars)" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    <textarea className="input" placeholder="Content (min 20 chars)" style={{ minHeight: '200px', marginTop: '15px' }} value={content} onChange={(e) => setContent(e.target.value)} required />
                    <button className="btn btn-primary" disabled={loading} style={{ marginTop: '20px', width: '100%' }}>
                        {loading ? "Publishing..." : "Publish Post"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreatePost;
