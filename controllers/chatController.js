const chatDb = require("../models/chatModel");
const fetchMessages = async (req,res)=>{
    try {
        const messages = await chatDb.find();
        // console.log("Fetch : ",messages);
        res.json({message:"Success",status:true,data:messages});
    } catch (error) {
        console.log(error);
        res.json({message:"Something went wrong!",status:false});
    }
}
const addMessage = async (req,res)=>{
    // console.log("Add : ",req.body);
    try {
        const {user,message} = req.body;
        const chatMessage = new chatDb({
            user,
            message
        });
        await chatMessage.save();
        res.json({message:"Success",status:true});
    } catch (error) {
        console.log(error);
        res.json({message:"Something went wrong!",status:false});
    }
}
module.exports = {fetchMessages,addMessage};