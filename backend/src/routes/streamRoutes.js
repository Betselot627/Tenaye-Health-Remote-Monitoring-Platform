import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  generateToken,
  createCall,
  endCall,
  getCallHistory,
} from "../controllers/streamController.js";

const router = Router();

// All routes are protected with JWT middleware

// Generate Stream user token
router.post("/token", protect, generateToken);

// Create a video call (for SOS or scheduled appointments)
router.post("/create-call", protect, createCall);

// End an active call
router.post("/end-call", protect, endCall);

// Get call history for the authenticated user
router.get("/call-history", protect, getCallHistory);

export default router;
