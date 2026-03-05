import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function PostDetails() {
    const { id } = useParams(); // Grabs the ID from the URL
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`http://127.0.0.1:5000/api/posts/${id}`);
                setPost(res.data);
            } catch (err) {
                console.error("Error fetching post:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) return <div className="container">Loading story...</div>;
    if (!post) return <div className="container">Story not found.</div>;

    return (
        <div className="container" style={{ maxWidth: '800px', lineHeight: '1.8' }}>
            <button 
                onClick={() => navigate(-1)} 
                className="btn btn-outline" 
                style={{ marginBottom: '20px' }}
            >
                ← Back
            </button>
            
            <article className="card">
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{post.title}</h1>
                <p style={{ opacity: 0.6, marginBottom: '30px' }}>
                    Published by {post.author?.username || 'Writer'}
                </p>
                <hr style={{ border: 'none', borderBottom: '1px solid #eee', marginBottom: '30px' }} />
                
                {/* This renders the full content without any substring cutting */}
                <div style={{ whiteSpace: 'pre-wrap', fontSize: '1.1rem' }}>
                    {post.content}
                </div>
            </article>
        </div>
    );
}

export default PostDetails;