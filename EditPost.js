import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();

    // State Management
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    
    // Feedback & Responsiveness States (Instructor Requirement)
    const [loading, setLoading] = useState(true);      // Initial data fetch
    const [isUpdating, setIsUpdating] = useState(false); // Submission status
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');

    // 1. Fetch existing post data on mount
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`http://127.0.0.1:5000/api/posts/${id}`);
                setTitle(res.data.title);
                setContent(res.data.content);
            } catch (err) {
                setError("Could not load the post for editing.");
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    // 2. Handle Update with Validation
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (title.trim().length < 5) {
            return setError("Title must be at least 5 characters long.");
        }
        if (content.trim().length < 20) {
            return setError("Content must be at least 20 characters long.");
        }

        setError(''); 
        setIsUpdating(true);  
        try {
            await axios.put(
                `http://127.0.0.1:5000/api/posts/${id}`,
                { title, content },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Redirect back to the specific post after saving
            navigate(`/post/${id}`); 
        } catch (err) {
            // Consistent API Error Handling
            setError(err.response?.data?.message || "Failed to update post. Try again.");
        } finally {
            setIsUpdating(false); // END RESPONSIVENESS
        }
    };

    if (loading) return <div className="container">Loading post data...</div>;

    return (
        <div className="container">
            <div className="card" style={{ maxWidth: '600px', margin: '40px auto', padding: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2>Edit Post</h2>
                    <button onClick={() => navigate(-1)} className="btn-link">Cancel</button>
                </div>

                {/* VISUAL FEEDBACK BOX   */}
                {error && (
                    <div style={{ 
                        color: '#721c24', 
                        background: '#f8d7da', 
                        padding: '12px', 
                        borderRadius: '8px', 
                        marginBottom: '20px',
                        border: '1px solid #f5c6cb' 
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleUpdate}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ fontWeight: 'bold' }}>Title</label>
                        <input
                            className="input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Min 5 characters"
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ fontWeight: 'bold' }}>Content</label>
                        <textarea
                            className="input"
                            style={{ minHeight: '250px' }}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Min 20 characters"
                            required
                        />
                    </div>

                    {/* CHARACTER COUNTER  */}
                    <p style={{ fontSize: '0.8rem', opacity: 0.6, textAlign: 'right', marginBottom: '20px' }}>
                        {content.length} characters
                    </p>

                    {/* ENHANCED RESPONSIVENESS: Button state change */}
                    <button 
                        type="submit" 
                        className="btn btn-primary" 
                        disabled={isUpdating}
                        style={{ width: '100%' }}
                    >
                        {isUpdating ? "Saving Changes..." : "Update Post"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditPost;
