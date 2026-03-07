import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { formatRelativeTime } from './utils/helpers.js';

function PostDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Core States
    const [post, setPost] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isActionLoading, setIsActionLoading] = useState(false);

    // Comment Edit States
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editText, setEditText] = useState('');

    const currentUserId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    // 1. Fetch Post Data
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`http://127.0.0.1:5000/api/posts/${id}`);
                setPost(res.data);
            } catch (err) {
                setError("Post not found.");
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    // 2. Blog Post Actions (Delete)
    const handleDeletePost = async () => {
        if (!window.confirm("Are you sure you want to delete this entire blog post?")) return;
        setIsActionLoading(true);
        try {
            await axios.delete(`http://127.0.0.1:5000/api/posts/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/');
        } catch (err) {
            setError("Failed to delete post.");
            setIsActionLoading(false);
        }
    };

    // 3. Comment Actions (Add, Edit, Delete)
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (commentText.trim().length < 3) return setError("Comment too short.");
        
        setIsActionLoading(true);
        try {
            const res = await axios.post(`http://127.0.0.1:5000/api/posts/${id}/comments`, 
                { text: commentText },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPost({ ...post, comments: res.data });
            setCommentText('');
            setError('');
        } catch (err) {
            setError("Failed to post comment.");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Delete this comment?")) return;
        try {
            const res = await axios.delete(`http://127.0.0.1:5000/api/posts/${id}/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPost({ ...post, comments: res.data });
        } catch (err) {
            setError("Could not delete comment.");
        }
    };

    const handleUpdateComment = async (commentId) => {
        setIsActionLoading(true);
        try {
            const res = await axios.put(`http://127.0.0.1:5000/api/posts/${id}/comments/${commentId}`, 
                { text: editText },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPost({ ...post, comments: res.data });
            setEditingCommentId(null);
        } catch (err) {
            setError("Update failed.");
        } finally {
            setIsActionLoading(false);
        }
    };

    if (loading) return <div className="container">Loading post...</div>;
    if (!post) return <div className="container">{error || "Post not found"}</div>;

    const isPostOwner = String(post.author?._id || post.author) === String(currentUserId);

    return (
        <div className="container">
            {/* Header / Post Management */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <button onClick={() => navigate(-1)} className="btn btn-outline">← Back</button>
                {isPostOwner && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn btn-outline" onClick={() => navigate(`/edit-post/${id}`)}>Edit Blog</button>
                        <button className="btn" style={{ background: '#dc3545', color: 'white' }} onClick={handleDeletePost} disabled={isActionLoading}>
                            {isActionLoading ? "Deleting..." : "Delete Blog"}
                        </button>
                    </div>
                )}
            </div>

            {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

            <article className="card">
                <h1>{post.title}</h1>
                <p style={{ opacity: 0.7 }}>By {post.author?.username || 'Anonymous'}</p>
                <div style={{ whiteSpace: 'pre-wrap', marginTop: '20px', lineHeight: '1.6' }}>{post.content}</div>
            </article>

            {/* --- COMMENT SECTION --- */}
            <section style={{ marginTop: '40px' }}>
                <h3>Comments ({post.comments?.length || 0})</h3>
                
                <form onSubmit={handleCommentSubmit} style={{ margin: '20px 0' }}>
                    <textarea 
                        className="input" 
                        value={commentText} 
                        onChange={(e) => setCommentText(e.target.value)} 
                        placeholder="Join the conversation..." 
                        required 
                    />
                    <button className="btn btn-primary" style={{ marginTop: '10px' }} disabled={isActionLoading}>
                        {isActionLoading ? "Posting..." : "Post Comment"}
                    </button>
                </form>

                <div className="comment-list">
                    {post.comments?.map((c) => {
                        const isCommentOwner = String(c.author?._id || c.author) === String(currentUserId);
                        return (
                            <div key={c._id} className="card" style={{ marginBottom: '10px', padding: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <strong>{c.author?.username || 'User'}</strong>
                                    
                                    {isCommentOwner && (
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button className="btn-link" onClick={() => { setEditingCommentId(c._id); setEditText(c.text); }}>Edit</button>
                                            <button className="btn-link" style={{ color: '#dc3545' }} onClick={() => handleDeleteComment(c._id)}>Delete</button>
                                        </div>
                                    )}
                                </div>

                                {editingCommentId === c._id ? (
                                    <div style={{ marginTop: '10px' }}>
                                        <textarea className="input" value={editText} onChange={(e) => setEditText(e.target.value)} />
                                        <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                                            <button className="btn btn-primary" onClick={() => handleUpdateComment(c._id)} disabled={isActionLoading}>Save</button>
                                            <button className="btn-link" onClick={() => setEditingCommentId(null)}>Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <p style={{ marginTop: '8px' }}>{c.text}</p>
                                )}
                                <small style={{ opacity: 0.5 }}>{formatRelativeTime(c.createdAt)}</small>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}

export default PostDetails;
