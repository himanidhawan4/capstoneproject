import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PostList() {
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filterMine, setFilterMine] = useState(false);

    const navigate = useNavigate();
    const currentUserId = localStorage.getItem('userId');
    const LIMIT = 6;

    const fetchPosts = useCallback(async (targetPage, isInitial = false) => {
        if (isInitial) setLoading(true); else setLoadingMore(true);
        try {
            // Using the new pagination + search API format
            const res = await axios.get(`http://127.0.0.1:5000/api/posts?search=${searchTerm}&page=${targetPage}&limit=${LIMIT}`);
            
            // Safety check: Ensure res.data and res.data.posts exist
            const fetchedPosts = res.data?.posts || [];
            const total = res.data?.totalPages || 1;

            if (isInitial) {
                setPosts(fetchedPosts);
                setPage(2);
            } else {
                setPosts(prev => [...prev, ...fetchedPosts]);
                setPage(targetPage + 1);
            }
            setTotalPages(total);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [searchTerm]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchPosts(1, true);
        }, 500);
        return () => clearTimeout(debounce);
    }, [searchTerm, fetchPosts]);

    const handleLikeAction = async (postId, type) => {
        const token = localStorage.getItem('token');
        if (!token) return alert("Please log in!");
        try {
            await axios.put(`http://127.0.0.1:5000/api/posts/${postId}/${type}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            updateLocalPost(postId, type);
        } catch (err) { console.error(err); }
    };

    const updateLocalPost = (postId, type) => {
        setPosts(prev => prev.map(p => {
            if (p._id === postId) {
                const isLiked = p.likes?.includes(currentUserId);
                const isDisliked = p.dislikes?.includes(currentUserId);
                
                if (type === 'like') {
                    return {
                        ...p,
                        likes: isLiked ? p.likes.filter(id => id !== currentUserId) : [...(p.likes || []), currentUserId],
                        dislikes: (p.dislikes || []).filter(id => id !== currentUserId)
                    };
                } else {
                    return {
                        ...p,
                        dislikes: isDisliked ? p.dislikes.filter(id => id !== currentUserId) : [...(p.dislikes || []), currentUserId],
                        likes: (p.likes || []).filter(id => id !== currentUserId)
                    };
                }
            }
            return p;
        }));
    };

    const displayedPosts = filterMine 
        ? posts.filter(p => String(p.author?._id || p.author) === String(currentUserId))
        : posts;

    if (loading && posts.length === 0) return <div className="container">Loading stories...</div>;

    return (
        <div className="container">
            <div style={{ marginBottom: '20px' }}>
                <input
                    className="input"
                    style={{ borderRadius: '25px', padding: '12px 20px' }}
                    placeholder="🔍 Search stories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div style={{ marginBottom: '25px', display: 'flex', gap: '10px' }}>
                <button className={`btn ${!filterMine ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilterMine(false)}>Public Feed</button>
                <button className={`btn ${filterMine ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilterMine(true)}>My Stories</button>
            </div>

            <div className="post-list">
                {displayedPosts.length > 0 ? (
                    displayedPosts.map(post => {
                         
                        const isLiked = post.likes?.includes(currentUserId);
                        const isAuthor = String(currentUserId) === String(post.author?._id || post.author);

                        return (
                            <div key={post._id} className="card" style={{ marginBottom: '20px' }}>
                                <h3 onClick={() => navigate(`/post/${post._id}`)} style={{ cursor: 'pointer' }}>{post.title}</h3>
                                <p>{post.content?.substring(0, 150)}...</p>
                                <div className="post-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <small>By <strong>{post.author?.username || 'User'}</strong></small>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => handleLikeAction(post._id, 'like')} className={`btn-small ${isLiked ? 'active' : ''}`}>
                                            👍 {post.likes?.length || 0}
                                        </button>
                                        <button onClick={() => navigate(`/post/${post._id}`)} className="btn btn-outline btn-small">View</button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p>No stories found.</p>
                )}
            </div>

            {page <= totalPages && !filterMine && (
                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    <button className="btn btn-outline" onClick={() => fetchPosts(page)} disabled={loadingMore}>
                        {loadingMore ? 'Loading...' : 'Load More'}
                    </button>
                </div>
            )}
        </div>
    );
}

export default PostList;
