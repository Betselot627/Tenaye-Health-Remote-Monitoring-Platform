import { Router } from "express";
import {
  getDoctors,
  updateDoctorStatus,
  deleteDoctor,
  getAllPayments,
  approvePayment,
  rejectPayment,
} from "../controllers/adminController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect, requireRole("admin"));

router.get("/doctors", getDoctors);
router.patch("/doctors/:id", updateDoctorStatus);
router.delete("/doctors/:id", deleteDoctor);

router.get("/payments", getAllPayments);
router.patch("/payments/:id/approve", approvePayment);
router.patch("/payments/:id/reject", rejectPayment);

export default router;