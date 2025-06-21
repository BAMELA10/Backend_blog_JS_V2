const express = require("express");
const router = express.Router();
const { AuthMiddleware, AuhtorizationMiddleware }= require("../middleware/Auth");

const {
    DeletePost,
    NewPost,
    UpdatePost,
    GetSinglePost,
    GetPostForOnlineAuthor,
    GetAllPost,
    FilteringPost
} = require("../controller/PostController");

router
.route("/")
.get(AuthMiddleware, GetAllPost)
.post(AuthMiddleware, NewPost)

router
.route("/me")
.get(AuthMiddleware, GetPostForOnlineAuthor);

router.route("/search")
.get([AuthMiddleware, AuhtorizationMiddleware(["admin"])], FilteringPost);

router
.route("/:id")
.get(AuthMiddleware, GetSinglePost)
.put(AuthMiddleware, UpdatePost)
.delete(AuthMiddleware, DeletePost);



module.exports = router;
