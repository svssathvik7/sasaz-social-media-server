const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const userRegistration = async (req, res) => {
    const { name, email, password, phNumber } = req.body.backendData;
    console.log(name, email, password, phNumber);
    try {
        const match = await userModel.findOne({ email: email });
        if (match) {
            res.json({ message: "User Already Registered, Please Log In!", status: true });
        }
        else {
            try {
                bcrypt.hash(password, 12).then((hashPass) => {
                    const userAdded = new userModel({
                        name: name,
                        email: email,
                        password: hashPass,
                        phNumber: phNumber
                    });
                    userAdded.save();
                })
                res.json({ message: "Successfully Registered, Please Log In!", status: true })
            }
            catch (error) {
                res.json({ message: "Some error occured", status: false });
            }
        }
    }
    catch (error) {
        res.json({ message: "Some error occured", status: false });
    }
}

module.exports = userRegistration;