import { Router } from "express";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import {
  createPrescription,
  getMyPrescriptions,
  getPatientPrescriptions,
  getPrescriptionById,
  updatePrescriptionStatus,
  getDoctorPrescriptions,
  generatePrescriptionPDF,
} from "../controllers/prescriptionController.js";

const router = Router();

// Create prescription (doctor only)
router.post(
  "/",
  protect,
  requireRole("doctor"),
  createPrescription
);

// Get my prescriptions (patient)
router.get(
  "/my-prescriptions",
  protect,
  requireRole("patient"),
  getMyPrescriptions
);

// Get all prescriptions created by this doctor
router.get(
  "/doctor/mine",
  protect,
  requireRole("doctor"),
  getDoctorPrescriptions
);

// Get prescriptions for a specific patient (doctor)
router.get(
  "/patient/:patientId",
  protect,
  requireRole("doctor"),
  getPatientPrescriptions
);

// Get single prescription by ID
router.get(
  "/:id",
  protect,
  getPrescriptionById
);

// Update prescription status (doctor only)
router.patch(
  "/:id/status",
  protect,
  requireRole("doctor"),
  updatePrescriptionStatus
);

// Download prescription as PDF (doctor or patient)
router.get(
  "/:id/download",
  protect,
  generatePrescriptionPDF
);

export default router;
