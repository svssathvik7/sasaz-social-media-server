const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./database/dbConnection.js");
const authenticationRouting = require("./api/authentication.js");
app.use(cors());
app.use(express.json());

app.use("/api/authenticate/",authenticationRouting);

app.listen(5001,()=>{
    console.log("Sasaz server runnning!");
});