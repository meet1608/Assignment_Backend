const Article = require("../models/articlesSchema.js");



exports.createArticle = async (articleData) => {
  return await Article.create(articleData);
};

exports.getAllArticles = async () => {
  return await Article.find().populate("user","firstName lastName email profileImage");
};

exports.getArticleById = async (id) => {
  return await Article.findById(id).populate("user","firstName lastName email profileImage");
};

exports.deleteArticleById = async (id) => {
  return await Article.findByIdAndDelete(id);
};

exports.updateArticleById = async (id, updateData) => {
  return await Article.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate("user","firstName lastName email profileImage");
};