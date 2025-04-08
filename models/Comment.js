const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    id: Schema.Types.ObjectId,
    content: {
        type: String,
        required: true,
        length: 500
    },
    User: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    Post: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    },
    DateOfCreation: {
        type: Date,
        default: Date.now,
    },
});

//put the date of creation before the save
CommentSchema.pre("save", function(next) {
    this.DateOfCreation = Date.now;
    next()
});


const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
