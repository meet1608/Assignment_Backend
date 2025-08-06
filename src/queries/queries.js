const User = require("../models/user.js");

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
  return await User.findByIdAndUpdate(id, updateData, { new: true });
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

