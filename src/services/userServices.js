const User = require("../models/userSchema.js");

exports.getAllUsers = async () => {
  try {
    return await User.find();
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    throw new Error("Failed to get all users");
  }
};

exports.getUserById = async (id) => {
  try {
    return await User.findById(id);
  } catch (error) {
    console.error("Error in getUserById:", error);
    throw new Error("Failed to get user by id");
  }
};

exports.deleteUserById = async (id) => {
  try {
    return await User.findByIdAndDelete(id);
  } catch (error) {
    console.error("Error in deleteUserById:", error);
    throw new Error("Failed to delete user by id");
  }
};

exports.findUserByIdAndUpdate = async (id, updateData) => {
  try {
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  } catch (error) {
    console.error("Error in findUserByIdAndUpdate:", error);
    throw new Error("Failed to update user by id");
  }
};

exports.setResetPasswordToken = async (email, token) => {
  try {
    return await User.findOneAndUpdate(
      { email },
      {
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 1800000,
      },
      { new: true }
    );
  } catch (error) {
    console.error("Error in setResetPasswordToken:", error);
    throw new Error("Failed to set reset password token");
  }
};

exports.findUserByResetToken = async (token) => {
  try {
    return await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
  } catch (error) {
    console.error("Error in findUserByResetToken:", error);
    throw new Error("Failed to find user by reset token");
  }
};
