const express = require("express");
const { UnAuthenticationError, UnauthorizedError, BadRequestError } = require("../error");
const { StatusCodes } = require("http-status-codes");
const Blog = require("../models/Blog");


//Create a New Blog
const createBlog = async (req, res) => {
    const name = req.body.name;
    const author = req.user.userId;
    const dateOfCreation = Date.now();

    if (!name || name.length === 0)
    {
        throw new BadRequestError("Invalid input Data check your inputs")
    }
    const post = await Blog.create({Name:name, Author:author, DateOfCreation:dateOfCreation});

    return res.status(StatusCodes.CREATED).json(post);

};
const updateBlog = async (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const author = req.user.userId;

    if (!id)
    {
        throw new BadRequestError("Id of Blog is required")
    };
    
    if (!name || name.length === 0)
    {
        throw new BadRequestError("Invalid input Data check your inputs")
    };
    
    let CurrentBlog = await Blog.findById(id);
    
    if(!CurrentBlog){
        throw new BadRequestError("Element ${id} doesn't exist check id");
    }
    
    //Check if Current User is the author of blog
    if(CurrentBlog.Author.toString() !== author){
        throw new UnauthorizedError("You are Not Authorized to Update this ressource");
    }

    await Blog.findByIdAndUpdate(id, {Name:name});
    CurrentBlog = await Blog.findById(id);

    res.status(StatusCodes.OK).json({result : CurrentBlog})



};
const deleteBlog = async (req, res) => {
    const id = req.params.id;
    const author = req.user.userId;
    
    if (!id)
    {
        throw new BadRequestError("Id of Blog is required")
    };
    
    const CurrentBlog = await Blog.findById(id);
    
    if(!CurrentBlog){
        throw new BadRequestError(`Element  doesn't exist check id`);
    }

    //Check if Current User is the author of blog
    if(CurrentBlog.Author.toString() !== author){
        throw new UnauthorizedError("You are Not Authorized to Delete this ressource");
    }

    await Blog.findByIdAndDelete(id);

    res.status(StatusCodes.OK).json({result : `${id} is deleted successfuly`})
};

const getBlogById = async (req, res) => {
    const id = req.params.id;
    if (!id)
    {
        throw new BadRequestError("Id of Blog is required")
    };
    
    const result = await Blog.findById(id);
    res.status(StatusCodes.OK).json({result : result})
};
const getAllBlogsByOnlineUser = async (req, res) => {
    const author = req.user.userId;
    const result = await Blog.find({Author:author});
    res.status(StatusCodes.OK).json({result : result})

};

module.exports = {
    createBlog,
    updateBlog,
    deleteBlog,
    getBlogById,
    getAllBlogsByOnlineUser
}