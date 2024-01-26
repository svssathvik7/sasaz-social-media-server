const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
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

const chatSchema = new mongoose.Schema({
    id : {
        type : String,
        required : true
    },
    chat : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'messages'
    }]
});
const messageDb = new mongoose.model("messages",messageSchema);
const chatDb = new mongoose.model("chats",chatSchema);
 
module.exports = {messageDb,chatDb};