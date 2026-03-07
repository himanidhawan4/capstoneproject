import express from 'express';
import Post from '../models/Post.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// 1. GET ALL POSTS (With Pagination)
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;

        const totalPosts = await Post.countDocuments();
        const posts = await Post.find()
            .populate('author', 'username')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            posts,
            totalPages: Math.ceil(totalPosts / limit),
            currentPage: page
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching posts" });
    }
});

// 2. GET SINGLE POST (Populated Authors & Comments)
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username')
            .populate('comments.author', 'username');
        if (!post) return res.status(404).json({ message: "Post not found" });
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: "Error loading post" });
    }
});

// 3. CREATE / EDIT POST
router.post('/', verifyToken, async (req, res) => {
    try {
        const newPost = new Post({ ...req.body, author: req.user.id });
        const saved = await newPost.save();
        res.status(201).json(saved);
    } catch (err) { 
        res.status(500).json({ message: "Failed to create post" }); 
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });
        
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized edit attempt" });
        }

        const updated = await Post.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(updated);
    } catch (err) { 
        res.status(500).json({ message: "Update failed" }); 
    }
});

// 4. DELETE POST  
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.author.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: "Unauthorized deletion attempt" });
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Post removed" });
    } catch (err) {
        res.status(500).json({ message: "Server error during deletion" });
    }
});

// 5. COMMENT ACTIONS (Add, Edit, Delete)
router.post('/:id/comments', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        post.comments.push({ text: req.body.text, author: req.user.id });
        await post.save();
        
        const updated = await Post.findById(req.params.id).populate('comments.author', 'username');
        res.json(updated.comments);
    } catch (err) { 
        res.status(500).json({ message: "Comment failed" }); 
    }
});

router.put('/:id/comments/:commentId', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const comment = post.comments.id(req.params.commentId);
        
        if (!comment) return res.status(404).json({ message: "Comment not found" });
        if (comment.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized comment edit" });
        }

        comment.text = req.body.text;
        await post.save();

        const updated = await Post.findById(req.params.id).populate('comments.author', 'username');
        res.json(updated.comments);
    } catch (err) { 
        res.status(500).json({ message: "Edit failed" }); 
    }
});

router.delete('/:id/comments/:commentId', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const comment = post.comments.id(req.params.commentId);
        
        if (comment.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        comment.deleteOne();
        await post.save();
        
        const updated = await Post.findById(req.params.id).populate('comments.author', 'username');
        res.json(updated.comments);
    } catch (err) { 
        res.status(500).json({ message: "Delete failed" }); 
    }
});

export default router;
