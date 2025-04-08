const Post = require("../models/Post");
const StatusCodes = require("http-status-codes");
const {
    BadRequestError,
    NotFoundError,
    UnAuthenticationError,
    CustomError,
    UnauthorizedError
} = require('../error');

const {
    CreateTokenUser,
    AttachCookieResponse,
    CheckPermission,
    IsValidToken,
    CreateJWT
} = require('../utils');


//Get All Posts

const GetAllPost = async (req, res) => {
    const posts = await Post.find();

    res.status(StatusCodes.OK).json({ count: posts.length, posts: posts });

};
//Get All Post's online User
const GetPostForOnlineAuthor = async (req, res) => {
    const User = req.user;
    const posts = await Post.find({User: User.userId});
    res.status(StatusCodes.OK).json({ count: posts.length, posts: posts });

};
//Get Single post
const GetSinglePost = async (req, res) => {
    const PostId = req.params.id;
    const posts = await Post.findById(PostId);
    res.status(StatusCodes.OK).json({ count: posts.length, posts: posts });

}
//Create a New post
const NewPost = async (req, res) => {
    const { title, content, Image  } = req.body;
    const User = req.user.userId;
    
    if(!title || !content)
    {
        throw new BadRequestError("Please Title and Content are fields")
    };

    const post = await Post.create({title, content, Image, User});
    console.log("hello 2 ");
    res.status(StatusCodes.CREATED).json({post: post });

}
//Update Post
const UpdatePost = async (req, res) => {
    const { title, content, Image  } = req.body;
    const PostId = req.params.id;

    if(!title && !content)
    {
        throw new BadRequestError("Please Title and Content are fields")
    };
    let post;
    try
    {
        post = await Post.findByIdAndUpdate(PostId, {title , content, Image}, {new: true});

    }catch(error)
    {
        throw new NotFoundError(" Items with id : ${PostId} is not found");
    }
    
    res.status(StatusCodes.OK).json({post: post});

}
//Delete Post
const DeletePost = async (req, res) => {
    const PostId = req.params.id;
    try
    {
        await Post.findOneAndDelete({_id: PostId});
    }catch(error)
    {
        throw new NotFoundError(" Items with id : ${PostId} is not found");
    }

    res.status(StatusCodes.OK).json({post: "Post Deleted Successfully" });
}
//filter Post for the end of main feature of API

module.exports =  {
    DeletePost, 
    NewPost, 
    UpdatePost, 
    GetSinglePost, 
    GetPostForOnlineAuthor, 
    GetAllPost}