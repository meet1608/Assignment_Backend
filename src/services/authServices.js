const User = require("../models/userSchema.js");

exports.createUser = async (userData) => {
  try {
    return await User.create(userData);
  } catch (error) {
    console.error("Error in createUser service:", error);
    throw new Error("Failed to create user");
  }
};

exports.findUserByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    console.error("Error in findUserByEmail service:", error);
    throw new Error("Failed to find user by email");
  }
};

exports.findUserByToken = async (token) => {
  try {
    return await User.findOne({
      setPasswordToken: token,
      setPasswordExpires: { $gt: Date.now() },
      isEmailVerified: false,
    });
  } catch (error) {
    console.error("Error in findUserByToken service:", error);
    throw new Error("Failed to find user by token");
  }
};
