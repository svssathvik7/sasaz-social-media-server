const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    message : {
        type : String,
        required : true
    },
    timeStamp : {
        type : Date,
        default : Date.now
    }
});

const chatModel = new mongoose.model("message",chatSchema);

module.exports = chatModel;