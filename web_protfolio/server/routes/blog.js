const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'blog.json');

/**
 * Reads blog posts from the JSON file.
 * @returns {Array} Array of blog post objects
 */
function readBlogPosts() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading blog file:', error.message);
        return [];
    }
}

/**
 * Writes blog posts array to the JSON file.
 * @param {Array} posts - Array of blog post objects to save
 */
function writeBlogPosts(posts) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 4), 'utf-8');
    } catch (error) {
        console.error('Error writing blog file:', error.message);
        throw error;
    }
}

router.get('/', (req, res) => {
    try {
        let posts = readBlogPosts();
        const { tag } = req.query;

        if (tag && tag !== 'all') {
            posts = posts.filter((post) =>
                post.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
            );
        }

        posts.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json({
            success: true,
            count: posts.length,
            data: posts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve blog posts'
        });
    }
});

router.get('/:id', (req, res) => {
    try {
        const posts = readBlogPosts();
        const post = posts.find((p) => p.id === parseInt(req.params.id));

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found'
            });
        }

        res.json({
            success: true,
            data: post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve blog post'
        });
    }
});

router.post('/', (req, res) => {
    try {
        const { title, excerpt, content, author, tags, image } = req.body;

        if (!title || !excerpt || !content || !author) {
            return res.status(400).json({
                success: false,
                message: 'Please provide title, excerpt, content, and author'
            });
        }

        const posts = readBlogPosts();

        const newId = posts.length > 0 ? Math.max(...posts.map((p) => p.id)) + 1 : 1;

        const wordCount = content.split(/\s+/).length;
        const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min`;

        const newPost = {
            id: newId,
            title,
            excerpt,
            content,
            author,
            date: new Date().toISOString().split('T')[0],
            tags: Array.isArray(tags) ? tags : (tags ? [tags] : ['General']),
            image: image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop',
            readTime
        };

        posts.push(newPost);
        writeBlogPosts(posts);

        res.status(201).json({
            success: true,
            message: 'Blog post added successfully',
            data: newPost
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to add blog post'
        });
    }
});

module.exports = router;
