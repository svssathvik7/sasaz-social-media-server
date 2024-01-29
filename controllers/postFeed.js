// This will mostly be replaced with recommendor system so this has to be a separate controller
const postModel = require("../models/postModel");
const categories = ["Study", "Space", "Fashion"]
const exploreFeed = async (req, res) => {
    try {
        const cats = await postModel.distinct("category");
        const segregatedPosts = [];
        for (const cat of cats) {
            const temp = await postModel.find({ category: cat }).limit(15);
            segregatedPosts.push(temp);
        }
        res.json({ message: "Success!", status: true, posts: segregatedPosts });
    } catch (error) {
        res.json({ message: "Failed getting data!", status: false });
    }
}
module.exports = { exploreFeed }