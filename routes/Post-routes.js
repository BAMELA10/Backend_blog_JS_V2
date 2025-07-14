const express = require("express");
const router = express.Router();
const { AuthMiddleware, AuhtorizationMiddleware }= require("../middleware/Auth");
const Caching = require ('../middleware/Caching');

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
.get([AuthMiddleware, Caching], GetAllPost)
.post(AuthMiddleware, NewPost)

router
.route("/me")
.get([AuthMiddleware, Caching], GetPostForOnlineAuthor);

router.route("/search")
.get([AuthMiddleware, AuhtorizationMiddleware(["admin"]), Caching], FilteringPost);

router
.route("/:id")
.get([AuthMiddleware, Caching], GetSinglePost)
.put(AuthMiddleware, UpdatePost)
.delete(AuthMiddleware, DeletePost);



module.exports = router;
