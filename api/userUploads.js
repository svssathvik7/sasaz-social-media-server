const express = require("express");
const Router = express.Router();
const { userPost, getUserDetails, getUserPosts, userComment, userLike, getAllUserDetails, getAllUserPosts ,addUserFrnds,
        getAllFrnds,removeUserFrnds} = require("../controllers/userUploadsController");

Router.post("/userPost", userPost);
Router.post('/getUserDetails', getUserDetails);
Router.post("/comment", userComment);
Router.post("/addfrnds",addUserFrnds);
Router.post("/getallfrnds", getAllFrnds);
Router.post("/removefrnds",removeUserFrnds);
Router.post('/likes', userLike);
Router.get('/allUsers', getAllUserDetails);
Router.post("/getUserPosts", getUserPosts);
Router.post("/getAllPosts",getAllUserPosts);
module.exports = Router;