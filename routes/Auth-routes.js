const express = require("express");
const router = express.Router();
const {
    LoginUser,
    RegisterUser,
    LogoutUser
} = require("../controller/AuthController");



router.post('/register', RegisterUser);
router.post('/login', LoginUser);
router.get('/logout', LogoutUser);

module.exports = router;