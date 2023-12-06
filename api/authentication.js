const express = require("express");
const Router = express.Router();
const userRegistrationController = require("../controllers/userRegistration");
const userLoginController = require("../controllers/userLogin");

Router.post("/newRegistration/",userRegistrationController);
Router.post("userLogin",userLoginController);
module.exports = Router;