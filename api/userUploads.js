const express = require("express");
const Router = express.Router();
const { userPost, getUserDetails, getUserPosts, userComment, userLike, getAllUserDetails, getAllUserPosts ,manageUserFrnds,deletePost} = require("../controllers/userUploadsController");
const {exploreFeed} = require("../controllers/postFeed");

Router.post("/userPost", userPost);
Router.post('/getUserDetails', getUserDetails);
Router.post("/comment", userComment);
Router.post("/managefrnds",manageUserFrnds);
Router.post('/likes', userLike);
Router.get('/allUsers', getAllUserDetails);
Router.post("/getUserPosts", getUserPosts);
Router.post("/getAllPosts",getAllUserPosts);
Router.post("/deletePost",deletePost);
Router.get("/exploreFeed",exploreFeed);
module.exports = Router;