const Article = require("../models/articlesSchema.js");

exports.createArticle = async (articleData) => {
  try {
    const article = await Article.create(articleData);
    return await article.populate("user", "firstName lastName email profileImage");
  } catch (error) {
    console.error("Error in createArticle service:", error);
    throw new Error("Failed to create article");
  }
};

exports.getAllArticles = async () => {
  try {
    return await Article.find().populate("user", "firstName lastName email profileImage");
  } catch (error) {
    console.error("Error in getAllArticles service:", error);
    throw new Error("Failed to get all articles");
  }
};

exports.getArticleById = async (id) => {
  try {
    return await Article.findById(id).populate("user", "firstName lastName email profileImage");
  } catch (error) {
    console.error("Error in getArticleById service:", error);
    throw new Error("Failed to get article by id");
  }
};

exports.deleteArticleById = async (id) => {
  try {
    return await Article.findByIdAndDelete(id);
  } catch (error) {
    console.error("Error in deleteArticleById service:", error);
    throw new Error("Failed to delete article by id");
  }
};

exports.updateArticleById = async (id, updateData) => {
  try {
    return await Article.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .populate("user", "firstName lastName email profileImage");
  } catch (error) {
    console.error("Error in updateArticleById service:", error);
    throw new Error("Failed to update article by id");
  }
};
