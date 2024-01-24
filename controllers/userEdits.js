const userDB = require("../models/userModel");
const bcrypt = require("bcrypt");
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
module.exports = {userProfileEdit};