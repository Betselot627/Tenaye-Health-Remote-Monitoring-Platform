import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";
import Payment from "../models/Payment.js";

export const createAppointment = async (req, res) => {
  try {
    const { doctor, scheduled_at } = req.body;

    // Parse the scheduled_at string directly to preserve local time
    // The date comes in ISO format with timezone offset (e.g., 2026-05-03T09:00:00.000+01:00)
    const scheduledDate = new Date(scheduled_at);
    const startOfDay = new Date(scheduledDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(scheduledDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Find any existing appointments for this doctor at this exact time
    const existingAppointments = await Appointment.find({
      doctor,
      scheduled_at: scheduledDate,
      status: { $in: ["upcoming", "completed"] },
    });

    // Check if any of these have verified payments
    if (existingAppointments.length > 0) {
      const appointmentIds = existingAppointments.map(a => a._id);
      const payments = await Payment.find({
        appointment: { $in: appointmentIds },
        status: { $in: ["verified", "pending_verification"] },
      });

      if (payments.length > 0) {
        return res.status(409).json({
          message: "This time slot has already been booked. Please select a different time.",
          conflict: true,
        });
      }
    }

    const appt = await Appointment.create({
      patient: req.user._id,
      doctor,
      scheduled_at,
    });
    res.status(201).json(appt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const appts = await Appointment.find({ patient: req.user._id })
      .populate({
        path: "doctor",
        populate: { path: "user", select: "full_name avatar_url" },
      })
      .sort({ scheduled_at: 1 });
    
    // Get payment status for each appointment
    const apptsWithPayment = await Promise.all(
      appts.map(async (appt) => {
        const payment = await Payment.findOne({ appointment: appt._id })
          .select('status amount gateway paid_at')
          .lean();
        return {
          ...appt.toObject(),
          payment: payment || null,
        };
      })
    );
    
    res.json(apptsWithPayment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    // Get doctor profile for current user
    const doctor = await mongoose.model('Doctor').findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }
    
    const appts = await Appointment.find({ doctor: doctor._id })
      .populate({
        path: "patient",
        select: "full_name email avatar_url",
      })
      .sort({ scheduled_at: 1 });
    
    // Get payment status for each appointment
    const apptsWithPayment = await Promise.all(
      appts.map(async (appt) => {
        const payment = await Payment.findOne({ appointment: appt._id })
          .select('status amount gateway paid_at')
          .lean();
        return {
          ...appt.toObject(),
          payment: payment || null,
        };
      })
    );
    
    res.json(apptsWithPayment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Verify the user is the patient or the assigned doctor
    const isPatient = appt.patient.toString() === req.user._id.toString();
    let isDoctor = false;

    if (req.user.role === "doctor") {
      const doctorProfile = await mongoose.model("Doctor").findOne({ user: req.user._id });
      if (doctorProfile && appt.doctor.toString() === doctorProfile._id.toString()) {
        isDoctor = true;
      }
    }

    if (!isPatient && !isDoctor && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this appointment" });
    }

    appt.status = req.body.status;
    await appt.save();
    res.json(appt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Verify video call eligibility for appointment
 * POST /api/appointments/:id/verify-call
 */
export const verifyCallEligibility = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    // Get appointment with populated fields
    const appointment = await Appointment.findById(id)
      .populate({ path: "doctor", populate: { path: "user", select: "full_name" } })
      .populate("patient", "full_name");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found", eligible: false });
    }

    // Check if user is authorized (patient or assigned doctor)
    const isPatient = appointment.patient._id.toString() === userId.toString();
    let isDoctor = false;

    if (userRole === "doctor") {
      const doctorProfile = await mongoose.model("Doctor").findOne({ user: userId });
      if (doctorProfile && appointment.doctor._id.toString() === doctorProfile._id.toString()) {
        isDoctor = true;
      }
    }

    if (!isPatient && !isDoctor && userRole !== "admin") {
      return res.status(403).json({ message: "Not authorized for this appointment", eligible: false });
    }

    // Check appointment status
    if (appointment.status !== "upcoming") {
      return res.status(400).json({
        message: `Appointment is ${appointment.status}. Call only available for upcoming appointments.`,
        eligible: false,
      });
    }

    // Check payment status - must be paid and verified by admin
    const payment = await Payment.findOne({ appointment: id });
    if (!payment || payment.status !== "paid") {
      return res.status(402).json({
        message: "Payment required and must be verified by admin to join the call.",
        eligible: false,
        paymentStatus: payment?.status || "not_found",
      });
    }

    // Check appointment time window (15 min before to 30 min after scheduled time)
    // Convert both times to UTC for consistent comparison
    const scheduledTime = new Date(appointment.scheduled_at);
    const now = new Date();
    
    // Calculate call window in UTC timestamps
    const scheduledTimeMs = scheduledTime.getTime();
    const nowMs = now.getTime();
    const callWindowStartMs = scheduledTimeMs - 15 * 60 * 1000; // 15 min before
    const callWindowEndMs = scheduledTimeMs + 30 * 60 * 1000; // 30 min after

    if (nowMs < callWindowStartMs) {
      const minsUntilStart = Math.ceil((callWindowStartMs - nowMs) / 60000);
      return res.status(403).json({
        message: `Call will be available ${minsUntilStart} minutes before the scheduled time.`,
        eligible: false,
        callWindowStart: new Date(callWindowStartMs).toISOString(),
        callWindowEnd: new Date(callWindowEndMs).toISOString(),
        currentTime: now.toISOString(),
        scheduledTime: scheduledTime.toISOString(),
      });
    }

    if (nowMs > callWindowEndMs) {
      return res.status(403).json({
        message: "Call window has expired. You can only join 15 minutes before to 30 minutes after the scheduled time.",
        eligible: false,
        callWindowStart: new Date(callWindowStartMs).toISOString(),
        callWindowEnd: new Date(callWindowEndMs).toISOString(),
        currentTime: now.toISOString(),
        scheduledTime: scheduledTime.toISOString(),
      });
    }

    // All checks passed - user is eligible to join
    res.json({
      eligible: true,
      message: "You are eligible to join the video call.",
      appointment: {
        id: appointment._id,
        scheduledAt: appointment.scheduled_at,
        doctorName: appointment.doctor?.user?.full_name || "Doctor",
        patientName: appointment.patient?.full_name || "Patient",
        roomId: appointment.video_room_id || appointment._id.toString(),
      },
      paymentVerified: true,
      callWindow: {
        start: new Date(callWindowStartMs),
        end: new Date(callWindowEndMs),
      },
    });
  } catch (err) {
    console.error("Verify call eligibility error:", err);
    res.status(500).json({ message: err.message, eligible: false });
  }
};

// Get booked time slots for a doctor on a specific date
// This prevents double-booking by showing only available slots
export const getDoctorBookedSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({ message: "doctorId and date are required" });
    }

    // Parse the date to get start and end of day in UTC
    const [year, month, day] = date.split('-').map(Number);
    const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

    // Find all appointments for this doctor on this date
    // Only include appointments with verified payment (completed or pending call)
    const appointments = await Appointment.find({
      doctor: doctorId,
      scheduled_at: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: { $in: ["upcoming", "completed"] }, // Only active appointments
    }).select("scheduled_at");

    // Get payments for these appointments to check verification status
    const appointmentIds = appointments.map((a) => a._id);
    const payments = await Payment.find({
      appointment: { $in: appointmentIds },
      status: { $in: ["verified", "pending_verification"] }, // Only paid appointments
    }).select("appointment status");

    const paidAppointmentIds = payments.map((p) => p.appointment.toString());

    // Extract time slots from paid appointments using UTC to match frontend
    // Format: "08:00 AM", "12:30 PM", "06:30 PM" (2-digit hours)
    const bookedSlots = appointments
      .filter((a) => paidAppointmentIds.includes(a._id.toString()))
      .map((a) => {
        const date = new Date(a.scheduled_at);
        // Use UTC methods to ensure consistent time regardless of server timezone
        let hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        // Convert to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 becomes 12
        // Format with leading zeros to match TIME_SLOTS format
        const hoursStr = hours.toString().padStart(2, "0");
        const minutesStr = minutes.toString().padStart(2, "0");
        return `${hoursStr}:${minutesStr} ${ampm}`;
      });

    res.json({
      date,
      doctorId,
      bookedSlots,
      count: bookedSlots.length,
    });
  } catch (err) {
    console.error("Get booked slots error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get all unique patients who have appointments with this doctor
export const getDoctorPatients = async (req, res) => {
  try {
    // Get doctor profile for current user
    const doctor = await mongoose.model('Doctor').findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    // Find all appointments for this doctor and get unique patients
    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate({
        path: "patient",
        select: "full_name email avatar_url date_of_birth gender blood_type",
      })
      .select("patient status scheduled_at")
      .sort({ scheduled_at: -1 });

    // Get unique patients with their most recent appointment info
    const patientMap = new Map();
    appointments.forEach((apt) => {
      if (!apt.patient) return;
      
      const patientId = apt.patient._id.toString();
      if (!patientMap.has(patientId)) {
        patientMap.set(patientId, {
          ...apt.patient.toObject(),
          lastVisit: apt.scheduled_at,
          appointmentCount: 1,
          lastStatus: apt.status,
        });
      } else {
        const existing = patientMap.get(patientId);
        existing.appointmentCount += 1;
        // Keep the most recent visit
        if (new Date(apt.scheduled_at) > new Date(existing.lastVisit)) {
          existing.lastVisit = apt.scheduled_at;
          existing.lastStatus = apt.status;
        }
      }
    });

    const patients = Array.from(patientMap.values());
    res.json(patients);
  } catch (err) {
    console.error("Get doctor patients error:", err);
    res.status(500).json({ message: err.message });
  }
};
