import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

//Protected Routes token base
export const requireSignIn = (req, res, next) => {
  try {
    // accept both "Bearer <token>" and the raw token
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).send({ success: false, message: "Please login first" });
    }
    req.user = JWT.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).send({ success: false, message: "Session expired, please login again" });
  }
};

//admin acceess
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user || user.role !== 1) {
      return res.status(403).send({
        success: false,
        message: "Admin access only",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in admin middleware",
    });
  }
};
