const User = require('../models/User');
const {
    CreateTokenUser,
    AttachCookieResponse,
    CheckPermission,
    IsValidToken
} = require('../utils');

const { StatusCodes } = require ('http-status-codes');
const {
    BadRequestError,
    NotFoundError,
    UnAuthenticationError,
    CustomError,
    UnauthorizedError
} = require('../error');

// Get All User
const GetAllUser = async (req, res) => {
    //Get all user with the role = user
    const CurrentUser = req.user;
    if (!CurrentUser) {
        throw new UnAuthenticationError("Authentication Invalid");
    }
    const user = await User.find({Role: "user"});
    res.status(StatusCodes.OK).json({users: user});
};
// Get Single User
const GetSingleUser = async (req, res) => {
    
    // get the Id of user
    const userId = req.params.id;

    const CurrentUser = req.user;
    if (!CurrentUser) {
        throw new UnAuthenticationError("Authentication Invalid");
    }
    // get user with his Id
    const user = await User.find({_id: userId});

    // user do not found
    if(!user)
    {
        throw new NotFoundError(`No user with id: ${userId}`);
    }
    // respose if user is found
    res.status(StatusCodes.OK).json({user: user});
};
// Get Current User
const GetCurrentUser = async (req, res) => {
    //Get current user is online
    const CurrentUser = req.user;
    if (!CurrentUser) {
        throw new UnAuthenticationError("Authentication Invalid");
    }
    res.status(StatusCodes.OK).json({users: CurrentUser});
};
// Update User
const UpdateUser = async (req, res) => {
    //get the data entry of user update
    const {name, email} = req.body;

    // check the entry of user
    if(!name && !email){
        throw new BadRequestError("Please provide all values");
    };
    // find the I would like update
    const user = await User.findByIdAndUpdate(req.params.id, { name, email }, {new: true});

    // user do not found
    if(!user){
        throw new NotFoundError(" User Not Found");
    };

    // Get the printable data of user

    //AttachCookieResponse(res, TokenUser);
    
    //response with the printable data of user
    res.status(StatusCodes.OK).json({user: user});

};
// Update password
const UpdatePassword = async (req, res) => {
    // get the old and the new password
    const {oldPassword, NewPassword} = req.body;

    if(!oldPassword || !NewPassword){
        throw new BadRequestError("Please provide all values");
    };
    // find the current User
    const user = await User.findById(req.user.userId);

    // Compare old password is provided with the current password in Database
    const isCorrectPassword = await user.ComparePassword(oldPassword);

    // if it's not correct password
    if(!isCorrectPassword){
        throw new BadRequestError(" Current password doesn't match");
    };

    //Change password
    user.password = NewPassword;
    //save the user data
    await user.save();
    res.status(StatusCodes.OK).json({ msg: 'Success! Password Updated.'});
};

module.exports = {
    GetAllUser,
    GetSingleUser,
    GetCurrentUser,
    UpdateUser,
    UpdatePassword,
}