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

//Creating a new socket io server, and passing our node js server as param.
const io = new Server(appServer, {
    cors: 'http://localhost:3000',//To be changed in production 
    methods: ["Get", "Post", "Delete"]
});

//Function used to add new sent message from specific user.
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
//Making the socket io server to connect once the user make a connection event.
io.on("connection", (socket) => {
    //used to connect two users with specific id.
    socket.on('join_chat_room', (data) => {
        socket.join(data.roomChat);
    })
    //Function to handle new messages and emit them to the sender and the person with unique chat id.
    socket.on("send_message", async (data) => {
        const messageObject = await addMessage(data);
        socket.emit('receive_message', { data, messageObject });
        socket.to(data.roomChat).emit('receive_message', { data, messageObject });
    });
})