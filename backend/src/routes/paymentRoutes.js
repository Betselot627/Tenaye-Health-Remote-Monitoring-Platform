import { Router } from "express";
import {
  getPayments,
  initiatePayment,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
router.get("/", protect, getPayments);
router.post("/init", protect, initiatePayment);
export default router;
