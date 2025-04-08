const express = require("express");
const router = express.Router();

const {
    AuthMiddleware,
    AuhtorizationMiddleware
} = require('../middleware/Auth');

const {
    GetAllUser, 
    GetSingleUser,
    GetCurrentUser,
    UpdateUser,
    UpdatePassword,
} = require('../controller/UserController');

router
.route('/me')
.get(AuthMiddleware, GetCurrentUser)
.put(AuthMiddleware, UpdatePassword)

router.route('/').get([AuthMiddleware, AuhtorizationMiddleware(["admin"])], GetAllUser);
router
.route('/:id')
.get([AuthMiddleware, AuhtorizationMiddleware(["admin"])],  GetSingleUser)
.put([AuthMiddleware, AuhtorizationMiddleware(["admin"])],  UpdateUser)

module.exports = router;
