const express = require("express");
const router = express.Router();

// Import Controller
const UsersController = require("../controllers/UsersController");
const PostsController = require("../controllers/PostsController");
const CategoriesController = require("../controllers/CategoriesController");
const { authenticate } = require('../middleware/authMiddleware');
const upload = require('../utils/upload');


// Base Route
router.get("/", (req, res) => {
    res.json({ message: "Selamat datang di API Dashboard Artikel!" });
});


// ✅ Tidak perlu upload di sini karena sudah dihandle di controller
router.post('/posts', authenticate, PostsController.store);
router.put('/posts/:id', authenticate, PostsController.update);

// Routes untuk Users
router.get("/users", UsersController.index);
router.get('/users/:id', UsersController.show);
router.post('/users', UsersController.store);
router.put('/users/:id', UsersController.update);
router.delete('/users/:id', UsersController.destroy);

// Routes untuk Posts
router.get("/posts", PostsController.index);
router.get('/posts/:id', PostsController.show);
router.post('/posts', PostsController.store);
router.put('/posts/:id', PostsController.update);
router.delete('/posts/:id', PostsController.destroy);

// Routes untuk Categories
router.get("/categories", CategoriesController.index);
router.get('/categories/:id', CategoriesController.show);
router.post('/categories', CategoriesController.store);
router.put('/categories/:id', CategoriesController.update);
router.delete('/categories/:id', CategoriesController.destroy);


// ✅ Users routes (protected - butuh token)
router.get('/users', authenticate, (req, res) => UsersController.index(req, res));
router.get('/users/:id', authenticate, (req, res) => UsersController.show(req, res));
router.post('/users', authenticate, (req, res) => UsersController.store(req, res));
router.put('/users/:id', authenticate, (req, res) => UsersController.update(req, res));
router.delete('/users/:id', authenticate, (req, res) => UsersController.destroy(req, res));


module.exports = router;