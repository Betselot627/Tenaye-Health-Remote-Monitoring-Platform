import { Router } from "express";
import {
  addTracker,
  getTrackers,
  deleteTracker,
} from "../controllers/trackerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
router.post("/", protect, addTracker);
router.get("/", protect, getTrackers);
router.delete("/:id", protect, deleteTracker);
export default router;
