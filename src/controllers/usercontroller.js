const userQueries = require("../services/userServices.js");
const fs = require("fs");
const path = require("path");
const Joi = require("joi");
const validate = require("../middleware/validate.js");

const objectIdSchema = Joi.string()
  .regex(/^[0-9a-fA-F]{24}$/)
  .message("Invalid MongoDB ID");

exports.getAllUsers = async (req, res) => {
  try {
    const adminId = req.user.id;
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { users, total } = await userQueries.getAllUsers(
      search,
      page,
      limit,
      adminId
    );

    res.status(200).json({
      users: users || [],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userid = req.params.id;

    
    const user = await userQueries.getUserById(userid);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
//this change is for checking commit
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await userQueries.deleteUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    if (!userId)
      return res.status(400).json({ message: "User ID is required" });

    const existingUser = await userQueries.getUserById(userId);
    if (!existingUser)
      return res.status(404).json({ message: "User not found" });

    const updateData = { ...req.body };

    if (req.file) {
      updateData.profileImage = `/uploads/${req.file.filename}`;
    } else {
      updateData.profileImage = existingUser.profileImage;
    }

    if (
      req.file &&
      existingUser.profileImage &&
      existingUser.profileImage !== "/uploads/profile.avif"
    ) {
      const oldImagePath = path.join(
        __dirname,
        "..",
        existingUser.profileImage
      );
      try {
        if (fs.existsSync(oldImagePath)) {
          await fs.promises.unlink(oldImagePath);
        }
      } catch (err) {
        console.error("Error deleting old profile image:", err.message);
      }
    }

    const updatedUser = await userQueries.findUserByIdAndUpdate(
      userId,
      updateData
    );
    if (!updatedUser)
      return res.status(404).json({ message: "User not found after update" });

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.updateUserByAdmin = async (req, res) => {
  try {
    const userId = req.params.id;
   
    if (!userId)
      return res.status(400).json({ message: "User ID is required" });

    const existingUser = await userQueries.getUserById(userId);
    if (!existingUser)
      return res.status(404).json({ message: "User not found" });

    const updateData = {};
    const { firstName, lastName, role, email } = req.body;

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (role) updateData.role = role;
    if (email) updateData.email = email;

    if (req.file) {
      updateData.profileImage = `/uploads/${req.file.filename}`;
    } else {
      updateData.profileImage = existingUser.profileImage;
    }

    if (
      req.file &&
      existingUser.profileImage &&
      existingUser.profileImage !== "/uploads/profile.avif"
    ) {
      const oldImagePath = path.join(
        __dirname,
        "..",
        existingUser.profileImage
      );
      try {
        if (fs.existsSync(oldImagePath)) {
          await fs.promises.unlink(oldImagePath);
        }
      } catch (err) {
        console.error("Error deleting old profile image:", err.message);
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No update fields provided" });
    }

    const updatedUser = await userQueries.findUserByIdAndUpdate(
      userId,
      updateData
    );
    if (!updatedUser)
      return res.status(404).json({ message: "User not found after update" });

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user by admin:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
