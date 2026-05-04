import { Router } from "express";
import {
  createAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  verifyCallEligibility,
  getDoctorBookedSlots,
  getDoctorPatients,
} from "../controllers/appointmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
router.post("/", protect, createAppointment);
router.get("/mine", protect, getMyAppointments);
router.get("/doctor", protect, getDoctorAppointments);
router.get("/doctor/patients", protect, getDoctorPatients);
router.patch("/:id", protect, updateAppointmentStatus);
router.post("/:id/verify-call", protect, verifyCallEligibility);
router.get("/doctor/booked-slots", protect, getDoctorBookedSlots);
export default router;
