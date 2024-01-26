const express = require("express");
const Router = express.Router();
const {fetchMessages} = require("../controllers/chatController");
const {addMessage} = require("../controllers/chatController");
Router.post("/messages/",fetchMessages);
Router.post("/addMessage/",addMessage);
module.exports = Router;