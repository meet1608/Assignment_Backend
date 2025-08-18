const User = require("../models/userSchema.js");
const mongoose = require("mongoose");

exports.getAllUsers = async (search, page = 1, limit = 10) => {
  try {
    const matchStage = { isDeleted: false };
    if (search) {
      const words = search.trim().split(/\s+/).filter(Boolean);
      matchStage.$or = words.flatMap((word) => [
        { firstName: { $regex: word, $options: "i" } },
        { lastName: { $regex: word, $options: "i" } },
        { email: { $regex: word, $options: "i" } },
      ]);
    }

    // Get total count
    const countResult = await User.aggregate([
      { $match: matchStage },
      { $count: "total" },
    ]);
    const total = countResult[0] ? countResult[0].total : 0;

    // Get paginated results
    const users = await User.aggregate([
      { $match: matchStage },
      { $sort: { updatedAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $project: {
          id: "$_id",
          email: 1,
          firstName: 1,
          lastName: 1,
          profileImage: {
            $ifNull: ["$profileImage", "/uploads/profile.avif"]
          },
          role: 1,
          createdAt: 1,
          updatedAt: 1,
          isEmailVerified: 1,
          _id: 0,
        },
      },
    ]);

    return { users, total };
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    throw new Error("Failed to get all users");
  }
};



exports.getUserById = async (id) => {
  try {
    const result = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $project: {
          id: "$_id",
          email: 1,
          firstName: 1,
          lastName: 1,
profileImage: {
            $ifNull: ["$profileImage", "/uploads/profile.avif"]
          },          role: 1,
          createdAt: 1,
          updatedAt: 1,
          isEmailVerified: 1,
          _id: 0,
        },
      },
    ]);

    return result[0] || null;
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
    const ObjectId = mongoose.Types.ObjectId.isValid(id)
      ? new mongoose.Types.ObjectId(id)
      : null;

    if (!ObjectId) {
      return null; //when id is not valid 
    }
    const updated = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) return null; // User not found

    const result = await User.aggregate([
      { $match: { _id: ObjectId } },
      {
        $project: {
          id: "$_id",
          email: 1,
          firstName: 1,
          lastName: 1,
profileImage: {
            $ifNull: ["$profileImage", "/uploads/profile.avif"]
          },          role: 1,
          createdAt: 1,
          updatedAt: 1,
          isEmailVerified: 1,
          _id: 0,
        },
      },
    ])

    return result[0] || null;
  } catch (error) {
    console.error("Error in findUserByIdAndUpdate:", error);
    throw new Error("Failed to update user by id");
  }
};
