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
        const { pId, comment, name } = req.body;
        console.log(name);
        await postModel.updateOne({ _id: pId }, { $push: { comments: { comment: comment, userCommented: name } } });
        res.json({ message: "Commented on the post", status: true, userName: name });
    }
    catch (err) {
        console.log(err.message);
        res.json({ message: "There is some issue! Please Try Again...", status: false });
    }
}

async function userLike(req, res) {
    try {
        const { alter, pId } = req.body;
        if (alter === false) {
            await postModel.updateOne({ _id: pId }, { $inc: { likes: -1 } });
        }
        else {
            await postModel.updateOne({ _id: pId }, { $inc: { likes: 1 } });
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
    const userDetails = await userModel.findOne({ email: decodedToken.email }).populate("posts");
    res.json({ message: "User Details Fetched", userDetails: userDetails });
}

async function getUserPosts(req, res) {
    const { email } = req.body;
    try {
        const userMatch = await userModel.findOne({ email: email }).populate("posts");
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
module.exports = {
    userPost, getUserDetails, getUserPosts, userComment, userLike, getAllUserDetails
};