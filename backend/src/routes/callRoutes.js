import { Router } from "express";
import mongoose from "mongoose";
import { protect } from "../middleware/authMiddleware.js";
import Appointment from "../models/Appointment.js";

const router = Router();

// Verify user is patient or doctor for the appointment
const verifyAppointmentAccess = async (appointmentId, userId, userRole) => {
  const appt = await Appointment.findById(appointmentId);
  if (!appt) return { allowed: false, error: "Appointment not found" };

  const isPatient = appt.patient.toString() === userId.toString();
  let isDoctor = false;

  if (userRole === "doctor") {
    const doctorProfile = await mongoose.model("Doctor").findOne({ user: userId });
    if (doctorProfile && appt.doctor.toString() === doctorProfile._id.toString()) {
      isDoctor = true;
    }
  }

  if (!isPatient && !isDoctor && userRole !== "admin") {
    return { allowed: false, error: "Not authorized to access this appointment" };
  }

  return { allowed: true, appt };
};

router.post("/create-room", protect, async (req, res) => {
  try {
    const { appointmentId } = req.body;
    if (!appointmentId) {
      return res.status(400).json({ message: "Appointment ID is required" });
    }

    const { allowed, error } = await verifyAppointmentAccess(
      appointmentId,
      req.user._id,
      req.user.role
    );
    if (!allowed) {
      return res.status(403).json({ message: error });
    }

    const roomId = `room_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    await Appointment.findByIdAndUpdate(appointmentId, {
      video_room_id: roomId,
    });
    res.json({ roomId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/end-room", protect, async (req, res) => {
  try {
    const { appointmentId } = req.body;
    if (!appointmentId) {
      return res.status(400).json({ message: "Appointment ID is required" });
    }

    const { allowed, error } = await verifyAppointmentAccess(
      appointmentId,
      req.user._id,
      req.user.role
    );
    if (!allowed) {
      return res.status(403).json({ message: error });
    }

    await Appointment.findByIdAndUpdate(appointmentId, {
      status: "completed",
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
