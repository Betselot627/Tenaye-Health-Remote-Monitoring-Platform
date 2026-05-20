import { Router } from "express";
import {
  getDoctors,
  updateDoctorStatus,
  deleteDoctor,
  getAllPayments,
  approvePayment,
  rejectPayment,
  getDashboardStats,
  getAllUsers,
  blockUser,
  unblockUser,
  getAllAppointments,
  cancelAppointment,
} from "../controllers/adminController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect, requireRole("admin"));

// Stats
router.get("/stats", getDashboardStats);

// Users
router.get("/users", getAllUsers);
router.patch("/users/:id/block", blockUser);
router.patch("/users/:id/unblock", unblockUser);

// Doctors
router.get("/doctors", getDoctors);
router.patch("/doctors/:id", updateDoctorStatus);
router.delete("/doctors/:id", deleteDoctor);

// Appointments
router.get("/appointments", getAllAppointments);
router.patch("/appointments/:id/cancel", cancelAppointment);

// Payments
router.get("/payments", getAllPayments);
router.patch("/payments/:id/approve", approvePayment);
router.patch("/payments/:id/reject", rejectPayment);

export default router;
