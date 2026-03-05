import express from 'express';
import Post from '../models/post.js';
import { verifyToken } from '../middleware/verifyToken.js';
import mongoose from 'mongoose';

const router = express.Router();

// 1. GET ALL POSTS (With Search & Pagination support)
router.get('/', async (req, res) => {
    try {
        const { search } = req.query;

        if (!search || search.trim() === "") {
            const posts = await Post.find()
                .populate('author', 'username')
                .sort({ createdAt: -1 });
            return res.json(posts);
        }

        // Deep Search Aggregation
        const posts = await Post.aggregate([
            {
                $lookup: {
                    from: 'users', 
                    localField: 'author',
                    foreignField: '_id',
                    as: 'authorDetails'
                }
            },
            { $unwind: { path: '$authorDetails', preserveNullAndEmptyArrays: true } },
            {
                $match: {
                    $or: [
                        { title: { $regex: search, $options: 'i' } },
                        { 'authorDetails.username': { $regex: search, $options: 'i' } }
                    ]
                }
            },
            {
                $project: {
                    title: 1,
                    content: 1,
                    createdAt: 1,
                    author: {
                        _id: '$authorDetails._id',
                        username: { $ifNull: ['$authorDetails.username', 'Anonymous'] }
                    }
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: "Search failed: " + err.message });
    }
});

// 2. GET SINGLE POST (Moved up for priority)
router.get('/:id', async (req, res) => {
    try {
        // Validation: Check if the ID is a valid MongoDB ObjectID format
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid Post ID format" });
        }

        const post = await Post.findById(req.params.id).populate('author', 'username');
        
        if (!post) {
            return res.status(404).json({ message: "Post not found in database" });
        }
        
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: "Server error: " + err.message });
    }
});

// 3. CREATE POST 
router.post('/', verifyToken, async (req, res) => {
    try {
        const newPost = new Post({
            title: req.body.title,
            content: req.body.content,
            author: req.user.id
        });
        const savedPost = await newPost.save();
        const populatedPost = await Post.findById(savedPost._id).populate('author', 'username');
        res.status(201).json(populatedPost);
    } catch (err) {
        res.status(500).json({ message: "Post creation failed" });
    }
});

// 4. EDIT POST
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });
        if (post.author.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        ).populate('author', 'username');
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(500).json({ message: "Update failed" });
    }
});

// 5. DELETE POST
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });
        if (post.author.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: "Post deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
