const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const userRegistration = async (req,res)=>{
    const {username,email,password,phonenumber} = req.body;
    try{
        const match = userModel.findOne({email:email});
        if(match){
            res.json({message:"User with email already registered!"});
        }
        else{
            try{
                bcrypt.hash(password,12).then((hashPass)=>{
                    const userAdded = new userModel({
                        username : username,
                        email : email,
                        password : hashPass,
                        phonenumber : phonenumber
                    });
                    userAdded.save();
                })
            }
            catch(error)
            {
                res.json({message:"Some error occured"});
            }
        }
    }
    catch(error){
        res.json({message:"Some error occured"});
    }
}
module.exports = userRegistration;