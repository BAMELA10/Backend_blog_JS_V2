const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    id: Schema.Types.ObjectId,
    title: {
        type: String,
        required: true,
        length: 50
    },
    content: {
        type: String,
        required: true,
        length: 500,
    },
    Image: {
        type: String,
        required: false
    },
    User: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    DateOfCreation: {
        type: Date,
    },
    LastUpdate: {
        type: Date,
        default: Date.now,
    }

});

//put the date of creation before the save
PostSchema.pre("save", function( next) {
    this.DateOfCreation = Date.now();
    next()
});


//put the date of last update before the update
PostSchema.pre("update", function (next) {
    this.LastUpdate = Date.now();
    next()
});
const Post = mongoose.model("Post", PostSchema);

module.exports = Post;