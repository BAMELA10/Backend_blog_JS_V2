const User = require('../models/User');
const {
    CreateTokenUser,
    AttachCookieResponse,
    CheckPermission,
    IsValidToken,
    CreateJWT
} = require('../utils');

const { StatusCodes } = require ('http-status-codes');
const {
    BadRequestError,
    NotFoundError,
    UnAuthenticationError,
    CustomError,
    UnauthorizedError
} = require('../error');


// Register User
const RegisterUser = async (req, res) => {
    const { name, email, password} = req.body;

    // find if email alredy exist in Data
    const IsMatch = await User.findOne({email});
    if(IsMatch){
        throw new BadRequestError("Email already exists");
    };

    // Put the Admin role if it's the first Account
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const Role = isFirstAccount ? 'admin' : 'user';

    //Create new user
    const user = await User.create({ name, email, password, Role});
    // Get the printable data of user
    const userToken = CreateTokenUser(user);
    AttachCookieResponse(res, userToken);

    res.status(StatusCodes.CREATED).json({user: userToken});

};

// Login User
const LoginUser = async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        throw new BadRequestError("Please provide email and password");
    };

    // Find User for login
    const user = await User.findOne({email});
    if(!user) {
        throw new UnAuthenticationError('Invalid Credentials');
    };

    //Compare password for agree the login
    const isCorrectPassword = await user.ComparePassword(password);
    //if it's not correct password
    if (!isCorrectPassword) {
        throw new UnAuthenticationError('Invalid Credentials');
    };

    const userToken = CreateTokenUser(user);
    AttachCookieResponse(res, userToken);

    res.status(StatusCodes.OK).json({user: userToken});
};

// logout User
const LogoutUser = async (req, res) => {
    //Destruct the Token and put the expiration of cookies at Date.now + 1 second
    res.cookie('token', 'logout', {
        httpOnly:true,
        expires: new Date(Date.now() + 1000),
    });
    res.status(StatusCodes.OK).json({msg: "User logged out!"})
};

module.exports = {
    LoginUser,
    RegisterUser,
    LogoutUser
}