import { Router } from "express";
import {
  createAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
} from "../controllers/appointmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
router.post("/", protect, createAppointment);
router.get("/mine", protect, getMyAppointments);
router.get("/doctor", protect, getDoctorAppointments);
router.patch("/:id", protect, updateAppointmentStatus);
export default router;
