const express = require('express');
const UnAuthenticationError = require('../error/UnAuthentication');
const { IsValidToken } = require('../utils');

const AuthMiddleware = (req, res, next) => {
    let token;
    // Get token to header Authorization
    const authHeader = req.header.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
        token = authHeader.split(' ')[1];
    }
     // check cookies
    else if (req.signedCookies) {
        token = req.signedCookies.token;
    }
    if (!token) {
        throw new UnAuthenticationError('Access denied : You are not authenticated');
    };

    try {

        const payload = IsValidToken(token);
        req.user = {
            userId: payload.userId,
            Role: payload.role
        }
        next()
    
    } catch (error) {
        throw new UnAuthenticationError('Access denied : You are not authenticated');
    }
    
};

const AuhtorizationMiddleware = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.Role)) {
            throw new UnAuthenticationError('Access denied: You are not authorized to access');
        };
        next();
    }
    
   
};

module.exports = {AuthMiddleware, AuhtorizationMiddleware};