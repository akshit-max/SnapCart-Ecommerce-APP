import userModel from "../models/userModel.js";
import { comparePassword, hashPassword, publicUser } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";

const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

// answers are compared in lowercase so "Cricket" and "cricket" both work
const normalizeAnswer = (answer) => answer.trim().toLowerCase();

//REGISTER
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    if (!name || !email || !password || !phone || !address || !answer) {
      return res.status(400).send({ success: false, message: "All fields are required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).send({ success: false, message: "Please enter a valid email" });
    }
    if (password.length < 6) {
      return res.status(400).send({ success: false, message: "Password must be at least 6 characters" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: "Already registered, please login",
      });
    }

    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: await hashPassword(password),
      answer: await hashPassword(normalizeAnswer(answer)),
    }).save();

    res.status(201).send({
      success: true,
      message: "User registered successfully",
      user: publicUser(user),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error in registration" });
  }
};

//LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ success: false, message: "Email and password are required" });
    }

    // same message for both cases so nobody can check which emails exist
    const user = await userModel.findOne({ email });
    const match = user && (await comparePassword(password, user.password));
    if (!match) {
      return res.status(401).send({ success: false, message: "Invalid email or password" });
    }

    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login successful",
      user: publicUser(user),
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error in login" });
  }
};

//FORGOT PASSWORD
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email || !answer || !newPassword) {
      return res.status(400).send({ success: false, message: "All fields are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).send({ success: false, message: "Password must be at least 6 characters" });
    }

    const user = await userModel.findOne({ email });
    let answerMatches = false;
    if (user) {
      // accounts made before answers were hashed still have plain text answers
      answerMatches = user.answer.startsWith("$2")
        ? await comparePassword(normalizeAnswer(answer), user.answer)
        : user.answer === answer;
    }
    if (!answerMatches) {
      return res.status(400).send({ success: false, message: "Wrong email or answer" });
    }

    user.password = await hashPassword(newPassword);
    user.answer = await hashPassword(normalizeAnswer(answer));
    await user.save();

    res.status(200).send({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Something went wrong" });
  }
};

//UPDATE PROFILE
export const updateProfileController = async (req, res) => {
  try {
    const { name, password, address, phone } = req.body;
    if (password && password.length < 6) {
      return res.status(400).send({ success: false, message: "Password must be at least 6 characters" });
    }

    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (password) user.password = await hashPassword(password);
    await user.save();

    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      user: publicUser(user),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error while updating profile" });
  }
};

//ALL USERS (admin)
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel
      .find({})
      .select("name email phone role createdAt")
      .sort({ createdAt: -1 });
    res.status(200).send({ success: true, users });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error while fetching users" });
  }
};
