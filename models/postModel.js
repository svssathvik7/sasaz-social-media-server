const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
    userPosted: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    userName: {
        type: String,
    },
    imageUrl: {
        type: String
    },
    category: {
        type: String,
        required: true
    },
    postText: {
        type: String
    },
    caption: {
        type: String,
        required: true
    },
    postTime: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Number,
        default: 0
    },
    usersLiked: [String],
    comments: [
        {
            comment: {
                type: String
            },
            userCommented: {
                type: String
            },
            replies: [
                {
                    reply: String,
                    userReplied: String,
                    name: String,
                    dp: String
                }
            ],
            likes: {
                type: Number
            },
            usersLiked: [String],
            dp: {
                type: String
            }
        }
    ]
});

const postModel = new mongoose.model('posts', postSchema);
module.exports = postModel;