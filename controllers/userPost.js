const userModel = require("../models/userModel");
const postModel = require("../models/postModel");
const jwt = require("jsonwebtoken");


async function userPost(req, res) {
    const { imageUrl, postText, email, caption } = req.body;
    try {
        const user = await userModel.findOne({ email: email });
        if (user) {
            const newPost = new postModel({
                userPosted: user,
                imageUrl: imageUrl,
                postText: postText,
                caption: caption,
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

async function getUserDetails(req, res) {
    const { token } = req.body;
    const decodedToken = jwt.decode(token, "Azeemshaikpasha");
    res.json({ message: "User Details Fetched", userDetails: decodedToken });
}

async function getUserPosts(req,res){
    const email = req.body.email;
    try{
        const userMatch = await userModel.findOne({email:email}).populate("posts");
        console.log(userMatch);
        if(userMatch){
            res.json({message:"Success",posts:userMatch.posts});
        }
        else{
            res.json({message:"User not found",posts:false});
        }
    }
    catch(error){
        res.json({message:"Failed to retreive posts!",posts:false});
    }
}
module.exports = { userPost, getUserDetails, getUserPosts };