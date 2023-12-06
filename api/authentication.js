const express = require("express");
const Router = express.Router();

Router.post("/newRegistration/",(req,res)=>{
    console.log("New user created");
});
module.exports = Router;