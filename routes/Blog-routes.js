const express = require('express');
const Router = express.Router();
const blogController = require("../controller/BlogController");
const PostRouter = require("./Post-routes");
const { AuthMiddleware } = require('../middleware/Auth');
const Caching = require ('../middleware/Caching');
//Definition of Routes

Router
.route('/')
.get([AuthMiddleware, Caching], blogController.getAllBlogsByOnlineUser)
.post([AuthMiddleware], blogController.createBlog);

Router
.route('/:id')
.get([AuthMiddleware, Caching], blogController.getBlogById)
.put([AuthMiddleware], blogController.updateBlog)
.delete([AuthMiddleware], blogController.deleteBlog);


Router.use('/:id/Post', PostRouter);

module.exports = Router;