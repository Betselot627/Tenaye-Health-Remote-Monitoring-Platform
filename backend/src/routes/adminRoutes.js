import { Router } from "express";
import { getDoctors, updateDoctorStatus, deleteDoctor } from "../controllers/adminController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect, requireRole("admin"));

router.get("/doctors", getDoctors);
router.patch("/doctors/:id", updateDoctorStatus);
router.delete("/doctors/:id", deleteDoctor);

export default router;