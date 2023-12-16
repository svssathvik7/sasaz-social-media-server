require("dotenv").config();
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const jwt = require('jsonwebtoken');
const userLogin = async (req, res) => {
    const { email, password } = req.body.backendData;
    try {
        const userMatch = await userModel.findOne({ email: email });
        if (userMatch === null) {
            res.json({ message: "User not Registered, Please Register!", status: true });
        }
        else {
            // console.log(userMatch);
            const resultMatch = bcrypt.compare(password, userMatch.password);
            if (!resultMatch) {
                res.json({ message: "Wrong password!", status: false });
            }
            else {
                const token = jwt.sign({
                    id: userMatch._id,
                    name: userMatch.name,
                    email: email,
                    phNumer: userMatch.phNumer
                }, "ThisIsSaSazSecret", { expiresIn: "15m" });
                res.json({ message: "Successfull login!", status: true, user: token, userDetails: userMatch });
            }
        }
    }
    catch (error) {
        res.json({ message: "Some error occurred", status: false });
    }
};

async function authorize(req, res) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.json({ message: "Missing Token", status: false });
        }
        else {
            const token = authHeader.split(" ")[1];
            const decodedToken = jwt.decode(token, "ThisIsSaSazSecret");
            if (decodedToken) {
                const expiryTimestamp = decodedToken.exp;
                const currentTimestamp = Math.floor(Date.now() / 1000);
                if (expiryTimestamp && currentTimestamp > expiryTimestamp) {
                    res.json({ message: "Token Expired!", status: false });
                } else {
                    res.json({ message: "Token valid", status: true });
                }
            } else {
                res.json({ message: "Token Invalid", status: false });
            }
        }
    }
    catch (err) {
        res.json({ message: "Something went wrong. Please refresh the page and try again.", status: false })
    }
}
module.exports = { userLogin, authorize };