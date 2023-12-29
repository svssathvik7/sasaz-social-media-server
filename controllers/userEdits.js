const userDB = require("../models/userModel");
const userProfileEdit = async (req,res)=>{
    try{
        const {email} = req.body;
        const userMatch = userDB.findOne({email:email});
        if(userMatch){
            const updatedUser = userDB.updateOne({email:email},{
                name : req.body.name.length ? req.body.name : userMatch.name,
                password : req.body.password.length ? req.body.password : userMatch.password
            });
            res.json({message:"Successfull profile edit!",status:false});
        }
    }
    catch(error){
        res.json({message:"Internal error!",status:false});
    }
}
module.exports = {userProfileEdit};