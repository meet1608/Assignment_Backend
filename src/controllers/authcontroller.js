const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendVerificationEmail = require("../utils/sendAddPasswordEmail.js");
const userQueries = require("../queries/queries.js");
const sendResetPasswordEmail = require("../utils/sendResetPasswordEmail.js");

exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;

    const existingUser = await userQueries.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email Exists" });
    }

    let profileImage;
    if (req.file) {
      profileImage = `/uploads/${req.file.filename}`;
    } else {
      profileImage = undefined;
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "30m",
    });
    const tokenExpiry = Date.now() + 1800000;

    const user = await userQueries.createUser({
      firstName,
      lastName,
      email,
      profileImage,
      setPasswordToken: token,
      setPasswordExpires: tokenExpiry,
    });

    await sendVerificationEmail(email, token);

    res.status(201).json({
      message: "User Created. Check email to set password.",
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

exports.setPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;
    const user = await userQueries.findUserByToken(token);

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.setPasswordToken = undefined;
    user.setPasswordExpires = undefined;
    user.isEmailVerified = true;
    await user.save();

    res.status(200).json({ message: "Password set successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userQueries.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.isEmailVerified) {
      return res.status(403).json({
        message:
          "Email not verified. Please check your email to set your password.",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userQueries.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "30m",
    });
    await userQueries.setResetPasswordToken(email, token);
    await sendResetPasswordEmail(email, token);
    res.status(200).json({
      message: "Password reset email sent. Please check your inbox.",
      token,
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.resetpassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const user = await userQueries.findUserByResetToken(token);
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(200).json({ message: "Password reset successfully" });
  } catch {
    console.error("Error in resetpassword:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
