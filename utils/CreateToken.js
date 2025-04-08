const CreateTokenUser = (user) => {
    return { username: user.email, userId: user._id, role: user.Role };
};
  
module.exports = CreateTokenUser; 