const express = require("express");
const Router = express.Router();
const userRegistrationController = require("../controllers/userRegistration");

Router.post("/newRegistration/",userRegistrationController);
module.exports = Router;