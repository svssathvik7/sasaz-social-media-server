const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./database/dbConnection.js");
app.use(cors());
app.use(express.json());



app.listen(5001,()=>{
    console.log("Sasaz server runnning!");
});