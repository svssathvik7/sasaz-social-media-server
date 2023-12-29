const express = require("express");
const Router = express.Router();
const userRegistrationController = require("../controllers/userRegistration");
const { userLogin, authorize } = require("../controllers/userLogin");
const {userProfileEdit} = require("../controllers/userEdits");

Router.post("/newRegistration", userRegistrationController);
Router.post("/userLogin", userLogin);
Router.post('/authorize', authorize);
Router.post("/editUser",userProfileEdit);
module.exports = Router;