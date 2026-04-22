import Doctor from "../models/Doctor.js";

export const getDoctors = async (req, res) => {
  try {
    const { specialty, search } = req.query;
    const filter = { is_verified: true };
    if (specialty) filter.specialty = specialty;
    const doctors = await Doctor.find(filter)
      .populate("user", "full_name avatar_url")
      .sort({ rating: -1 });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      "user",
      "full_name avatar_url email",
    );
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
