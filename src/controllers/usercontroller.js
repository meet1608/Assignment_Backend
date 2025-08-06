const userQueries = require("../queries/queries.js");



exports.getAllUsers = async (req, res) => {
  try {
    const users = await userQueries.getAllUsers();
    res.status(200).json(users);
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
  if (!userId) {
            return res.status(400).json({ message: "User ID is required",error: error.message });
        }
    let updateData = { ...req.body };

    if (req.file) {
      updateData.profileImage = `/uploads/${req.file.filename}`;
    }

    const user = await userQueries.findUserByIdAndUpdate(userId, updateData);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

