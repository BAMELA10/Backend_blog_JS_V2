const { query } = require("express");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../error");
const {Types} = require("mongoose")
const Comment = require("../models/Comment");
const StatusCodes = require("http-status-codes");

//Get All Comments for specific blog
// pagination with number of page and limit
const GetAllComments = async (req, res) => {
    const blogId = req.params.id;
    const postId = req.params.postId;
    const sort = req.query.sort;
    const page = req.query.page;
    const limit = req.query.limit || 10;

    if (!blogId || !postId) {
        throw new BadRequestError("Invalid Request Input");
    }

    if(sort && new RegExp("desc", "i").test(sort))
    {
        if(page)
        {
            const skip = (page -1) * limit;
            const comments = await Comment.find({Post:postId})
            .skip(skip)
            .limit(limit)
            .populate({path: "User", select:"fullname email"})
            .populate({path:"Post",select:"title Blog DateOfCreation"})
            .sort({DateOfCreation: -1});
            let newId;
            try {
                newId = Types.ObjectId.createFromHexString(blogId)
            }catch{
                throw new BadRequestError("Invalid Id of Blog. Check it")
            }

            for(var items of comments){
                if(items.Post.Blog.toString() !== newId.toString())
                {
                    throw new BadRequestError("Invalid Request. Check input");
                }
            }
            res.status(StatusCodes.OK).json({ count: comments.length, comments });
        }
        else
        {
            const comments = await Comment.find({Post:postId})
            .populate({path: "User", select:"fullname email"})
            .populate({path:"Post",select:"title Blog DateOfCreation"})
            .sort({DateOfCreation: -1});
            let newId;
            try {
                newId = Types.ObjectId.createFromHexString(blogId)
            }catch{
                throw new BadRequestError("Invalid Id of Blog. Check it")
            }

            for(var items of comments){
                if(items.Post.Blog.toString() !== newId.toString())
                {
                    throw new BadRequestError("Invalid Request. Check input");
                }
            }
            res.status(StatusCodes.OK).json({ count: comments.length, comments });
        }
        
    }
    else
    {
        if(page)
        {
            const skip = (page -1) * limit;
            const comments = await Comment.find({Post:postId})
            .skip(skip)
            .limit(limit)
            .populate({path: "User", select:"fullname email"})
            .populate({path:"Post", select:"title Blog DateOfCreation"})
            .sort({DateOfCreation: 1});
            let newId;
            try {
                newId = Types.ObjectId.createFromHexString(blogId)
            }catch{
                throw new BadRequestError("Invalid Id of Blog. Check it")
            }

            for(var items of comments){
                if(items.Post.Blog.toString() !== newId.toString())
                {
                    throw new BadRequestError("Invalid Request. Check input");
                }
            }
            res.status(StatusCodes.OK).json({ count: comments.length, comments });
        }
        else
        {
            const comments = await Comment.find({Post:postId})
            .populate({path: "User", select:"fullname email"})
            .populate({path:"Post",select:"title Blog DateOfCreation"})
            .sort({DateOfCreation: 1});
            let newId;
            try {
                newId = Types.ObjectId.createFromHexString(blogId)
            }catch{
                throw new BadRequestError("Invalid Id of Blog. Check it")
            }

            for(var items of comments){
                if(items.Post.Blog.toString() !== newId.toString())
                {
                    throw new BadRequestError("Invalid Request. Check input");
                }
            }
            res.status(StatusCodes.OK).json({ count: comments.length, comments });
        }
       
    }
};
//Filter Comments by User or by Post
// pagination with number of page and limit
/* FilterComment = async (req, res) => {
    const UserId = req.query.UserId;
    const PostId = req.query.PostId;
    const Id = req.query.Id;
    const page = req.query.page;
    const limit = req.query.limit || 10;
    const sort = req.query.sort
    


    if(!UserId && !PostId && !Id)
    {
        throw new BadRequestError("Check your query");
    }

    let comment = "";
    let comment_first = "";
    let comment_last = "";

    if(page)
    {
        const skip = (page -1) * limit;
        comment = await Comment.find({_id:Id }).populate({path: ["User", "Post"]})
        .skip(skip)
        .limit(limit);
        comment_first = await Comment.find({User: UserId}).populate({path: ["User", "Post"]})
        .skip(skip)
        .limit(limit);
        comment_last = await Comment.find({Post: PostId}).populate({path: ["User", "Post"]})
        .skip(skip)
        .limit(limit);
    }
    else
    {
        comment = await Comment.find({_id:Id }).populate({path: ["User", "Post"]});
        comment_first = await Comment.find({User: UserId}).populate({path: ["User", "Post"]});
        comment_last = await Comment.find({Post: PostId}).populate({path: ["User", "Post"]});
    }

    //Check if a object is present in an array of object 
    function CheckObject(object, arr) {
        let ObjectId = object._id;
        ObjectId = ObjectId.toString();
        if (arr.length !== 0) {
            for (let elt of arr) {
                let eltId = elt._id;
                eltId = eltId.toString();
                if(eltId === ObjectId) {
                    return true;
                };  
            };
        }
        return false; 
    }

    let result = [];
    comment.forEach(items => {
        let dec = CheckObject(items, result);
        if(!dec) {
            result.push(items);
        };
    });
    comment_first.forEach(items => {
        let dec = CheckObject(items, result)
        if(!dec) {
            result.push(items);
        };
    });
    comment_last.forEach(items => {
        let dec = CheckObject(items, result)
        if(!dec) {
            result.push(items);
        };
    });

    //Sorting comment with DateCreation
    if(sort && new RegExp("desc", "i").test(sort))
    {
        result.sort((a, b) => {
            return b.DateOfCreation.getTime() - a.DateOfCreation.getTime();
        });
        res.status(StatusCodes.OK).json({ count: result.length, Comment:result });
    }
    else
    {
        result.sort((a, b) => {
            return a.DateOfCreation.getTime() - b.DateOfCreation.getTime();
        });
        res.status(StatusCodes.OK).json({ count: result.length, Comment:result });
    }
    

    
} */
//Get Single Comment
const GetSingleComment = async (req, res) => {
    const commentId = req.params.commentId;
    const blogId = req.params.id;
    const postId = req.params.postId;

     if (!commentId || !blogId || !postId) {
        throw new BadRequestError("Invalid Request Input");
    }

    const comment = await Comment.findOne({_id:commentId, Post: postId})
    .populate({path: "User", select:"name email"})
    .populate({path:"Post",select:"title Blog DateOfCreation"})
    
    let newId;
    try {
        newId = Types.ObjectId.createFromHexString(blogId)
    }catch{
        throw new BadRequestError("Invalid Id of Blog. Check it")
    }
    if(comment){
        if(comment.Post.Blog.toString() !== newId.toString())
        {
            throw new BadRequestError("Invalid Request. Check input");
        }
    }else {
        throw new NotFoundError("Ressource not Found");
    }
    res.status(StatusCodes.OK).json({ comment });
};
//Create a Comment
const CreateComment = async (req, res) => {
    const {content} = req.body;
    const blogId = req.params.id;
    const Post = req.params.postId;
    const User = req.user.userId;

    if (!blogId || !Post) {
        throw new BadRequestError("Invalid Request Input");
    }
    if(!content)
    {
        throw new BadRequestError("Please provide a comment");
    }
    const comment = await Comment.create({ content:content, Post:Post, User:User });

    res.status(StatusCodes.CREATED).json({Comment: comment})
}

//Delete a Comment
const DeleteComment = async (req, res) => {
    const CommentId = req.params.commentId;
    const user = req.user.userId;

    let comment = await Comment.findById(CommentId);
    if(comment){
        if(comment.User.toString() !== user){
            throw new UnauthorizedError("You cannot apply this action.")
        }else {
            comment = await Comment.findByIdAndDelete(CommentId)
            if (comment.$isDeleted){
                res.status(StatusCodes.OK).json({ message: "Comment deleted successfully" });
            }
        } 
    }
    else(!comment)
    {
        throw new NotFoundError("Comment not found");
    }
    
}

module.exports = {
    DeleteComment,
    CreateComment,
    GetSingleComment,
    GetAllComments,
}