const express = require("express");
const router = express.Router();
const Caching = require("../middleware/Caching");

const {
    DeleteComment,
    CreateComment,
    GetSingleComment,
    FilterComment,
    GetAllComments
} = require("../controller/CommentController");

const {AuthMiddleware} = require("../middleware/Auth");

router.route("/").get([AuthMiddleware, Caching], GetAllComments);

router.route("/search")
.get([AuthMiddleware, Caching], FilterComment);

router.route("/:postId")
.post(AuthMiddleware, CreateComment)

router.route("/:id")
.get([AuthMiddleware, Caching], GetSingleComment)
.delete(AuthMiddleware, DeleteComment);



module.exports = router;
