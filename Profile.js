import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const [myPosts, setMyPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Retrieve identity data from localStorage
    const currentUserId = localStorage.getItem('userId');
    const storedUsername = localStorage.getItem('username');
    const username = storedUsername && storedUsername !== "undefined" ? storedUsername : "Writer";

    useEffect(() => {
        const fetchMyPosts = async () => {
            try {
                // Fetching all posts  
                const res = await axios.get(`http://127.0.0.1:5000/api/posts?limit=100`);

                // Extract the posts array from the new paginated structure }
                const allPosts = res.data.posts || (Array.isArray(res.data) ? res.data : []);

                // Filter using String conversion to prevent type mismatch (ObjectId vs String)
                const filtered = allPosts.filter(post => {
                    const authorId = post.author?._id || post.author;
                    return String(authorId) === String(currentUserId);
                });

                setMyPosts(filtered);
            } catch (err) {
                console.error("Profile fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        if (currentUserId) {
            fetchMyPosts();
        } else {
            navigate('/login');
        }
    }, [currentUserId, navigate]);

    const handleDelete = async (postId) => {
        if (window.confirm("Are you sure you want to delete this story? This action is permanent.")) {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.delete(`http://127.0.0.1:5000/api/posts/${postId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Check for success flag from your updated backend delete route
                if (res.status === 200 || res.data.success) {
                    setMyPosts(myPosts.filter(p => p._id !== postId));
                }
            } catch (err) {
                console.error("Delete error:", err);
                alert(err.response?.data?.message || "Failed to delete the post.");
            }
        }
    };

    return (
        <div className="container">
            <header style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={avatarStyle}>{username[0].toUpperCase()}</div>
                <h2 style={{ marginBottom: '5px' }}>{username}'s Workspace</h2>
                <p style={{ opacity: 0.6 }}>
                    Managing {myPosts.length} published {myPosts.length === 1 ? 'story' : 'stories'}.
                </p>
            </header>

            <hr style={{ border: 'none', borderBottom: '1px solid var(--border-color)', marginBottom: '30px' }} />

            {loading ? (
                <div className="loading-state" style={{ textAlign: 'center' }}>Syncing your stories...</div>
            ) : myPosts.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ marginBottom: '20px' }}>Your workspace is currently empty.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/write')}>
                        Write Your First Story
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {myPosts.map(post => (
                        <div key={post._id} className="card">
                            <h3 style={{ marginTop: 0, color: 'var(--primary-blue)' }}>{post.title}</h3>
                            <p style={{ opacity: 0.8, margin: '10px 0' }}>
                                {post.content.substring(0, 150)}...
                            </p>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                <button
                                    className="btn btn-outline"
                                    style={{ borderColor: '#f1c40f', color: '#d4ac0d' }}
                                    onClick={() => navigate(`/edit-post/${post._id}`)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-outline"
                                    style={{ borderColor: '#e74c3c', color: '#e74c3c' }}
                                    onClick={() => handleDelete(post._id)}
                                >
                                    Delete
                                </button>
                                <button
                                    className="btn btn-outline"
                                    onClick={() => navigate(`/post/${post._id}`)}
                                >
                                    View Full
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const avatarStyle = {
    width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#3498db',
    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '28px', margin: '0 auto 15px', fontWeight: 'bold',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
};

export default Profile;
