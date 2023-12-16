const express = require("express");
const Router = express.Router();
const { userPost, getUserDetails,getUserPosts } = require("../controllers/userPost");

Router.post("/userPost", userPost);
Router.post('/getUserDetails', getUserDetails);
Router.post("/getUserPosts",getUserPosts);
module.exports = Router;