import { Router } from "express";
import {
  getBlogs,
  getBlogById,
  createBlog,
  toggleLike,
} from "../controllers/blogController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
router.get("/", protect, getBlogs);
router.get("/:id", protect, getBlogById);
router.post("/", protect, createBlog);
router.patch("/:id/like", protect, toggleLike);
export default router;
