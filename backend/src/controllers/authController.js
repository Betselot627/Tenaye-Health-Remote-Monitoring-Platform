import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import generateToken from "../utils/generateToken.js";

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { full_name, email, password, gender, age, phone } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email already registered" });

    const user = await User.create({
      full_name,
      email,
      password,
      gender,
      age,
      phone,
    });
    res.status(201).json({
      _id: user._id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/register/doctor
export const registerDoctor = async (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      phone,
      gender,
      age,
      specialty,
      license_number,
      hospital,
      consultation_fee,
      years_experience,
      bio,
    } = req.body;

    if (!full_name || !email || !password || !phone || !specialty || !license_number || !hospital) {
      return res.status(400).json({
        message: "All doctor application fields are required",
      });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({
      full_name,
      email,
      password,
      gender,
      age,
      phone,
      role: "doctor",
    });

    const doctor = await Doctor.create({
      user: user._id,
      specialty,
      license_number,
      hospital,
      consultation_fee,
      years_experience,
      bio,
      status: "pending",
      is_verified: false,
    });

    await doctor.populate("user", "full_name email phone");

    res.status(201).json({
      message: "Doctor application submitted",
      doctor,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    if (user.role === "doctor") {
      const doctor = await Doctor.findOne({ user: user._id });
      if (!doctor) {
        return res.status(403).json({ message: "Doctor account not approved yet" });
      }
      if (doctor.status !== "approved" || !doctor.is_verified) {
        return res.status(403).json({ message: "Doctor account pending approval" });
      }
    }

    res.json({
      _id: user._id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      avatar_url: user.avatar_url,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  res.json(req.user);
};
