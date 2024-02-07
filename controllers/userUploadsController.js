const userModel = require("../models/userModel");
const postModel = require("../models/postModel");
const jwt = require("jsonwebtoken");


async function userPost(req, res) {
    const { imageurl, postText, email, caption, category } = req.body;
    try {
        const user = await userModel.findOne({ email: email });
        if (user) {
            const newPost = new postModel({
                userPosted: user,
                imageUrl: imageurl,
                postText: postText,
                caption: caption,
                category: category,
                likes: 0,
                usersLiked: [],
                comments: [],
            })
            newPost.save();
            await userModel.updateOne({ email: email }, { $push: { posts: newPost } });
            res.json({ message: "Uploaded Post", status: true });
        }
        else {
            res.json({ message: "User Not Found, Please Log in again...", status: false })
        }
    }
    catch (err) {
        res.json({ message: "There is some issue! Please Try Again...", status: false });
    }
}
async function userComment(req, res) {
    try {
        const { pId, comment, name, dp } = req.body;
        await postModel.updateOne({ _id: pId }, { $push: { comments: { comment: comment, userCommented: name.trim(), likes: 0, replies: [], usersLiked: [], dp: dp } } });
        const posts = await postModel.findOne({ _id: pId });
        const newComment = posts.comments[posts.comments.length - 1];
        res.json({ message: "Commented on the post", status: true, newComment: newComment });
    }
    catch (err) {
        console.log(err.message);
        res.json({ message: "There is some issue! Please Try Again...", status: false });
    }
}

async function userReplyToComment(req, res) {
    try {
        const { pId, cId, reply, email, name, dp } = req.body;
        await postModel.findOneAndUpdate(
            { _id: pId, 'comments._id': cId },
            { $push: { 'comments.$.replies': { reply: reply, userReplied: email, name: name, dp: dp } } },
            { new: true }
        );
        const replyObject = {
            reply: reply,
            name: name,
            dp: dp
        }
        res.json({ message: "Replied to the comment", status: true, reply: replyObject });
    }
    catch (err) {
        console.log(err.message);
        res.json({ message: "There is some issue! Please Try Again...", status: false });
    }
}

async function userLike(req, res) {
    try {
        const { pId, email, cId, comment } = req.body;
        const options = { new: true };
        if (pId && cId) {
            const postCommentLikes = await postModel.findOne({ _id: pId });
            const verify = postCommentLikes.comments.find((ele) => ele.id === cId).usersLiked.find((users) => users === email);
            const update = !verify ? { $inc: { 'comments.$.likes': 1 }, $push: { 'comments.$.usersLiked': email } } : { $inc: { 'comments.$.likes': -1 }, $pull: { 'comments.$.usersLiked': email } };
            const filter = { _id: pId, 'comments._id': cId };
            const updatedPost = await postModel.findOneAndUpdate(filter, update, options);
            const commentLikes = updatedPost.comments.find((ele) => ele.id === cId);
            if (!verify) {
                res.json({ message: "Liked the Comment", status: true, likedComment: commentLikes });
            }
            else {
                res.json({ message: "DisLiked the Comment", status: false, likedComment: commentLikes });
            }
        }
        else if (!comment) {
            const post = await postModel.findOne({ _id: pId, 'usersLiked': email });
            const filter = { _id: pId };
            const update = !post ? { $inc: { likes: 1 }, $push: { usersLiked: email } } : { $inc: { likes: -1 }, $pull: { usersLiked: email } };
            const updatedPost = await postModel.findOneAndUpdate(filter, update, options);
            if (!post) {
                res.json({ message: "Liked the Post", status: true, likes: updatedPost.likes });
            }
            else {
                res.json({ message: "DisLiked the Post", status: false, likes: updatedPost.likes });
            }
        }
        else {
            res.json({ message: "There is some error Please Try after some time", status: false });
        }
    }
    catch (err) {
        console.log(err.message);
        res.json({ message: "There is some issue! Please Try Again...", status: false });
    }
}
async function getAllUserDetails(req, res) {
    try {
        const users = await userModel.find({});
        res.json({ message: "Successfully fecthed all the users.", status: true, users: users });
    } catch (error) {
        console.log(error);
        res.json({ message: "There is some issue! Please Try Again...", status: false });
    }
}
async function getUserDetails(req, res) {
    const { token } = req.body;
    const decodedToken = jwt.decode(token, "ThisIsSaSazSecret");
    const userDetails = await userModel.findOne({ email: decodedToken.email }).populate("posts savedPosts").populate("friends").populate({
        path : 'savedPosts',
        populate : {
            path : "userPosted"
        }
    });
    res.json({ message: "User Details Fetched", userDetails: userDetails });
}

async function getUserPosts(req, res) {
    const { email } = req.body;
    try {
        const userMatch = await userModel.findOne({ email: email }).populate("posts").populate("userPosted");
        if (userMatch) {
            res.json({ message: "Success", posts: userMatch.posts });
        }
        else {
            res.json({ message: "User not found", posts: false });
        }
    }
    catch (error) {
        res.json({ message: "Failed to retreive posts!", posts: false });
    }
}
async function getAllUserPosts(req, res) {
    const data = await postModel.find({});
    res.json({ message: "Sent all posts", posts: data });
}

async function manageUserFrnds(req, res) {
    try {
        const { fId, email } = req.body;
        const frndUser = await userModel.findOne({ email: email, 'friends': fId });
        if (frndUser) {
            //Remove Friend     
            await userModel.updateOne({ email: email }, { $pull: { friends: fId } });
            res.json({ message: "Removed Friend", status: true });
        }
        else {
            //Add Friend
            await userModel.updateOne({ email: email }, { $push: { friends: fId } });
            res.json({ message: "Added Friend", status: true });
        }
    }
    catch (err) {
        res.json({ message: "There is some issue! Please Try Again...", status: false });
        console.log(err);
    }
}
const deletePost = async (req, res) => {
    try {
        const { postId } = req.body;
        const postMatch = await postModel.findOne({ _id: postId });
        if (postMatch) {
            const userPosted = await userModel.findOne({ _id: postMatch.userPosted });
            await postModel.deleteOne({ _id: postMatch._id });
            await userPosted.posts.pull(postMatch);
            await userPosted.save();
            res.json({ message: "Success", status: true })
        }
        else {
            res.json({ message: "Error deleting the post!", status: false });
        }
    } catch (error) {
        console.log(error);
        res.json({ message: "Error deleting the post!", status: false });
    }
}
module.exports = {
    userPost, getUserDetails, getUserPosts, userComment, userLike, getAllUserDetails, getAllUserPosts, manageUserFrnds, deletePost, userReplyToComment
};