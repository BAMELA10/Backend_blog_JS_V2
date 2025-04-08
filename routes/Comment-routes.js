const express = require("express");
const router = express.Router();

const {
    DeleteComment,
    CreateComment,
    GetSingleComment,
    FilterComment,
    GetAllComments
} = require("../controller/CommentController");

const {AuthMiddleware} = require("../middleware/Auth");

router.route("/").get(AuthMiddleware, GetAllComments);

router.route("/search")
.get(AuthMiddleware, FilterComment);

router.route("/:postId")
.post(AuthMiddleware, CreateComment)

router.route("/:id")
.get(AuthMiddleware, GetSingleComment)
.delete(AuthMiddleware, DeleteComment);



module.exports = router;
