const {
    NotFoundError,
    BadRequestError,
} = require("../error");

const Comment = require("../models/Comment");
const Post = require("../models/Post");
const StatusCodes = require("http-status-codes");

//Get All Comments
const GetAllComments = async (req, res) => {
    const comments = await Comment.find().populate({path: ["User", "Post"]} );
    res.status(StatusCodes.OK).json({ count: comments.length, comments });
};

//Filter Comments by User or by Post
FilterComment = async (req, res) => {
    const UserId = req.query.UserId;
    const PostId = req.query.PostId;
    const Id = req.query.Id;

    if(!UserId && !PostId && !Id)
    {
        throw new BadRequestError("Check your query");
    }

    const comment = await Comment.find({_id:Id }).populate({path: ["User", "Post"]});
    const comment_first = await Comment.find({User: UserId}).populate({path: ["User", "Post"]});
    const comment_last = await Comment.find({Post: PostId}).populate({path: ["User", "Post"]});

    function CheckObject(object, arr) {
        let ObjectId = object._id;
        ObjectId = ObjectId.toString();
        if (arr.length !== 0) {
            for (let elt of arr) {
                let eltId = elt._id;
                console.log(eltId)
                eltId = eltId.toString();
                if(eltId === ObjectId) {
                    return true;
                };  
            };
            return false; 
        }else {
            return false;
        }
    }

    let result = [];
    comment.forEach(items => {
        let dec = CheckObject(items, result);
        console.log(dec);
        if(!dec) {
            result.push(items);
        };
    });
    comment_first.forEach(items => {
        let dec = CheckObject(items, result)
        console.log(dec);
        if(!dec) {
            result.push(items);
        };
    });
    comment_last.forEach(items => {
        let dec = CheckObject(items, result)
        console.log(dec);
        if(!dec) {
            result.push(items);
        };
    });
    res.status(StatusCodes.OK).json({ count: result.length, Comment:result });
}


//Get Single Comment
const GetSingleComment = async (req, res) => {
    const Id = req.params.id;

    const comment = await Comment.findById(Id).populate({path: ["User", "Post"]});
    
    if (!comment) {
        throw new NotFoundError("Comment not found");
    }
   
    res.status(StatusCodes.OK).json({ comment });
};
//Create a Comment
const CreateComment = async (req, res) => {
    const {content} = req.body;
    const Post = req.params.postId;
    const User = req.user.userId;

    if(!content)
    {
        throw new BadRequestError("Please provide a comment");
    }
    const comment = await Comment.create({ content, Post, User });

    res.status(StatusCodes.CREATED).json({postId: Post, Comment: comment})
}
//Delete a Comment

const DeleteComment = async (req, res) => {
    const CommentId = req.params.id;

    const comment = await Comment.findByIdAndDelete(CommentId);
    if (!comment) {
        throw new NotFoundError("Comment not found");
    }
    if (comment.$isDeleted){
        res.status(StatusCodes.OK).json({ message: "Comment deleted successfully" });
    }
    
}

module.exports = {
    DeleteComment,
    CreateComment,
    GetSingleComment,
    FilterComment,
    GetAllComments

}