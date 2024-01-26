const {messageDb} = require("../models/chatModel");
const {chatDb} = require("../models/chatModel");
const createChatSession = async (chatId)=>{
    const newChatSession = await new chatDb({
        id : chatId,
        chat : []
    });
    await newChatSession.save();
    return newChatSession;
}
const fetchMessages = async (req,res)=>{
    try {
        const {chatId} = req.body
        const messages = await chatDb.findOne({id:chatId}).populate({
            path: "chat",
            populate: {
              path: "user",
            },
        });
        if(messages === null)
        {
            const newChatSession = await createChatSession(chatId);
            res.json({message:"Success",status:true,data:newChatSession});
        }
        else{
            res.json({message:"Success",status:true,data:messages});
        }
    } catch (error) {
        console.log(error);
        res.json({message:"Something went wrong!",status:false});
    }
}
const addMessage = async (req,res)=>{
    try {
        const {user,message,chatId} = req.body;
        const chatMessage = await new messageDb({
            user,
            message
        });
        await chatMessage.save();
        const chatSession = await chatDb.findOne({id:chatId});
        if(chatSession === null)
        {
            const newChatSession = await createChatSession(chatId);
            await newChatSession.chat.push(chatMessage);
            await newChatSession.save();
            res.json({message:"Success",status:true});
        }
        else{
            await chatSession.chat.push(chatMessage);
            await chatSession.save();
            res.json({message:"Success",status:true});
        }
    } catch (error) {
        console.log(error);
        res.json({message:"Something went wrong!",status:false});
    }
}
module.exports = {fetchMessages,addMessage};