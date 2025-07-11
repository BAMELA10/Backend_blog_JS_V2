const Post = require("../models/Post");
const StatusCodes = require("http-status-codes");
const {
    BadRequestError,
    NotFoundError,
} = require('../error');

const {
    CheckSort
} = require('../utils');


//Get All Posts
// pagination with number of page and limit
const GetAllPost = async (req, res) => {
    const sort = req.query.sort; //list of attributes to sort
    const desc = req.query.desc; //list of attributes to sort in descending order
    const page = req.query.page;
    const limit = req.query.limit || 10;
    const props =['title','DateOfCreation', 'LastUpdate'];
    
    const { stringSort, stringDesc } = CheckSort(sort, desc, props);

    if (page)
    {
        const skip = (page - 1) * limit;
        if(stringSort || stringDesc)
        {
            let separator = stringSort && stringDesc ? " " : "" ;
            const posts = await Post.find().skip(skip).limit(limit).sort( stringSort + separator + stringDesc);
            res.status(StatusCodes.OK).json({ count: posts.length, posts: posts });
        }
        else
        {
            const posts = await Post.find().skip(skip).limit(limit);
            res.status(StatusCodes.OK).json({ count: posts.length, posts: posts });
        }

    }
    else
    {
        if(stringSort || stringDesc)
        {
            let separator = stringSort && stringDesc ? " " : "" ;
            const posts = await Post.find().sort( stringSort + separator + stringDesc);
            res.status(StatusCodes.OK).json({ count: posts.length, posts: posts });
        }
        else
        {
            const posts = await Post.find();
            res.status(StatusCodes.OK).json({ count: posts.length, posts: posts });
        }
    }

    

   

};

//Get All Post's online User
// pagination with number of page and limit
const GetPostForOnlineAuthor = async (req, res) => {
    const User = req.user;
    const page = req.query.page;
    const limit = req.query.limit || 10;

    if(page)
    {
        const skip = (page - 1) * limit;
        const posts = await Post.find({User: User.userId}).skip(skip).limit(limit);
        res.status(StatusCodes.OK).json({ count: posts.length, posts: posts });
    }
    else
    {
        const posts = await Post.find({User: User.userId});
        res.status(StatusCodes.OK).json({ count: posts.length, posts: posts });
    }
    
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
//sorting Post with the date of creation, Last Update, Title
//Filtering Post with the title, author
// pagination with number of page and limit
const FilteringPost = async (req, res) => {
    const title = req.query.title? req.query.title : "";
    const author = req.query.author? req.query.author : "";
    const page = req.query.page;
    const limit = req.query.limit || 10;

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