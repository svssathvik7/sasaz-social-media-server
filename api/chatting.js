const express = require("express");
const Router = express.Router();
const { fetchMessages, reactMessage } = require("../controllers/chatController");
const { addMessage } = require("../controllers/chatController");
Router.post("/messages/", fetchMessages);
Router.post("/addMessage/", addMessage);
Router.post('/reactMessage', reactMessage);
module.exports = Router;