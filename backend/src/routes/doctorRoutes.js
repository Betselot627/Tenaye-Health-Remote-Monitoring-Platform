import { Router } from "express";
import { getDoctors, getDoctorById, getDoctorProfile, updateDoctorProfile } from "../controllers/doctorController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = Router();
router.get("/", protect, getDoctors);
router.get("/profile/me", protect, requireRole("doctor"), getDoctorProfile);
router.patch("/profile/me", protect, requireRole("doctor"), updateDoctorProfile);
router.get("/:id", protect, getDoctorById);
export default router;
