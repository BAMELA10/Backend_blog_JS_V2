const jwt = require('jsonwebtoken');
const UnAuthenticationError = require('../error/UnAuthentication');

const IsValidToken =  (token) => jwt.verify(token, process.env.JWT_SECRET);

const CreateJWT = (payload) => {
    const token = jwt.sign(payload , process.env.JWT_SECRET , { expiresIn: process.env.JWT_LIFETIME });
    return token 
};

const CheckPermission = (user) => {
    if(role !== "admin" || !role ) return;
    throw new UnAuthenticationError('Access denied: You are not authorized to access this resource');
};

const AttachCookieResponse = (res, user) => {
    const token = CreateJWT(user);
    const TwoDay = 1000 * 60 * 60 * 48;
    res.cookie('token', token, {
        name: 'SecureSession',
        httpOnly: true,
        expires: new Date(Date.now() + TwoDay),
        secure: process.env.NODE_ENV,
        signed: true,
    })
};

module.exports = {IsValidToken, AttachCookieResponse, CheckPermission, CreateJWT};