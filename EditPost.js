import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`http://127.0.0.1:5000/api/posts/${id}`);
                setTitle(res.data.title);
                setContent(res.data.content);
                setLoading(false);
            } catch (err) {
                console.error("Primary fetch failed, trying fallback...", err);
                // Fallback: search within the full posts list
                try {
                    const res = await axios.get(`http://127.0.0.1:5000/api/posts`);
                    const targetPost = res.data.find(p => p._id === id);
                    if (targetPost) {
                        setTitle(targetPost.title);
                        setContent(targetPost.content);
                        setLoading(false);
                    } else {
                        throw new Error("Not found");
                    }
                } catch (innerErr) {
                    alert("Post not found.");
                    navigate('/');
                }
            }
        };
        fetchPost();
    }, [id, navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        // Client-side Validation
        if (title.trim().length < 3) {
            setError("Title must be at least 3 characters long.");
            return;
        }

        setIsSaving(true);
        setError('');
        const token = localStorage.getItem('token');
        
        try {
            await axios.put(`http://127.0.0.1:5000/api/posts/${id}`, 
                { title, content },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate('/profile'); // Redirecting to profile often feels more natural after an edit
        } catch (error) {
            setError(error.response?.data?.message || "Failed to update post.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="loading-state">Retrieving post data...</div>;

    return (
        <div className="container">
            <div className="card">
                <h2 style={{ textAlign: 'center', marginTop: 0 }}>Edit Your Post</h2>
                
                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleUpdate}>
                    <div className="form-group">
                        <label className="label">Post Title</label>
                        <input
                            className="input"
                            type="text"
                            value={title}
                            placeholder="Title"
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            disabled={isSaving}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="label">Story Content</label>
                        <textarea
                            className="input"
                            style={{ height: '200px', resize: 'vertical' }}
                            value={content}
                            placeholder="Content"
                            onChange={(e) => setContent(e.target.value)}
                            required
                            disabled={isSaving}
                        ></textarea>
                        <div style={{ textAlign: 'right', fontSize: '12px', opacity: 0.6, marginTop: '5px' }}>
                            Characters: {content.length}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving Changes...' : 'Update Post'}
                    </button>
                    
                    <button
                        type="button"
                        className="btn btn-outline"
                        style={{ width: '100%', marginTop: '10px' }}
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditPost;
