import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/** * Bonus Requirement 5.d: Date Formatting
 * Converts ISO date strings into relative time (e.g., "5m ago").
 */
const formatRelativeDate = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) return "Just now";
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return postDate.toLocaleDateString();
};

function PostList() {
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchPosts = useCallback(async () => {
        setLoading(true); 
        try {
            const res = await axios.get(`http://127.0.0.1:5000/api/posts?search=${searchTerm}`);
            setPosts(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching posts", err);
            setLoading(false);
        }
    }, [searchTerm]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchPosts();
        }, 500); 

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, fetchPosts]); 

    const handleDelete = async (postId) => {
        if (window.confirm("Delete post permanently?")) { // Requirement 2.b.v
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://127.0.0.1:5000/api/posts/${postId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Post deleted successfully!"); // Requirement 3.e.i
                fetchPosts(); 
            } catch (err) {
                alert("Unauthorized or error.");
            }
        }
    };

    const currentUserId = localStorage.getItem('userId');

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', color: 'var(--text-color)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Community Feed</h2>
            
            {/* Bonus Task 5.b: Search Functionality */}
            <div style={{ marginBottom: '30px' }}>
                <input
                    type="text"
                    placeholder="🔍 Search title or author..."
                    style={searchBarStyle}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? ( // Requirement 3.e.iii: Loading indicators
                <div style={{ textAlign: 'center', marginTop: '50px' }}><p>Loading stories...</p></div>
            ) : posts.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <p>No results found for "{searchTerm}"</p>
                    <button onClick={() => setSearchTerm('')} style={clearButtonStyle}>Clear</button>
                </div>
            ) : (
                posts.map((post) => {
                    // Requirement 2.b.iv & 2.b.v: Ownership Check
                    const isAuthor = currentUserId && post.author && (
                        (post.author._id === currentUserId) || (post.author === currentUserId)
                    );

                    return (
                        <div key={post._id} style={cardStyle}>
                            <h3 style={{ marginTop: '0' }}>{post.title}</h3>
                            <p>{post.content}</p>
                            
                            {/* Requirement 2.b.ii: Display author and date */}
                            <small style={{ display: 'block', marginTop: '15px', color: '#888' }}>
                                By: <strong>{post.author?.username || "Anonymous"}</strong> | {formatRelativeDate(post.createdAt)}
                            </small>

                            {isAuthor && (
                                <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                                    <button onClick={() => navigate(`/edit-post/${post._id}`)} style={editButtonStyle}>Edit</button>
                                    <button onClick={() => handleDelete(post._id)} style={deleteButtonStyle}>Delete</button>
                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
}

// Styling (Requirement 3.f: Minimalistic Styling)
const searchBarStyle = { width: '100%', padding: '12px 20px', borderRadius: '30px', border: '1px solid var(--border-color)', backgroundColor: 'var(--card-bg)', color: 'var(--text-color)', fontSize: '16px', outline: 'none' };
const cardStyle = { border: '1px solid var(--border-color)', padding: '25px', marginBottom: '20px', borderRadius: '12px', backgroundColor: 'var(--card-bg)' };
const clearButtonStyle = { padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', backgroundColor: '#6c757d', color: 'white', border: 'none', marginTop: '10px' };
const editButtonStyle = { backgroundColor: '#ffc107', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const deleteButtonStyle = { backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };

export default PostList;