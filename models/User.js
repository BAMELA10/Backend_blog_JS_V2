const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    id: {type : Schema.Types.ObjectId },
    name :{
        first : {
            type: String,
            required: false,
            length: 20
        },
        last : {
            type: String,
            required: true,
            length: 20
        }
    },
    
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        length: 20
    },
    Role: {
        type: String,
        required: true,
        enum: ["admin", "user"],
        default: "user"
    },
    DateOfJoined: {
        type: Date,
    }
},
{
    virtuals:{
        fullname:{
            type:String,
            get() {
                //const number = Math.floor(Math.random() * 1000);
                return this.name.first + " " + this.name.last;
            }
        }
    }
})



UserSchema.pre('save', async function(next) {
    let user = this;
    //put the date of creation before the save
    user.DateOfJoined = Date.now();
    //const Exp = new RegExp("[a-z-0-9]@[a-z-0-9].[a-z]","s");
    /* if (!new RegExp().test(user.email)){
        throw new mongoose.Error.ValidationError()
    } */
    
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash
    next()
    //await bcrypt.hash(user.password, 10, (err, hash) => user.password = hash );
});

UserSchema.methods.ComparePassword = async function (password) {
    let user = this;
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;