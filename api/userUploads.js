const express = require("express");
const Router = express.Router();
const { userPost, getUserDetails, getUserPosts, userComment, userLike } = require("../controllers/userUploadsController");

Router.post("/userPost", userPost);
Router.post('/getUserDetails', getUserDetails);
Router.post("/comment", userComment);
Router.post('/likes', userLike);
Router.post("/getUserPosts", getUserPosts);
module.exports = Router;