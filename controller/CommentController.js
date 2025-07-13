const { query } = require("express");
const {
    NotFoundError,
    BadRequestError,
} = require("../error");

const Comment = require("../models/Comment");
const StatusCodes = require("http-status-codes");

//Get All Comments
// pagination with number of page and limit
const GetAllComments = async (req, res) => {
    const sort = req.query.sort;
    const page = req.query.page;
    const limit = req.query.limit || 10;
    if(sort && new RegExp("desc", "i").test(sort))
    {
        if(page)
        {
            const skip = (page -1) * limit;
            const comments = await Comment.find()
            .skip(skip)
            .limit(limit)
            .populate({path: ["User", "Post"]})
            .sort({DateOfCreation: -1});
            res.status(StatusCodes.OK).json({ count: comments.length, comments });
        }
        else
        {
            const comments = await Comment.find()
            .populate({path: ["User", "Post"]})
            .sort({DateOfCreation: -1});
            res.status(StatusCodes.OK).json({ count: comments.length, comments });
        }
        
    }
    else
    {
        if(page)
        {
            const skip = (page -1) * limit;
            const comments = await Comment.find()
            .skip(skip)
            .limit(limit)
            .populate({path: ["User", "Post"]})
            .sort({DateOfCreation: 1});
            res.status(StatusCodes.OK).json({ count: comments.length, comments });
        }
        else
        {
            const comments = await Comment.find()
            .populate({path: ["User", "Post"]})
            .sort({DateOfCreation: 1});
            res.status(StatusCodes.OK).json({ count: comments.length, comments });
        }
       
    }
};

//Filter Comments by User or by Post
// pagination with number of page and limit
FilterComment = async (req, res) => {
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
                console.log(eltId)
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
    GetAllComments,
}