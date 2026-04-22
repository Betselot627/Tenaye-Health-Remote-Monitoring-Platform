import { Router } from "express";
const router = Router();

// POST /api/call/create-room
router.post("/create-room", (req, res) => {
  const roomId = `room_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  res.json({ roomId });
});

// POST /api/call/end-room
router.post("/end-room", (req, res) => {
  res.json({ success: true });
});

export default router;
