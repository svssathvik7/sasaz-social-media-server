const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
    userPosted: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    imageUrl: {
        type: String
    },
    postText: {
        type: String
    },
    caption: {
        type: String,
        required
    },
    postTime: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Number,
        default: 0,
        required
    },
    comments: {
        type: [String],
        default: [],
        required
    }
});

const postModel = new mongoose.model('posts', postSchema);
export default postModel;