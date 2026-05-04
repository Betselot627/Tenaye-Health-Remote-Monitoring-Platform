import Payment from "../models/Payment.js";
import fs from "fs";
import path from "path";
import axios from "axios";

export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ patient: req.user._id })
      .populate({
        path: "doctor",
        populate: { path: "user", select: "full_name" },
      })
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const initiatePayment = async (req, res) => {
  try {
    const { doctor, appointment, amount, gateway } = req.body;

    // Validate request and authentication
    if (!req.user) {
      console.error('Initiate payment: missing authenticated user in request');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!doctor || !amount || !gateway) {
      console.error('Initiate payment: missing required fields', { doctor, amount, gateway });
      return res.status(400).json({ message: 'doctor, amount and gateway are required' });
    }

    // Validate amount
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }
    if (numericAmount > 100000) {
      return res.status(400).json({ message: 'Amount exceeds maximum allowed (100,000 ETB)' });
    }

    const tx_ref = `RPHMS-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    console.log('Initiating payment:', { doctor, appointment, amount, gateway, tx_ref, user: req.user && req.user.email });
    
    let checkout_url = null;
    
    // If Chapa gateway, initialize payment with Chapa API first
    if (gateway === 'chapa') {
      const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;
      
      if (!CHAPA_SECRET_KEY) {
        console.error('CHAPA_SECRET_KEY not set');
        return res.status(500).json({
          message: 'Payment gateway not configured',
        });
      }
      
      console.log('User data:', { email: req.user.email, full_name: req.user.full_name });
      
      // Validate/fix email for Chapa - generate unique fallback based on user ID
      let userEmail = req.user.email;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userEmail)) {
        console.warn('Invalid email detected, using generated fallback for user:', req.user._id);
        userEmail = `patient-${req.user._id.toString().slice(-8)}@tenayehealth.com`;
      }

      const chapaData = {
        amount: String(amount),
        currency: 'ETB',
        email: userEmail,
        first_name: req.user.full_name?.split(' ')[0] || 'Patient',
        last_name: req.user.full_name?.split(' ').slice(1).join(' ') || 'User',
        tx_ref: tx_ref,
        callback_url: `${process.env.CORS_ORIGIN || 'http://localhost:5173'}/patient/billing?tx_ref=${tx_ref}`,
        return_url: `${process.env.CORS_ORIGIN || 'http://localhost:5173'}/patient/billing?tx_ref=${tx_ref}`,
        customization: {
          title: 'Tenaye Health',
          description: 'Doctor Consultation',
        },
      };
      
      console.log('Chapa request data:', chapaData);
      
      try {
        const resp = await axios.post('https://api.chapa.co/v1/transaction/initialize', chapaData, {
          headers: {
            Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        });
        
        const data = resp.data;
        console.log('Chapa API response:', data);
        
        // Chapa typically returns { status, message, data: { checkout_url, ... } }
        checkout_url = data?.data?.checkout_url || data?.checkout_url;
        
        if (!checkout_url) {
          console.error('Chapa response missing checkout_url', data);
          return res.status(502).json({
            message: 'Payment provider did not return checkout URL',
            chapaResponse: data,
          });
        }
        
        console.log('Chapa checkout URL received:', checkout_url);
      } catch (chapaError) {
        console.error('Chapa API error:', chapaError?.response?.data ?? chapaError.message ?? chapaError);
        return res.status(500).json({
          message: 'Chapa API error',
          error: chapaError?.response?.data ?? chapaError.message ?? 'Internal error',
        });
      }
    }
    
    // Only create payment record AFTER successful gateway initialization
    // This prevents orphaned payment records if gateway fails
    const payment = await Payment.create({
      patient: req.user._id,
      doctor,
      appointment,
      amount,
      gateway,
      tx_ref,
      status: gateway === 'chapa' && checkout_url ? 'pending' : 'pending',
    });
    
    console.log('Payment created:', { paymentId: payment._id, checkout_url });
    
    res
      .status(201)
      .json({ 
        payment, 
        tx_ref, 
        checkout_url,
        message: `${gateway} payment initiated` 
      });
  } catch (err) {
    console.log('Payment initiation error:', err);
    res.status(500).json({ message: err.message });
  }
};

export const uploadReceipt = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { paymentId } = req.body;
    
    if (!paymentId) {
      return res.status(400).json({ message: "Payment ID is required" });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const receiptUrl = `/uploads/receipts/${req.file.filename}`;
    payment.receipt_url = receiptUrl;
    payment.receipt_filename = req.file.originalname;
    payment.gateway = "receipt_upload";
    payment.status = "awaiting_verification";
    await payment.save();

    res.json({ 
      payment, 
      message: "Receipt uploaded successfully. Payment is awaiting verification." 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const verifyChapaPayment = async (req, res) => {
  try {
    const { tx_ref } = req.params;
    
    const payment = await Payment.findOne({ tx_ref });
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;
    if (!CHAPA_SECRET_KEY) {
      console.error('CHAPA_SECRET_KEY not set');
      return res.status(500).json({
        message: 'Payment gateway not configured',
      });
    }

    try {
      const verifyUrl = `https://api.chapa.co/v1/transaction/verify/${encodeURIComponent(tx_ref)}`;
      const resp = await axios.get(verifyUrl, {
        headers: { Authorization: `Bearer ${CHAPA_SECRET_KEY}` },
        timeout: 15000,
      });

      const data = resp.data;
      console.log('Chapa verify response:', data);

      // Chapa returns { status, message, data: { status, tx_ref, ... } }
      const status = data?.data?.status || data?.status;
      const isSuccess = String(status).toLowerCase() === 'success' || String(status).toLowerCase() === 'successful';

      if (isSuccess) {
        payment.status = 'paid';
        payment.paid_at = new Date();
        await payment.save();
        
        return res.json({ 
          payment, 
          message: "Payment verified successfully" 
        });
      } else {
        payment.status = 'failed';
        await payment.save();
        
        return res.status(400).json({ 
          message: "Payment verification failed",
          chapaResponse: data 
        });
      }
    } catch (chapaError) {
      console.error('Chapa verify error:', chapaError?.response?.data ?? chapaError.message ?? chapaError);
      return res.status(500).json({ 
        message: 'Chapa API error',
        error: chapaError?.response?.data ?? chapaError.message ?? 'Internal error',
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Chapa Webhook Handler
 * Receives async payment notifications from Chapa
 * POST /api/payments/webhook/chapa
 */
export const handleChapaWebhook = async (req, res) => {
  try {
    const { tx_ref, status, transaction_id } = req.body;
    
    // Validate webhook secret if configured
    const webhookSecret = process.env.CHAPA_WEBHOOK_SECRET;
    if (webhookSecret) {
      const signature = req.headers['x-chapa-signature'];
      // TODO: Implement signature verification if Chapa provides it
    }
    
    console.log('Chapa webhook received:', { tx_ref, status, transaction_id });
    
    if (!tx_ref || !status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const payment = await Payment.findOne({ tx_ref });
    if (!payment) {
      console.error('Webhook: Payment not found for tx_ref:', tx_ref);
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    // Update payment status based on webhook
    const normalizedStatus = String(status).toLowerCase();
    if (normalizedStatus === 'success' || normalizedStatus === 'successful') {
      payment.status = 'paid';
      payment.paid_at = new Date();
      payment.chapa_transaction_id = transaction_id;
    } else if (normalizedStatus === 'failed' || normalizedStatus === 'cancelled') {
      payment.status = 'failed';
    }
    
    await payment.save();
    console.log('Payment updated via webhook:', { tx_ref, newStatus: payment.status });
    
    // Acknowledge webhook immediately
    res.status(200).json({ message: 'Webhook processed' });
  } catch (err) {
    console.error('Webhook error:', err);
    // Still return 200 to prevent Chapa from retrying indefinitely
    // Log error for manual investigation
    res.status(200).json({ message: 'Webhook received' });
  }
};

/**
 * Verify SOS Emergency payment/subscription
 * POST /api/payments/verify-sos
 */
export const verifySOSPayment = async (req, res) => {
  try {
    const { userId, serviceType } = req.body;

    // Verify the requesting user matches the token
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Check for active subscription or recent payment for SOS service
    const recentPayment = await Payment.findOne({
      patient: userId,
      status: "paid",
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Within 30 days
    });

    // Also check for any successful appointment payments
    const appointmentPayment = await Payment.findOne({
      patient: userId,
      status: "paid",
      appointment: { $exists: true },
    });

    // For demo/development: auto-approve if user is authenticated
    // In production, implement proper subscription/payment check
    const isVerified = !!recentPayment || !!appointmentPayment || process.env.NODE_ENV === "development";

    if (isVerified) {
      res.json({
        verified: true,
        message: "Payment verified - Emergency services enabled",
        serviceType: serviceType || "sos_emergency",
      });
    } else {
      res.status(402).json({
        verified: false,
        message: "Payment required - Please complete a consultation payment to access emergency services",
        serviceType: serviceType || "sos_emergency",
      });
    }
  } catch (err) {
    console.error("SOS payment verification error:", err);
    res.status(500).json({
      verified: false,
      message: "Payment verification failed",
      error: err.message,
    });
  }
};

// Get all payments/earnings for doctor's appointments
export const getDoctorEarnings = async (req, res) => {
  try {
    const mongoose = await import("mongoose");
    const doctor = await mongoose.model('Doctor').findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    // Find all payments for appointments with this doctor
    const payments = await Payment.find({ doctor: doctor._id })
      .populate({
        path: "appointment",
        select: "scheduled_at status",
      })
      .populate({
        path: "patient",
        select: "full_name email",
      })
      .sort({ createdAt: -1 });

    // Calculate stats
    const totalPaid = payments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const totalPending = payments
      .filter(p => p.status === 'awaiting_verification' || p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalTransactions = payments.length;
    const paidCount = payments.filter(p => p.status === 'paid').length;

    res.json({
      payments,
      stats: {
        totalPaid,
        totalPending,
        totalTransactions,
        paidCount,
        pendingCount: totalTransactions - paidCount,
      },
    });
  } catch (err) {
    console.error("Get doctor earnings error:", err);
    res.status(500).json({ message: err.message });
  }
};

