import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://127.0.0.1:5000/api/posts', 
                { title, content },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <form className="card" onSubmit={handleSubmit}>
                <h2 style={{marginTop: 0}}>Share Your Story</h2>
                
                {error && <div className="error-msg">{error}</div>}

                <div className="form-group">
                    <label className="label">Title</label>
                    <input 
                        className="input" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label className="label">Content</label>
                    <textarea 
                        className="input" 
                        style={{minHeight: '200px'}} 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                        required 
                        disabled={loading}
                    />
                </div>

                <button className="btn btn-primary" type="submit" disabled={loading}>
                    {loading ? 'Publishing...' : 'Publish Post'}
                </button>
            </form>
        </div>
    );
}

export default CreatePost;
