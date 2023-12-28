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
        const { pId, email } = req.body;
        const post = await postModel.findOne({ _id: pId, 'usersLiked': email });
        const filter = { _id: pId };
        const update = !post ? { $inc: { likes: 1 }, $push: { usersLiked: email } } : { $inc: { likes: -1 }, $pull: { usersLiked: email } };
        const options = { new: true };
        const updatedPost = await postModel.findOneAndUpdate(filter, update, options);
        if (!post) {
            res.json({ message: "Liked the Post", status: true, likes: updatedPost.likes });
        }
        else {
            res.json({ message: "Already Liked the Post", status: false, likes: updatedPost.likes });
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
async function getAllUserPosts(req,res){
    const data = await postModel.find({});
    res.json({message:"Sent all posts",posts:data});
}
async function manageUserFrnds(req,res){
    const {pId, email, frndEmail} = req.body;
    if(frndEmail){
        try {
            const user = await userModel.findOne({ email: frndEmail });
            if (user) {
                await userModel.updateOne({ email }, { $addToSet: { friends: user } });
                console.log(email);
                res.json({ message: "Friend Added", status: true });
            } else {
                res.json({ message: "Friend Not Found", status: false });
            }
        } catch (err) {
            res.json({ message: "There is some issue! Please Try Again...", status: false });
        }
    }
    else if (pId){
        try {
            const user = await userModel.findOne({ email });
            if (user) {
                const friendIndex = user.friends.indexOf(pId);
                if (friendIndex !== -1) {
                    user.friends.splice(friendIndex, 1);
                    await user.save();
                    const friendsWithDetails = await Promise.all(
                        user.friends.map(async (friendId) => {
                            const friend = await userModel.findById(friendId);
                            return { id: friendId, ...friend.toObject() };
                        })
                    );
                    res.json({ friends: friendsWithDetails, status: true });
                } else {
                    res.json({ message: "Friend Not Found in the User's Friends List", status: false });
                }
            } else {
                res.json({ message: "User Not Found", status: false });
            }
        } catch (err) {
            res.json({ message: "There is some issue! Please Try Again...", status: false });
        }
    }
    else{
        const { email } = req.body;

    try {
        const user = await userModel.findOne({ email });

        if (user) {
            const friendsWithDetails = await Promise.all(
                user.friends.map(async (friendId) => {
                    const friend = await userModel.findById(friendId);
                    return { id: friendId, ...friend.toObject() };
                })
            );
    
            res.json({ friends: friendsWithDetails, status: true });
        } else {
            res.json({ message: "User Not Found", status: false });
        }
    } catch (err) {
        res.json({ message: "There is some issue! Please Try Again...", status: false });
    }
    }
}
module.exports = {
    userPost, getUserDetails, getUserPosts, userComment, userLike,getAllUserDetails,getAllUserPosts,manageUserFrnds
};