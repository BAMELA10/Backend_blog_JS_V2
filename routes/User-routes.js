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
    FilterUser
} = require('../controller/UserController');
const Caching = require("../middleware/Caching");

router
.route('/me')
.get([AuthMiddleware], GetCurrentUser)
.put(AuthMiddleware, UpdatePassword)

router.route("/search")
.get([AuthMiddleware, AuhtorizationMiddleware(["admin"]), Caching], FilterUser);

router.route('/').get([AuthMiddleware, AuhtorizationMiddleware(["admin"])], GetAllUser);
router
.route('/:id')
.get([AuthMiddleware, AuhtorizationMiddleware(["admin"]), Caching],  GetSingleUser)
.put([AuthMiddleware, AuhtorizationMiddleware(["admin"])],  UpdateUser)

module.exports = router;
