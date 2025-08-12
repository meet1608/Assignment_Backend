const Article = require("../models/articlesSchema.js");
const mongoose = require("mongoose");

exports.createArticle = async (articleData) => {
  try {
    const article = await Article.create(articleData);
    const result = await Article.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(article._id) } },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },//when we joint two tables at that time it will return array so we have to use unwind that will return single object
      {
        $project: {
          title: 1,
          content: 1,
          articleImage: 1,
          type: 1,
          user: {
            firstName: "$user.firstName",
            lastName: "$user.lastName",
            email: "$user.email",
            profileImage: "$user.profileImage",
          },
        },
        
      },
    ]);
    return result[0];
  } catch (error) {
    console.error("Error in createArticle service:", error);
    throw new Error("Failed to create article");
  }
};
