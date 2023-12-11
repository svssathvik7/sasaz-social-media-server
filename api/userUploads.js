const express = require("express");
const Router = express.Router();
const { userPost, getUserDetails } = require("../controllers/userPost");

Router.post("/userPost", userPost);
Router.post('/getUserDetails', getUserDetails);
module.exports = Router;