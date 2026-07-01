const express = require("express");
const router = express.Router();

const UsersController = require("../controllers/UsersController");
const PostsController = require("../controllers/PostsController");
const CategoriesController = require("../controllers/CategoriesController");
const { authenticate } = require('../middleware/authMiddleware');
const upload = require('../utils/upload');

// Base
router.get("/", (req, res) => {
    res.json({ message: "Selamat datang di API Dashboard Artikel!" });
});

// Auth (public)
router.post('/login', UsersController.login);
router.post('/register', UsersController.register);

// Users (protected)
router.get("/users", authenticate, UsersController.index);
router.get('/users/:id', authenticate, UsersController.show);
router.post('/users', authenticate, UsersController.store);
router.put('/users/:id', authenticate, UsersController.update);
router.delete('/users/:id', authenticate, UsersController.destroy);

// Profile (protected)
router.put('/auth/profile', authenticate, UsersController.updateProfile.bind(UsersController));

// Posts — semua route SPESIFIK dulu, baru /:id
router.get('/posts/stats', authenticate, PostsController.stats);
router.get('/posts/top-viewed', authenticate, PostsController.topViewed);
router.get('/posts/my-stats', authenticate, PostsController.myStats);
router.get('/posts/my-posts', authenticate, PostsController.myPosts);
router.get("/posts", PostsController.index);
router.get('/posts/:slug/download/pdf', PostsController.downloadPDF);
router.get('/posts/:slug/download/docx', PostsController.downloadDocx);
router.get('/posts/:slug', PostsController.show);

// Posts (protected - create/update/delete)
router.post('/posts', authenticate, PostsController.store);
router.put('/posts/:id', authenticate, PostsController.update);
router.delete('/posts/:id', authenticate, PostsController.destroy);

// Categories (public read)
router.get("/categories", CategoriesController.index);
router.get('/categories/:id', CategoriesController.show);

// Categories (protected write)
router.post('/categories', authenticate, CategoriesController.store);
router.put('/categories/:id', authenticate, CategoriesController.update);
router.delete('/categories/:id', authenticate, CategoriesController.destroy);


module.exports = router;