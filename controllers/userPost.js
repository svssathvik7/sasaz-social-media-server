const userModel = require("../models/userModel");
const postModel = require("../models/postModel");
const jwt = require("jsonwebtoken");

async function getUserDetails(req, res) {
    const { token } = req.body;
    const decodedToken = jwt.decode(token, "Azeemshaikpasha");
    res.json({ message: "User Details Fetched", userDetails: decodedToken });
}
async function getUserPosts(req, res) {
    const email = req.body.email;
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
module.exports = { getUserDetails, getUserPosts };