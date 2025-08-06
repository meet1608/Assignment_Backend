const User = require("../models/userSchema.js");
const Article = require("../models/articlesSchema.js");
exports.findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

exports.createUser = async (userData) => {
  return await User.create(userData);
};

exports.findUserByToken = async (token) => {
  return await User.findOne({
    setPasswordToken: token,
    setPasswordExpires: { $gt: Date.now() },
    isEmailVerified: false,
  });
};

exports.getAllUsers = async () => {
  return await User.find();
};

exports.getUserById = async (id) => {
  return await User.findById(id);
};

exports.deleteUserById = async (id) => {
  return await User.findByIdAndDelete(id);
};

exports.findUserByIdAndUpdate = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

};

exports.setResetPasswordToken = async (email, token) => {
  return await User.findOneAndUpdate(
    { email },
    {
    resetPasswordToken: token,
     resetPasswordExpires: Date.now() + 1800000, 
    },
    { new: true }
  );
};

exports.findUserByResetToken = async (token) => {
  return await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
};

exports.createArticle = async (articleData) => {
  return await Article.create(articleData);
};

exports.getAllArticles = async () => {
  return await Article.find();
};

exports.getArticleById = async (id) => {
  return await Article.findById(id);
};

exports.deleteArticleById = async (id) => {
  return await Article.findByIdAndDelete(id);
};

exports.updateArticleById = async (id, updateData) => {
  return await Article.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};