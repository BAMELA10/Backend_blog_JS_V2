const express = require("express");
const router = express.Router({mergeParams: true});
const Caching = require("../middleware/Caching");

const {
    DeleteComment,
    CreateComment,
    GetSingleComment,
    GetAllComments
} = require("../controller/CommentController");


const {AuthMiddleware} = require("../middleware/Auth");

router
.route("/")
.get([AuthMiddleware, Caching], GetAllComments)
.post(AuthMiddleware, CreateComment);



router
.route("/:commentId")
.get([AuthMiddleware, Caching], GetSingleComment)
.delete(AuthMiddleware, DeleteComment);



module.exports = router;
