import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const [myPosts, setMyPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const currentUserId = localStorage.getItem('userId');
    const username = localStorage.getItem('username') || "User"; // Ensure you save username on login

    useEffect(() => {
        const fetchMyPosts = async () => {
            try {

                const res = await axios.get(`http://127.0.0.1:5000/api/posts`);
                const filtered = res.data.filter(post =>
                    (post.author?._id === currentUserId) || (post.author === currentUserId)
                );

                setMyPosts(filtered);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching profile posts", err);
                setLoading(false);
            }
        };
        if (currentUserId) fetchMyPosts();
    }, [currentUserId]);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={avatarStyle}>{username[0].toUpperCase()}</div>
                <h2>{username}'s Workspace</h2>
                <p style={{ color: '#888' }}>You have published {myPosts.length} stories.</p>
            </div>

            <hr style={{ border: '0.5px solid #eee', marginBottom: '30px' }} />

            {loading ? <p>Loading your stories...</p> : myPosts.length === 0 ? (
                <div style={{ textAlign: 'center' }}>
                    <p>You haven't posted anything yet.</p>
                    <button onClick={() => navigate('/create-post')} style={createBtnStyle}>Create Your First Post</button>
                </div>
            ) : (
                myPosts.map(post => (
                    <div key={post._id} style={postCardStyle}>
                        <h3>{post.title}</h3>
                        <p>{post.content.substring(0, 100)}...</p>
                        <button onClick={() => navigate(`/edit-post/${post._id}`)} style={editBtnStyle}>Manage Post</button>
                    </div>
                ))
            )}
        </div>
    );
}

// Styles
const avatarStyle = { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#007bff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 15px', fontWeight: 'bold' };
const postCardStyle = { padding: '20px', border: '1px solid #ddd', borderRadius: '10px', marginBottom: '15px', backgroundColor: 'var(--card-bg)' };
const createBtnStyle = { padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const editBtnStyle = { padding: '5px 15px', backgroundColor: '#ffc107', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };

export default Profile;
