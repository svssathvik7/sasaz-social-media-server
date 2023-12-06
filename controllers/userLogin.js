const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const userLogin = async(req,res)=>{
    const {email,password} = req.body;
    try{
        const userMatch = userModel.findOne({email:email});
        if(userMatch === null)
        {
            res.json({message:"No user found with email"});
        }
        else{
            const resultMatch = bcrypt.compare(password,userMatch.password);
            if(!resultMatch)
            {
                res.json({message:"Wrong password!"});
            }
            else{
                res.json({message:"Successfull login!"});
            }
        }
    }
    catch(error){
        res.json({message:"Some error occurred"});
    }
};
module.exports = userLogin;