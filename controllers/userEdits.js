const userDB = require("../models/userModel");
const bcrypt = require("bcrypt");
const postDb = require("../models/postModel");
const userProfileEdit = async (req,res)=>{
    try{
        const {email,changedField,newData} = req.body;
        const userMatch = await userDB.findOne({email:email});
        if(userMatch){
            if(changedField==="password")
            {
                bcrypt.hash(newData, 12).then(async (hashPass) => {
                    const updatedUser = await userDB.updateOne({email:email},{
                        [changedField] : hashPass
                    })
                });
            }
            else{
                const updatedUser = await userDB.updateOne({email:email},{
                    [changedField] : newData
                });
            }
            res.json({message:"Successfull profile edit!",status:true});
        }
        else{
            res.json({message:"Failed to find user!",status:false});
        }
    }
    catch(error){
        console.log(error);
        res.json({message:"Internal error!",status:false});
    }
}
const addSavedPosts = async (req,res)=>{
    try {
        const {userId,postId,operation} = req.body;
        const userMatch = await userDB.findById(userId);
        const postMatch = await postDb.findById(postId);
        if(userMatch && postMatch){
            if(operation == "add")
            {
                await userMatch.savedPosts.push(postMatch._id);
                await userMatch.save();
            }
            else{
                await userMatch.savedPosts.pull(postMatch._id);
                await userMatch.save();
            }
            res.json({message:"Success!",status:true});
        }
        else{
            res.json({message:"No user or post found!",status:false});
        }
    } catch (error) {
        console.log(error);
        res.json({message:"Something went wrong!",status:false});
    }
}
module.exports = {userProfileEdit,addSavedPosts};