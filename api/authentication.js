const express = require("express");
const Router = express.Router();
const userRegistrationController = require("../controllers/userRegistration");
const { userLogin, authorize } = require("../controllers/userLogin");

Router.post("/newRegistration", userRegistrationController);
Router.post("/userLogin", userLogin);
Router.post('/authorize', authorize);
module.exports = Router;