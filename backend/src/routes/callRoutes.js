import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import Appointment from "../models/Appointment.js";

const router = Router();

router.post("/create-room", protect, async (req, res) => {
  const roomId = `room_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  if (req.body.appointmentId) {
    await Appointment.findByIdAndUpdate(req.body.appointmentId, {
      video_room_id: roomId,
    });
  }
  res.json({ roomId });
});

router.post("/end-room", protect, async (req, res) => {
  if (req.body.appointmentId) {
    await Appointment.findByIdAndUpdate(req.body.appointmentId, {
      status: "completed",
    });
  }
  res.json({ success: true });
});

export default router;
