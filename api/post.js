const express = require("express");
const Router = express.Router();
const userPost = require("../controllers/userPost");

Router.post("/userPost", userPost);
module.exports = Router;