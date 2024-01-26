require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./database/dbConnection.js");
const authenticationRouting = require("./api/authentication.js");
const postsRouting = require("./api/userUploads.js");
const chatRouting = require("./api/chatting.js");

app.use(cors());
app.use(express.json());

app.use("/api/authenticate/", authenticationRouting);
app.use('/api/user/', postsRouting);
app.use("/api/chat/",chatRouting);

const server = app.listen(5001, () => {
    console.log("Sasaz server runnning!");
});