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
        res.json({ message: "Commented on the post", status: true });
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
async function getAllUserPosts(req,res){
    const data = await postModel.find({});
    res.json({message:"Sent all posts",posts:data});
}
async function getAllFrnds(req,res){
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
async function addUserFrnds(req, res) {
    const { pId, email, frndEmail } = req.body;

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
async function removeUserFrnds(req, res) {
    const { pId, email } = req.body;

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

module.exports = {
    userPost, getUserDetails, getUserPosts, userComment, userLike,addUserFrnds,getAllUserDetails,getAllUserPosts,getAllFrnds,
    removeUserFrnds
};