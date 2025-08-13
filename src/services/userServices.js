const User = require("../models/userSchema.js");

exports.getAllUsers = async () => {
  try {
    return await User.find({ isDeleted: false });
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
    return await User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  } catch (error) {
    console.error("Error in deleteUserById:", error);
    throw new Error("Failed to soft delete user by id");
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
