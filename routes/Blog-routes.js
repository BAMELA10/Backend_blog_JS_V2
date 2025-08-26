const express = require('express');
const Router = express.Router();
const blogController = require("../controller/BlogController");
const PostController = require("../controller/PostController");
const { AuthMiddleware } = require('../middleware/Auth');
const { Route } = require('express');

//Definition of Routes

Router
.route('/')
.get([AuthMiddleware, Caching], blogController.getAllBlogsByUser)
.post([AuthMiddleware], blogController.createBlog);

Router
.route('/:id')
.get([AuthMiddleware, Caching], blogController.getBlogById)
.put([AuthMiddleware], blogController.updateBlog)
.delete([AuthMiddleware], blogController.deleteBlog);


Router.use('/:id/Post', PostController);

module.exports = Router;