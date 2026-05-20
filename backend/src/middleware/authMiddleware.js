import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_SECRET } from "../config/env.js";

export const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token)
      return res.status(401).json({ message: "Not authorized, no token" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId || decoded.id || decoded._id;

    if (!userId)
      return res.status(401).json({ message: "Token missing user id" });

    req.user = await User.findById(userId).select("-password");
    if (!req.user) return res.status(401).json({ message: "User not found" });
    if (req.user.is_blocked)
      return res.status(403).json({ message: "Account suspended" });

    next();
  } catch (error) {
    res
      .status(401)
      .json({ message: "Token invalid or expired", error: error.message });
  }
};

export const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
