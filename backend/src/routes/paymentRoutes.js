import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import {
  getPayments,
  initiatePayment,
  uploadReceipt,
  verifyChapaPayment,
  handleChapaWebhook,
  verifySOSPayment,
  getDoctorEarnings,
} from "../controllers/paymentController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads/receipts');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for receipt uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'receipt-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and PDF files are allowed'));
    }
  }
});

// Wrapper to handle multer errors
const handleUpload = (req, res, next) => {
  upload.single('receipt')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        // Multer-specific errors (file size, etc.)
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
        }
        return res.status(400).json({ message: `Upload error: ${err.message}` });
      }
      // Other errors (file type, etc.)
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

const router = Router();
router.get("/", protect, getPayments);
router.get("/doctor/earnings", protect, requireRole("doctor"), getDoctorEarnings);
router.post("/init", protect, initiatePayment);
router.post("/upload-receipt", protect, handleUpload, uploadReceipt);
router.get("/verify-chapa/:tx_ref", protect, verifyChapaPayment);

// SOS Emergency payment verification
router.post("/verify-sos", protect, verifySOSPayment);

// Public webhook endpoint (called by Chapa servers)
router.post("/webhook/chapa", handleChapaWebhook);

export default router;
