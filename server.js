require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./database/dbConnection.js");
const authenticationRouting = require("./api/authentication.js");
const postsRouting = require("./api/userUploads.js");
const chatRouting = require("./api/chatting.js");
const { Server } = require("socket.io");
const { chatDb, messageDb } = require('./models/chatModel.js');
app.use(cors());
app.use(express.json());

app.use("/api/authenticate/", authenticationRouting);
app.use('/api/user/', postsRouting);
app.use("/api/chat/", chatRouting);

const appServer = app.listen(5001, () => {
    console.log("Sasaz server runnning!");
});

const io = new Server(appServer, {
    cors: 'http://localhost:3000',
    methods: ["Get", "Post", "Delete"]
});

const addMessage = async (data) => {
    const { userId, message, roomChat } = data;
    const newMessage = new messageDb({
        message: message,
        user: userId,
    });
    await newMessage.save();
    const savedMessage = await messageDb.findById(newMessage._id).populate('user');
    await chatDb.updateOne({ chatId: roomChat }, { $push: { chat: newMessage } });
    return savedMessage;
}
io.on("connection", (socket) => {
    socket.on('join_chat_room', (data) => {
        socket.join(data.roomChat);
    })
    socket.on("send_message", async (data) => {
        const messageObject = await addMessage(data);
        socket.emit('receive_message', { data, messageObject });
        socket.to(data.roomChat).emit('receive_message', { data, messageObject });
    });
})