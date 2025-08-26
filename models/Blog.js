const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
    Id: {types: Schema.Types.ObjectId},
    Name: {
        types: String,
    },
    Author : {
        types: Schema.Types.ObjectId,
        ref : "User"
    },
    DateOfUpdate: {
        types : Date,
        default: Date.now()
    },
    DateOfCreation: {
        types : Date,
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
