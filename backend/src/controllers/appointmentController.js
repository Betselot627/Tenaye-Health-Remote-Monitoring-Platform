import Appointment from "../models/Appointment.js";

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
    res.json(appts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const appt = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true },
    );
    res.json(appt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
