import { Router } from "express";
const router = Router();

// POST /api/payment/chapa/initiate
router.post("/chapa/initiate", (req, res) => {
  res.json({ message: "Chapa payment initiation — coming soon" });
});

// POST /api/payment/chapa/verify
router.post("/chapa/verify", (req, res) => {
  res.json({ message: "Chapa payment verification — coming soon" });
});

// POST /api/payment/telebirr/initiate
router.post("/telebirr/initiate", (req, res) => {
  res.json({ message: "TeleBirr payment initiation — coming soon" });
});

// POST /api/payment/webhook
router.post("/webhook", (req, res) => {
  res.json({ received: true });
});

export default router;
