const { messageDb } = require("../models/chatModel");
const { chatDb } = require("../models/chatModel");

const createChatSession = async (chatId) => {
    const newChatSession = await new chatDb({
        id: chatId,
        chat: []
    });
    await newChatSession.save();
    return newChatSession;
}
const fetchMessages = async (req, res) => {
    try {
        const { chatId } = req.body;
        const messages = await chatDb.findOne({ chatId: chatId }).populate({
            path: "chat",
            populate: {
                path: "user",
            },
        });
        if (messages === null) {
            const newChatSession = new chatDb({
                chatId: chatId,
                chat: []
            });
            await newChatSession.save();
            res.json({ message: "New Chat Created", status: false, data: [] })
        }
        else {
            res.json({ message: "Success", status: true, data: messages });
        }
    } catch (error) {
        console.log(error);
        res.json({ message: "Something went wrong!", status: false });
    }
}
const addMessage = async (req, res) => {
    try {
        const { user, message, chatId } = req.body;
        const chatMessage = await new messageDb({
            user,
            message
        });
        await chatMessage.save();
        const chatSession = await chatDb.findOne({ id: chatId });
        if (chatSession === null) {
            const newChatSession = await createChatSession(chatId);
            await newChatSession.chat.push(chatMessage);
            await newChatSession.save();
            res.json({ message: "Success", status: true });
        }
        else {
            await chatSession.chat.push(chatMessage);
            await chatSession.save();
            res.json({ message: "Success", status: true });
        }
    } catch (error) {
        console.log(error);
        res.json({ message: "Something went wrong!", status: false });
    }
}
async function reactMessage(req, res) {
    const { emoji, mId, chatId } = req.body;
    const chat = await chatDb.findOne({ chatId: chatId }).populate('chat');
    if (chat && chat.chat && chat.chat.length > mId) {
        const messageId = chat.chat[mId]._id
        await messageDb.findOneAndUpdate({ _id: messageId }, { $set: { reply: emoji } }, { new: true });
        res.json({ message: "Success", status: true });
    }
    else {
        res.json({ message: "There is some issue Please try again", status: false });
    }
}
module.exports = { fetchMessages, addMessage, reactMessage };