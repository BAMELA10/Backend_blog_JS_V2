const express = require("express");
const router = express.Router();
const { AuthMiddleware }= require("../middleware/Auth");

const {
    DeletePost,
    NewPost,
    UpdatePost,
    GetSinglePost,
    GetPostForOnlineAuthor,
    GetAllPost
} = require("../controller/PostController");

router
.route("/")
.get(AuthMiddleware, GetAllPost)
.post(AuthMiddleware, NewPost)

router
.route("/me")
.get(AuthMiddleware, GetPostForOnlineAuthor);

router
.route("/:id")
.get(AuthMiddleware, GetSinglePost)
.put(AuthMiddleware, UpdatePost)
.delete(AuthMiddleware, DeletePost);



module.exports = router;
