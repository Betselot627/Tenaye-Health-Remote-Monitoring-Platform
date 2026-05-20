import Doctor from "../models/Doctor.js";
import User from "../models/User.js";
import Payment from "../models/Payment.js";
import Appointment from "../models/Appointment.js";

const buildDoctorResponse = (doctor) => ({
  id: doctor._id,
  name: doctor.user?.full_name
    ? doctor.user.full_name.startsWith("Dr.")
      ? doctor.user.full_name
      : `Dr. ${doctor.user.full_name}`
    : "Dr. Unknown",
  specialty: doctor.specialty,
  experience: doctor.years_experience
    ? `${doctor.years_experience} Years`
    : "N/A",
  rating: doctor.rating ?? 0,
  status: doctor.status || (doctor.is_verified ? "approved" : "pending"),
  fee: doctor.consultation_fee ?? 0,
  hospital: doctor.hospital,
  bio: doctor.bio,
  phone: doctor.user?.phone,
  email: doctor.user?.email,
  license_number: doctor.license_number,
});

// GET /api/admin/doctors
export const getDoctors = async (_req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate("user", "full_name email phone avatar_url")
      .sort({ createdAt: -1 });

    res.json(doctors.map(buildDoctorResponse));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/admin/doctors/:id
export const updateDoctorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "pending", "suspended"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    doctor.status = status;
    doctor.is_verified = status === "approved";
    await doctor.save();

    await doctor.populate("user", "full_name email phone avatar_url");

    res.json({
      message: "Doctor updated",
      doctor: buildDoctorResponse(doctor),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/admin/doctors/:id
export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    await User.findByIdAndDelete(doctor.user);
    await Doctor.findByIdAndDelete(id);

    res.json({ message: "Doctor deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/payments
export const getAllPayments = async (_req, res) => {
  try {
    const payments = await Payment.find()
      .populate("patient", "full_name email")
      .populate({
        path: "doctor",
        populate: { path: "user", select: "full_name" },
      })
      .populate("appointment", "scheduled_at status")
      .sort({ createdAt: -1 });

    const formattedPayments = payments.map((p) => ({
      id: p._id,
      tx_ref: p.tx_ref,
      patient: p.patient?.full_name || "Unknown",
      patient_email: p.patient?.email,
      doctor: p.doctor?.user?.full_name || "Unknown",
      amount: p.amount,
      gateway: p.gateway,
      status: p.status,
      paid_at: p.paid_at,
      created_at: p.createdAt,
      receipt_url: p.receipt_url,
      receipt_filename: p.receipt_filename,
    }));

    res.json(formattedPayments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/admin/payments/:id/approve
export const approvePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status !== "awaiting_verification") {
      return res
        .status(400)
        .json({ message: "Payment is not awaiting verification" });
    }

    payment.status = "paid";
    payment.paid_at = new Date();
    await payment.save();

    res.json({ message: "Payment approved", payment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/admin/payments/:id/reject
export const rejectPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status !== "awaiting_verification") {
      return res
        .status(400)
        .json({ message: "Payment is not awaiting verification" });
    }

    payment.status = "failed";
    payment.rejection_reason = reason;
    await payment.save();

    res.json({ message: "Payment rejected", payment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/stats
export const getDashboardStats = async (_req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalPatients, activeDoctors, appointmentsToday, revenueResult] =
      await Promise.all([
        User.countDocuments({ role: "patient" }),
        Doctor.countDocuments({ is_verified: true }),
        Appointment.countDocuments({ scheduled_at: { $gte: today } }),
        Payment.aggregate([
          { $match: { status: "paid" } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
      ]);

    res.json({
      totalPatients,
      activeDoctors,
      appointmentsToday,
      totalRevenue: revenueResult[0]?.total ?? 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/users
export const getAllUsers = async (_req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/admin/users/:id/block
export const blockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { is_blocked: true },
      { new: true },
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User blocked", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/admin/users/:id/unblock
export const unblockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { is_blocked: false },
      { new: true },
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User unblocked", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/appointments
export const getAllAppointments = async (_req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "full_name email")
      .populate({
        path: "doctor",
        populate: { path: "user", select: "full_name" },
      })
      .sort({ scheduled_at: -1 });

    res.json(
      appointments.map((a) => ({
        id: a._id,
        patient: a.patient?.full_name || "Unknown",
        patient_email: a.patient?.email,
        doctor: a.doctor?.user?.full_name
          ? `Dr. ${a.doctor.user.full_name}`
          : "Unknown",
        specialty: a.doctor?.specialty || "",
        scheduled_at: a.scheduled_at,
        status: a.status,
        payment_status: a.payment?.status,
      })),
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/admin/appointments/:id/cancel
export const cancelAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true },
    );
    if (!appt)
      return res.status(404).json({ message: "Appointment not found" });
    res.json({ message: "Appointment cancelled", appointment: appt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
