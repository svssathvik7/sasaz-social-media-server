const userModel = require("../models/userModel");
const postModel = require("../models/postModel");


async function userPost(req, res) {
    const { imageUrl, postText, email, caption } = req.body;
    try {
        const user = await userModel.findOne({ email: email });
        if (user) {
            const newPost = new postModel({
                userPosted: user,
                imageUrl: imageUrl,
                postText: postText,
                caption: caption,
                likes: 0,
                comments: [],
                postTime: Date.now
            })
            newPost.save();
            await userModel.updateOne({ email: email }, { $push: { posts: newPost } });
            res.json({ message: "Uploaded Post", status: true });
        }
        else {
            res.json({ message: "User Not Found, Please Log in again...", status: false })
        }
    }
    catch (err) {
        res.json({ message: "There is some issue! Please Try Again...", status: false });
    }
}