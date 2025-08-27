const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
    Id: {type: Schema.Types.ObjectId},
    Name: {
        type: String,
    },
    Author : {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    DateOfUpdate: {
        type: Date,
        default: Date.now()
    },
    DateOfCreation: {
        type: Date,
    },
},
{
    virtuals:{
        Url:{
            type:String,
            get() {
                return "https://" + this.Name + ".localhost.com";
            }
        }
    }
})

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog;
