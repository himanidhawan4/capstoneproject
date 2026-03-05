import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PostList() {
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const navigate = useNavigate();
    const currentUserId = localStorage.getItem('userId');
    const LIMIT = 5;

    // Fixed fetchPosts: it now takes the specific page to fetch as an argument
    const fetchPosts = useCallback(async (targetPage, isInitial = false) => {
        if (isInitial) setLoading(true);
        else setLoadingMore(true);

        try {
            const res = await axios.get(
                `http://127.0.0.1:5000/api/posts?search=${searchTerm}&page=${targetPage}&limit=${LIMIT}`
            );

            if (isInitial) {
                setPosts(res.data);
                setPage(2);
            } else {
                setPosts(prev => [...prev, ...res.data]);
                setPage(targetPage + 1);
            }

            setHasMore(res.data.length === LIMIT);
        } catch (err) {
            setError("Failed to fetch posts.");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [searchTerm]); // Only recreate if searchTerm changes

    // Handle Search with Debounce
    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchPosts(1, true); // Always start at page 1 for a new search
        }, 500);
        return () => clearTimeout(debounce);
    }, [searchTerm, fetchPosts]);

    if (loading && posts.length === 0) return <div className="loading-state">Loading community feed...</div>;

    return (
        <div className="container">
            <input
                className="input"
                style={{ borderRadius: '25px', marginBottom: '30px' }}
                placeholder="🔍 Search stories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {error && <div className="error-msg">{error}</div>}

            {posts.length === 0 && !loading && (
                <div className="card" style={{ textAlign: 'center', opacity: 0.6 }}>
                    No stories found matching your search.
                </div>
            )}

            {posts.map(post => {
                if (!post || !post.title) return null;

                return (
                    <div key={post._id} className="card">
                        {/* CLICKABLE TITLE: Navigates to the full PostDetails page */}
                        <h3 
                            onClick={() => navigate(`/post/${post._id}`)} 
                            style={{ cursor: 'pointer', color: 'var(--primary-blue)' }}
                        >
                            {post.title}
                        </h3>
                        
                        <p>{post.content?.substring(0, 200) || "No content available."}...</p>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                            <small>By <strong>{post.author?.username || 'Anonymous'}</strong></small>
                            
                            {/* READ MORE BUTTON: Another way to navigate */}
                            <button 
                                onClick={() => navigate(`/post/${post._id}`)}
                                className="btn btn-outline"
                                style={{ padding: '5px 10px', fontSize: '12px' }}
                            >
                                Read Full Story
                            </button>
                        </div>
                    </div>
                );
            })}

            {/* Load More Section */}
            <div style={{ textAlign: 'center', marginTop: '30px', paddingBottom: '40px' }}>
                {hasMore && !loading && (
                    <button
                        className="btn btn-primary"
                        onClick={() => fetchPosts(page, false)} // Pass current state page
                        disabled={loadingMore}
                    >
                        {loadingMore ? 'Loading...' : 'Load More Stories'}
                    </button>
                )}
                {!hasMore && posts.length > 0 && (
                    <p style={{ opacity: 0.5, fontSize: '14px' }}>✨ You've reached the end of the feed.</p>
                )}
            </div>
        </div>
    );
}

export default PostList;
