const User = require('../models/User');

const { StatusCodes } = require ('http-status-codes');
const {
    BadRequestError,
    NotFoundError,
    UnAuthenticationError,
} = require('../error');
const {CheckSort} = require("../utils")

// Get All User
// pagination with number of page and limit
const GetAllUser = async (req, res) => {
    //Get all user with the role = user
    const CurrentUser = req.user;
    const sort = req.query.sort; //list of attributes to sort in ascending
    const desc = req.query.desc; //list of attributes to sort in descending order
    const page = req.query.page;
    const limit = req.query.limit || 10;
    const allProps = Object.keys(User.schema.paths);
    const props = allProps.filter(p => p !== '_id' && p !== '__v');

    if (!CurrentUser) {
        throw new UnAuthenticationError("Authentication Invalid");
    }
    const { stringSort, stringDesc } = CheckSort(sort, desc, props);

    if(stringSort || stringDesc)
    {
        let separator = stringSort && stringDesc ? " " : "" ;
        let sortCondition = stringSort + separator + stringDesc
        if(page){
            const skip = page -1;
            const user = await User.find({Role: "user"})
            .skip(skip)
            .limit(limit)
            .sort(sortCondition)
            res.status(StatusCodes.OK).json({count:user.length, users: user});
        }
        else
        {
            const user = await User.find({Role: "user"}).sort(sortCondition);
            res.status(StatusCodes.OK).json({count:user.length, users: user});
        }
        
    }
    else
    {
        if(page)
        {
            let skip = page - 1; 
            const user = await User.find({Role: "user"}).skip(skip).limit(limit);
            res.status(StatusCodes.OK).json({count:user.length, users: user});
        }
        else
        {
            const user = await User.find({Role: "user"});
            res.status(StatusCodes.OK).json({count:user.length, users: user});
        }
        
    }
    
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

//filtering User with email, role, first name, last name
// pagination with number of page and limit
const FilterUser = async (req, res) => {
    const email = req.query.email;
    const role = req.query.role;
    const firstname = req.query.firstname;
    const lastname = req.query.lastname;
    const sort = req.query.sort; //list of attributes to sort
    const desc = req.query.desc; //list of attributes to sort in descending order
    const page = req.query.page;
    const limit = req.query.limit || 10;

    const CurrentUser = req.user;

    const allProps = Object.keys(User.schema.paths);
    const props = allProps.filter(p => p !== '_id' && p !== '__v');

    if (!CurrentUser) {
        throw new UnAuthenticationError("Authentication Invalid");
    }
    const { stringSort, stringDesc } = CheckSort(sort, desc, props);

    if(!email && !role && !firstname && !lastname){
        throw new BadRequestError(" Invalid filtering. Check property for filter");
    };

    if(stringSort || stringDesc)
    {
        let separator = stringSort && stringDesc ? " " : "" ;
        
        if(page)
        {
            const skip = page -1;
            const result = await User.find()
            .or([
                {email: new RegExp("^"+ email, "i")},
                {Role: new RegExp("^"+ role, "i")},
                {'name.first': new RegExp("^"+ firstname, "i")},
                {'name.last': new RegExp("^"+ lastname, "i")}]).sort( stringSort + separator + stringDesc)
            .skip(skip)
            .limit(limit);
            res.status(StatusCodes.OK).json({count: result.length, users: result});
        }
        else
        {
            const result = await User.find()
            .or([
                {email: new RegExp("^"+ email, "i")},
                {Role: new RegExp("^"+ role, "i")},
                {'name.first': new RegExp("^"+ firstname, "i")},
                {'name.last': new RegExp("^"+ lastname, "i")}]).sort( stringSort + separator + stringDesc);
            res.status(StatusCodes.OK).json({count: result.length, users: result});
        }
        
    }
    else
    {
        if(page)
        {
            const skip = page -1;
            const result = await User.find()
            .or([
                {email: new RegExp("^"+ email, "i")},
                {Role: new RegExp("^"+ role, "i")},
                {'name.first': new RegExp("^"+ firstname, "i")},
                {'name.last': new RegExp("^"+ lastname, "i")}])
            .skip(skip)
            .limit(limit)
            .sort({DateOfJoined: 1});
            res.status(StatusCodes.OK).json({count: result.length, users: result});
        }
        else
        {
            const result = await User.find()
            .or([
                {email: new RegExp("^"+ email, "i")},
                {Role: new RegExp("^"+ role, "i")},
                {'name.first': new RegExp("^"+ firstname, "i")},
                {'name.last': new RegExp("^"+ lastname, "i")}])
            .sort({DateOfJoined: 1});
            res.status(StatusCodes.OK).json({count: result.length, users: result});
        }
        
    }


}

module.exports = {
    GetAllUser,
    GetSingleUser,
    GetCurrentUser,
    UpdateUser,
    UpdatePassword,
    FilterUser
}