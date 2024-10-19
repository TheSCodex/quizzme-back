import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const generateRecoveryCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const sendRecoveryCode = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const recoveryCode = generateRecoveryCode();
    const expirationTime = new Date(Date.now() + 15 * 60 * 1000);
    await user.update({
      recovery_code: recoveryCode,
      recovery_code_expires: expirationTime,
    });
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Recovery",
            html: `<!DOCTYPE html>
            <html lang="en" >
            <head>
              <meta charset="UTF-8">
              <title>CodePen - OTP Email Template</title>
              
            
            </head>
            <body>
            <!-- partial:index.partial.html -->
            <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
              <div style="margin:50px auto;width:70%;padding:20px 0">
                <div style="border-bottom:1px solid #eee">
                  <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Quiz Me</a>
                </div>
                <p style="font-size:1.1em">Hello there,</p>
                <p>We received a request to recover your account, you may use this code to reestablish your password</p>
                <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${recoveryCode}</h2>
                <p style="font-size:0.9em;">Best,<br />Quiz Me</p>
                <hr style="border:none;border-top:1px solid #eee" />
                <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                </div>
              </div>
            </div>
            <!-- partial -->
              
            </body>
            </html>`,
    };
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Recovery code sent" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, recovery_code, newPassword } = req.body;
  if (!email || !recovery_code || !newPassword) {
    return res.status(400).json({ message: "Email, recovery code, and new password are required" });
  }
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (
      !user.recovery_code ||
      user.recovery_code !== recovery_code ||
      new Date() > user.recovery_code_expires
    ) {
      return res.status(400).json({ message: "Invalid or expired recovery code" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({
      password: hashedPassword,
      recovery_code: null,
      recovery_code_expires: null
    });
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    if (users.length === 0) {
      return res.status(404).json({ message: "No users were found" });
    }
    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching Users", error);
    return res.status(500).json({
      message: "An unexpected error occurred while trying to fetch users",
    });
  }
};

export const getUserById = async (req, res) => {
  const userId = req.body.id;
  if (!userId) {
    return res
      .status(400)
      .json({ message: "No id was provided to search for a user" });
  }
  try {
    const user = await User.findOne({ id: userId });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No record found matching provided Id" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error("An error occurred while trying to block users", error);
    return res.status(500).json({ message: "Unable to search for user" });
  }
};

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const saltRounds = 10;
  if (!password || !email || !name) {
    return res
      .status(400)
      .json({ message: "The request body is missing one or more items" });
  }
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res
      .status(409)
      .json({ message: "User with this email already exists" });
  }
  bcrypt.hash(password, saltRounds, async (err, hash) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json({
        message:
          "An unexpected error occurred while encrypting the user's password",
      });
    }
    try {
      const newUser = await User.create({
        name: name,
        email: email,
        password: hash,
      });
      return res.status(201).json(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      return res
        .status(500)
        .json({ message: "Error creating user in the database" });
    }
  });
};

export const blockUser = async (req, res) => {
  const userIds = req.body.ids;
  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    return res
      .status(400)
      .json({ message: "No ids were received to block users" });
  }
  try {
    await User.update({ status: "blocked" }, { where: { id: userIds } });
    return res.status(200).json({ message: "Users blocked successfully" });
  } catch (error) {
    console.error("An error occurred while trying to block users", error);
    return res.status(500).json({ message: "Unable to block users" });
  }
};

export const unBlockUser = async (req, res) => {
  const userIds = req.body.ids;
  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    return res
      .status(400)
      .json({ message: "No ids were received to unblock users" });
  }
  try {
    await User.update({ status: "active" }, { where: { id: userIds } });
    return res.status(200).json({ message: "Users unblocked successfully" });
  } catch (error) {
    console.error("An error occurred while trying to unblock users", error);
    return res.status(500).json({ message: "Unable to unblock users" });
  }
};

export const deleteUser = async (req, res) => {
  const userIds = req.body.ids;
  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    return res
      .status(400)
      .json({ message: "No ids were received to delete users" });
  }
  try {
    await User.destroy({
      where: { id: userIds },
    });
    return res.status(200).json({ message: "Users deleted successfully" });
  } catch (error) {
    console.error("An error occurred while trying to delete users", error);
    return res.status(500).json({ message: "Unable to delete users" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.status === "blocked") {
      return res
        .status(403)
        .json({ message: "This user is currently blocked from the app" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    user.last_login_time = Date.now();
    user.save();
    const payload = { id: user.id, email: user.email, name: user.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "An error occurred during login" });
  }
};
