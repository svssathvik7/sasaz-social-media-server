const userDB = require("../models/userModel");
const userProfileEdit = async (req,res)=>{
    try{
        const {email,changedField,newData} = req.body;
        const userMatch = await userDB.findOne({email:email});
        if(userMatch){
            if(changedField==="password")
            {
                bcrypt.hash(password, 12).then(async (hashPass) => {
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
        res.json({message:"Internal error!",status:false});
    }
}
module.exports = {userProfileEdit};