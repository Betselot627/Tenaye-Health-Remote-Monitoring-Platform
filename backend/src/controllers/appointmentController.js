import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";
import Payment from "../models/Payment.js";

export const createAppointment = async (req, res) => {
  try {
    const { doctor, scheduled_at } = req.body;
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
