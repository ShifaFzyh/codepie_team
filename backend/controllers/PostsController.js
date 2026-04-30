const Posts = require("../models/Posts");

class PostsController {
    index(req, res) { // Nama harus 'index' sesuai route
        Posts.getAll((err, results) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            res.json({ success: true, data: results });
        });
    }

    show(req, res) {
        const { id } = req.params;
        Posts.getByID(id, (err, result) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            if (!result || result.length === 0) {
                return res.status(404).json({ success: false, message: "Post not found" });
            }
            res.json({ success: true, data: result[0] });
        });
    }

    store(req, res) {
        const { title, slug, content, image, author_id, category_id } = req.body;
        
        // Validasi input
        if (!title || !content) {
            return res.status(400).json({ success: false, message: "Title and content are required" });
        }

        const data = {
            title,
            slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
            content,
            image: image || null,
            author_id: author_id || 1,
            category_id: category_id || 1
        };

        Posts.create(data, (err, result) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            res.json({ success: true, message: "Post Created", id: result.insertId });
        });
    }
    
    update(req, res) {
        const { id } = req.params;
        const { title, slug, content, image, category_id } = req.body;

        // Validasi input
        if (!title || !content) {
            return res.status(400).json({ success: false, message: "Title and content are required" });
        }

        const data = {
            title,
            slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
            content,
            image: image || null,
            category_id: category_id || 1
        };

        Posts.update(id, data, (err, result) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            res.json({ success: true, message: "Post Updated" });
        });
    }

    destroy(req, res) {
        const { id } = req.params;
        Posts.delete(id, (err, result) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            res.json({ success: true, message: "Post Deleted" });
        });
    }
}

module.exports = new PostsController();