import { Router } from "express";
const router = Router();

// POST /api/notifications/send
router.post("/send", (req, res) => {
  res.json({ message: "Notification sent — coming soon" });
});

export default router;
