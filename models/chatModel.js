const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    message: {
        type: String,
        required: true
    },
    reply: String,
    timeStamp: {
        type: Date,
        default: Date.now
    }
});

const chatSchema = new mongoose.Schema({
    chatId: {
        type: String,
        required: true
    },
    chat: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'messages'
    }]
});
const messageDb = new mongoose.model("messages", messageSchema);
const chatDb = new mongoose.model("chats", chatSchema);

module.exports = { messageDb, chatDb };