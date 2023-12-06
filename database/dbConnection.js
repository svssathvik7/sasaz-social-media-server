const mongoose = require("mongoose");
// process.env will be used once we move to production
mongoose.connect("mongodb+srv://sathishsara1007:PUTbv0P7vPmJQniW@cluster0.4nso06z.mongodb.net/?retryWrites=true&w=majority");
const db = mongoose.connection
db.on("error",()=>{console.log("Error connection to db")});
db.once("open",()=>{console.log("Successfully connected to database")});

module.exports = db;