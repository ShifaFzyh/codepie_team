const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/UsersController');
const PostsController = require('../controllers/PostsController');

// API Routes dengan prefix /api
const apiRoutes = express.Router();

// Routes untuk Users
apiRoutes.get('/users', UsersController.index);
apiRoutes.get('/users/:id', UsersController.show);
apiRoutes.post('/users', UsersController.store);
apiRoutes.put('/users/:id', UsersController.update);
apiRoutes.delete('/users/:id', UsersController.destroy);

// Routes untuk Posts
apiRoutes.get('/posts', PostsController.index);
apiRoutes.get('/posts/:id', PostsController.show);
apiRoutes.post('/posts', PostsController.store);
apiRoutes.put('/posts/:id', PostsController.update);
apiRoutes.delete('/posts/:id', PostsController.destroy);

router.use('/api', apiRoutes);

module.exports = router;