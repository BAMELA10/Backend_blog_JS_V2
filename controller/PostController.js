const Post = require("../models/Post");
const Blog = require("../models/Blog"); 
const StatusCodes = require("http-status-codes");
const {Types} = require("mongoose")
const {
    BadRequestError,
    NotFoundError,
    UnauthorizedError
} = require('../error');

const {
    CheckSort
} = require('../utils');


//Get All Posts
// pagination with number of page and limit
const GetAllPost = async (req, res) => {
    const blogId = req.params.id
    const sort = req.query.sort; //list of attributes to sort
    const desc = req.query.desc; //list of attributes to sort in descending order
    const page = req.query.page;
    const limit = req.query.limit || 10;
    const props =['title','DateOfCreation', 'LastUpdate'];

    if(!blogId)
    {
        throw new BadRequestError("Please blogId is required")
    };
    
    const { stringSort, stringDesc } = CheckSort(sort, desc, props);

    if (page)
    {
        const skip = (page - 1) * limit;
        if(stringSort || stringDesc)
        {
            let separator = stringSort && stringDesc ? " " : "" ;
            const posts = await Post.find({Blog:blogId})
            .populate([
                { path:"Blog", select:"Name Url", match:{_id:Types.ObjectId.createFromHexString(blogId)}},
                { path:"Author", select:"fullname email"}
            ]).skip(skip).limit(limit).sort( stringSort + separator + stringDesc);
            res.status(StatusCodes.OK).json({ count: posts.length, posts: posts });
        }
        else
        {
            const posts = await Post.find({ Blog:blogId})
            .populate([
                { path:"Blog", select:"Name Url", match:{_id:Types.ObjectId.createFromHexString(blogId)}},
                { path:"Author", select:"fullname email"}
            ]).skip(skip).limit(limit);
            res.status(StatusCodes.OK).json({ count: posts.length, posts: posts });
        }

    }
    else
    {
        if(stringSort || stringDesc)
        {
            let separator = stringSort && stringDesc ? " " : "" ;
            const posts = await Post.find({ Blog:blogId})
            .populate([
                { path:"Blog", select:"Name Url", match:{_id:Types.ObjectId.createFromHexString(blogId)}},
                { path:"Author", select:"fullname email"}
            ]).sort( stringSort + separator + stringDesc);
            res.status(StatusCodes.OK).json({ count: posts.length, posts: posts });
        }
        else
        {
            const posts = await Post.find({ Blog:blogId})
            .populate([
                { path:"Blog", select:"Name Url", match:{_id:Types.ObjectId.createFromHexString(blogId)}},
                { path:"Author", select:"fullname email"}
            ]);
            res.status(StatusCodes.OK).json({ count: posts.length, posts: posts });
        }
    }
};
//Get All Post's online User
// pagination with number of page and limit
const GetPostForOnlineAuthor = async (req, res) => {
    const blogId = req.params.id
    const User = req.user;
    const page = req.query.page;
    const limit = req.query.limit || 10;

    if(!blogId)
    {
        throw new BadRequestError("Please blogId is required")
    };


    if(page)
    {
        const skip = (page - 1) * limit;
        const posts = await Post.find({ Blog:blogId}).populate([
                { path:"Blog", select:"Name Url", match:{_id:Types.ObjectId.createFromHexString(blogId)}},
                { path:"Author", select:"fullname email", match:{Author: User.userId}}
        ]).skip(skip).limit(limit);
        res.status(StatusCodes.OK).json({ count: posts.length, posts: posts });
    }
    else
    {
        const posts = await Post.find({Blog:blogId}).populate([
                { path:"Blog", select:"Name Url", match:{_id:Types.ObjectId.createFromHexString(blogId)}},
                { path:"Author", select:"fullname email", match:{Author: User.userId}}
        ]);
        res.status(StatusCodes.OK).json({ count: posts.length, posts: posts });
    }
    
};
//Get Single post
const GetSinglePost = async (req, res) => {
    const blogId = req.params.id
    const PostId = req.params.postid;
    if(!blogId || !PostId)
    {
        throw new BadRequestError("Please blogId and ContentId are required");
    };

    const post = await Post.findById(PostId).populate([
        { path:"Blog", select:"Name Url", match:{_id:Types.ObjectId.createFromHexString(blogId)}},
        { path:"Author", select:"fullname email"}
    ]);

    if(!post) {
        throw new BadRequestError(`Items with postId : ${PostId} is not found`)
    }
    res.status(StatusCodes.OK).json({posts: post });

}
//Create a New post
const NewPost = async (req, res) => {
    const blogId = req.params.id
    const { title, content, Image  } = req.body;
    const User = req.user.userId;
    
    if(!title || !content)
    {
        throw new BadRequestError("Please Title and Content are fields")
    };

    const currentBlog = await Blog.findById(blogId);
    if(!currentBlog) {
        throw new BadRequestError("Blog with ${id} doesn't exist check id");
    }

    //check if the current user is the owner of the blog.
    if(currentBlog.Author.toString() !== User)
    {
        throw new UnauthorizedError("You are Not Authorized to apply this action.This Blog is not youn own");
    }

    const post = await Post.create({title:title, content:content, Image:Image, Author:User, Blog: blogId});
    res.status(StatusCodes.CREATED).json({post: post });

}
//Update Post
const UpdatePost = async (req, res) => {
    const blogId = req.params.id;
    const { title, content, Image  } = req.body;
    const PostId = req.params.postid;
    const User = req.user.userId;

    if(!title || !content)
    {
        throw new BadRequestError("Please Title and Content are fields")
    };

    const currentBlog = await Blog.findById(blogId);

    //check if the current user is the owner of the blog.
    if(currentBlog.Author.toString() !== User)
    {
        throw new UnauthorizedError("You are Not Authorized to apply this action.This Blog is not youn own");
    }
    let post;
    try
    {
        post = await Post.findByIdAndUpdate(PostId, {title , content, Image}, {new: true});

    }catch(error)
    {
        throw new NotFoundError(`Items with postid : ${PostId} is not found`);
    }
    
    post = await Post.findById(PostId).populate([
        { path:"Blog", select:"Name Url", match:{_id:Types.ObjectId.createFromHexString(blogId)}},
        { path:"Author", select:"fullname email"}
    ]);
    res.status(StatusCodes.OK).json({post: post});

}
//Delete Post
const DeletePost = async (req, res) => {
    const blogId = req.params.id;
    const PostId = req.params.postid;
    const User = req.user.userId;

    const currentBlog = await Blog.findById(blogId);

    //check if the current user is the owner of the blog.
    if(currentBlog.Author.toString() !== User)
    {
        throw new UnauthorizedError("You are Not Authorized to apply this action. This Blog is not youn own");
    }

    try
    {
        await Post.findOneAndDelete({_id: PostId});
    }catch(error)
    {
        throw new BadRequestError(`Items with postid : ${PostId} is not found`);
    }

    res.status(StatusCodes.OK).json({post: "Post Deleted Successfully" });
}


