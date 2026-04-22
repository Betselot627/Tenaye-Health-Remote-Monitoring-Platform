import { Router } from "express";
import { getDoctors, getDoctorById } from "../controllers/doctorController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
router.get("/", protect, getDoctors);
router.get("/:id", protect, getDoctorById);
export default router;
