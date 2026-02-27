import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        // Fetch the specific post to edit 
        const fetchPost = async () => {
            try {
                const res = await axios.get(`http://127.0.0.1:5000/api/posts`);
                // Find the specific post from the list or add a /api/posts/:id route
                const targetPost = res.data.find(p => p._id === id);
                if (targetPost) {
                    setTitle(targetPost.title);
                    setContent(targetPost.content);
                }
            } catch (err) {
                console.error("Error fetching post data", err);
            }
        };
        fetchPost();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            //  EDIT POST logic
            await axios.put(`http://127.0.0.1:5000/api/posts/${id}`, 
                { title, content },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Blog updated successfully!');
            navigate('/');
        } catch (error) {
            alert('Update failed: ' + (error.response?.data?.message || "Server error"));
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div style={{
                backgroundColor: 'var(--card-bg)',
                padding: '40px',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '500px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
            }}>
                <h2 style={{ color: 'var(--text-color)', textAlign: 'center', marginBottom: '20px' }}>Edit Your Post</h2>
                <form onSubmit={handleUpdate}>
                    <input
                        type="text"
                        value={title}
                        style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <textarea
                        value={content}
                        style={{ width: '100%', height: '150px', padding: '12px', marginBottom: '20px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', resize: 'none' }}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    ></textarea>
                    <button
                        type="submit"
                        style={{ width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        Save Changes
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        style={{ width: '100%', marginTop: '10px', padding: '12px', backgroundColor: 'transparent', color: 'var(--text-color)', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
}


export default EditPost;