//filter Post for the end of main feature of API
//sorting Post with the date of creation, Last Update, Title
//Filtering Post with the title, author
// pagination with number of page and limit
const FilteringPost = async (req, res) => {
    const title = req.query.title? req.query.title : "";
    const author = req.query.author? req.query.author : "";
    const page = req.query.page;
    const limit = req.query.limit || 10;
    const blogId = req.params.id
    
    if(!blogId)
    {
        throw new BadRequestError("Please blogId is required")
    };

    if(!title && !author){
        throw new BadRequestError(" Invalid filtering. Check property for filter");
    };

    let result = "";

    if(page)
    {
        const skip = (page - 1) * limit;
        result = await Post.find()
        .or(
            { title: new RegExp("^" + title, "i")},
        )
        .populate({
            path: "User",
            match:{ 
                $or: [
                    { "name.first": new RegExp("^" + author, "i") },
                    { "name.last": new RegExp("^" + author, "i") }
                ]
            },
        })
        .populate({
            path:"Blog", select:"name Url", match:{id:blogId}
        })
        .skip(skip)
        .limit(limit)
        .sort({DateOfCreation: 1});
    }
    else 
    {
        result = await Post.find()
        .or(
            { title: new RegExp("^" + title, "i")},
        )
        .populate({
            path: "User",
            match:{ 
                $or: [
                    { "name.first": new RegExp("^" + author, "i") },
                    { "name.last": new RegExp("^" + author, "i") }
                ]
            },
        })
        .populate({
            path:"Blog", select:"name Url", match:{id:blogId}
        })
        .sort({DateOfCreation: 1});
    }

    const posts = result.filter(post => post.User !== null);
    res.status(StatusCodes.OK).json({ count: posts.length, posts: posts });
    
}

module.exports =  {
    DeletePost, 
    NewPost, 
    UpdatePost, 
    GetSinglePost, 
    GetPostForOnlineAuthor, 
    GetAllPost,
    FilteringPost,
}