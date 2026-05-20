import { Router } from "express";
import {
  register,
  registerDoctor,
  login,
  getMe,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = Router();
router.post("/register", authLimiter, register);
router.post("/register/doctor", authLimiter, registerDoctor);
router.post("/login", authLimiter, login);
router.get("/me", protect, getMe);
export default router;
