const Article = require("../models/articlesSchema.js");
const mongoose = require("mongoose");

exports.createArticle = async (articleData) => {
  try {
    const article = await Article.create(articleData);
    const result = await Article.aggregate([
      // { $match: { _id: new mongoose.Types.ObjectId(article._id) } }, used for converting string_id to object_id
      { $match: { _id: article._id } }, //if we are giving object id then it is correct but if we are giving string id then it is not correct
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" }, //when we joint two tables at that time it will return array so we have to use unwind that will return single object
      {
        $project: {
          title: 1,
          content: 1,
          articleImage: 1,
          type: 1,
          createdAt: 1,
          updatedAt: 1,
          user: {
            _id: "$user._id",
            firstName: "$user.firstName",
            lastName: "$user.lastName",
            email: "$user.email",
            profileImage: {
              $ifNull: ["$user.profileImage", "/uploads/profile.avif"],
            },
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

exports.getAllArticles = async (search, userId, type, page = 1, limit = 10) => {
  try {
    const matchStage = {
      isDeleted: false,
      "user.isDeleted": false,
    };
    if (userId) {
      matchStage["user._id"] = new mongoose.Types.ObjectId(userId);
    }
    if (type && ["draft", "published"].includes(type)) matchStage.type = type;
    if (search) {
      const words = search
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);
      const condition = [];
      words.forEach((word) => {
        condition.push(
          { "user.firstName": { $regex: word, $options: "i" } },
          { "user.lastName": { $regex: word, $options: "i" } },
          { title: { $regex: word, $options: "i" } }
        );
      });
      matchStage.$or = condition;
    }
    const countResult = await Article.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $match: matchStage,
      },
      {
        $count: "total",
      },
    ]);
    const total = countResult[0] ? countResult[0].total : 0;
    const result = await Article.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $match: matchStage,
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          title: 1,
          content: 1,
          articleImage: 1,
          type: 1,
          createdAt: 1,
          updatedAt: 1,
          user: {
            _id: "$user._id",
            firstName: "$user.firstName",
            lastName: "$user.lastName",
            email: "$user.email",
            profileImage: {
              $ifNull: ["$user.profileImage", "/uploads/profile.avif"],
            },
            isDeleted: "$user.isDeleted",
          },
        },
      },
    ]);
    return { articles: result, total };
  } catch (error) {
    console.error("Error in getAllArticles service:", error);
    throw new Error("Failed to get all articles");
  }
};


exports.getArticleById = async (id) => {
  try {
    const ObjectId = mongoose.Types.ObjectId.isValid(id)
      ? new mongoose.Types.ObjectId(id)
      : null;
    if (!ObjectId) {
      return null; //when id is not valid
    }

    const result = await Article.aggregate([
      { $match: { _id: ObjectId, isDeleted: false } },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },

      { $unwind: "$user" },
      {
        $match: {
          "user.isDeleted": false,
        },
      },
      {
        $project: {
          title: 1,
          content: 1,
          articleImage: 1,
          type: 1,
          createdAt: 1,
          updatedAt: 1,

          user: {
            _id: "$user._id",
            firstName: "$user.firstName",
            lastName: "$user.lastName",
            email: "$user.email",
            profileImage: {
              $ifNull: ["$user.profileImage", "/uploads/profile.avif"],
            },
            isDeleted: "$user.isDeleted",
          },
        },
      },
    ]);
    return result[0] || null;
  } catch (error) {
    console.error("Error in getArticleById service:", error);
    throw new Error("Failed to get article by id");
  }
};

exports.deleteArticleById = async (id) => {
  try {
    return await Article.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } }, 
      { new: true }                    
    );
  } catch (error) {
    console.error("Error in deleteArticleById service:", error);
    throw new Error("Failed to soft delete article by id");
  }
};


exports.updateArticleById = async (id, updateData) => {
  try {
    const ObjectId = mongoose.Types.ObjectId.isValid(id)
      ? new mongoose.Types.ObjectId(id)
      : null;
    if (!ObjectId) {
      return null; //when id is not valid
    }

    const updated = await Article.findByIdAndUpdate(ObjectId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updated) return null; // Article not found

    const result = await Article.aggregate([
      { $match: { _id: ObjectId } },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $match: { "user.isDeleted": false },
      },
      {
        $project: {
          title: 1,
          content: 1,
          articleImage: 1,
          type: 1,
          createdAt: 1,
          updatedAt: 1,

          user: {
            _id: "$user._id",
            firstName: "$user.firstName",
            lastName: "$user.lastName",
            email: "$user.email",
            profileImage: {
              $ifNull: ["$user.profileImage", "/uploads/profile.avif"],
            },
          },
        },
      },
    ]);

    return result[0] || null;
  } catch (error) {
    console.error("Error in updateArticleById service:", error);
    throw new Error("Failed to update article by id");
  }
};
