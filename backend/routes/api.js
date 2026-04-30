const express = require("express");
const router = express.Router();

// Import Controller
const UsersController = require("../controllers/UsersController");
const PostsController = require("../controllers/PostsController");
const CategoriesController = require("../controllers/CategoriesController");

// Base Route
router.get("/", (req, res) => {
    res.json({ message: "Selamat datang di API Dashboard Artikel!" });
});

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

module.exports = router;