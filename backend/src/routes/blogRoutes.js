import { Router } from "express";
import {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleLike,
} from "../controllers/blogController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
// Public routes - anyone can view blogs
router.get("/", getBlogs);
router.get("/:id", getBlogById);
// Protected routes - only logged in users
router.post("/", protect, createBlog);
router.put("/:id", protect, updateBlog);
router.delete("/:id", protect, deleteBlog);
router.patch("/:id/like", protect, toggleLike);
export default router;
