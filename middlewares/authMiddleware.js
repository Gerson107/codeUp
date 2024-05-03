import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

const checkUserRole = async (req, res, next, role) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== role) {
      return res.status(401).send({
        success: false,
        message: `Unauthorized access. You need to be a(n) ${role} to access this resource.`,
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

//Protected routes token base
export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).send({
        success: false,
        message: "Unauthorized access. Token is invalid or expired.",
    });
  }
};

//Admin access
export const isAdmin = async (req, res, next) => {
    return checkUserRole(req, res, next, 'admin');
}
//Organizer access
export const isOrganizer = async (req, res, next) => {
    return checkUserRole(req, res, next, 'organizer');
}