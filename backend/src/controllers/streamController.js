import { StreamClient } from "@stream-io/node-sdk";
import CallLog from "../models/CallLog.js";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";

// Lazy-initialize Stream client so missing env vars don't crash the server
let _streamClient = null;
const getStreamClient = () => {
  if (!_streamClient) {
    const key = process.env.STREAM_API_KEY;
    const secret = process.env.STREAM_API_SECRET;
    if (!key || !secret) {
      throw new Error(
        "STREAM_API_KEY and STREAM_API_SECRET must be set in .env",
      );
    }
    _streamClient = new StreamClient(key, secret);
  }
  return _streamClient;
};

/**
 * Generate a user token for Stream Video/Chat
 * POST /api/stream/token
 */
export const generateToken = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // Generate a user token valid for 24 hours
    const token = getStreamClient().generateUserToken({
      user_id: userId,
      exp: Math.round(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
    });

    res.json({
      token,
      apiKey: process.env.STREAM_API_KEY,
      userId,
    });
  } catch (error) {
    console.error("[Stream] Token generation error:", error);
    res
      .status(500)
      .json({ message: "Failed to generate token", error: error.message });
  }
};

/**
 * Create a video call between patient and doctor
 * POST /api/stream/create-call
 */
export const createCall = async (req, res) => {
  try {
    const { patientId, doctorId } = req.body;

    if (!patientId || !doctorId) {
      return res.status(400).json({
        message: "Both patientId and doctorId are required",
      });
    }

    // Verify patient exists
    const patient = await User.findById(patientId);
    if (!patient || patient.role !== "patient") {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Verify doctor exists
    const doctor = await Doctor.findById(doctorId).populate(
      "user",
      "full_name",
    );
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Create a unique call ID
    const callId = `sos_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Create the call using Stream API
    const call = getStreamClient().video.call("default", callId);
    await call.create({
      data: {
        created_by_id: patientId,
        members: [
          { user_id: patientId, role: "admin" },
          { user_id: doctor.user._id.toString(), role: "admin" },
        ],
      },
    });

    // Log the call in database
    const callLog = await CallLog.create({
      patientId,
      doctorId,
      callId,
      status: "active",
    });

    res.json({
      callId,
      callLogId: callLog._id,
      patient: {
        id: patientId,
        name: patient.full_name,
      },
      doctor: {
        id: doctorId,
        name: doctor.user.full_name,
      },
    });
  } catch (error) {
    console.error("[Stream] Call creation error:", error);
    res
      .status(500)
      .json({ message: "Failed to create call", error: error.message });
  }
};

/**
 * End an active call
 * POST /api/stream/end-call
 */
export const endCall = async (req, res) => {
  try {
    const { callId } = req.body;

    if (!callId) {
      return res.status(400).json({ message: "callId is required" });
    }

    // Update call status in database
    await CallLog.findOneAndUpdate({ callId }, { status: "ended" });

    res.json({ message: "Call ended successfully" });
  } catch (error) {
    console.error("[Stream] End call error:", error);
    res
      .status(500)
      .json({ message: "Failed to end call", error: error.message });
  }
};

/**
 * Get call history for a user
 * GET /api/stream/call-history
 */
export const getCallHistory = async (req, res) => {
  try {
    const { role } = req.user;
    const userId = req.user._id;

    let query = {};
    if (role === "patient") {
      query = { patientId: userId };
    } else if (role === "doctor") {
      // Get doctor profile to find doctorId
      const doctor = await Doctor.findOne({ user: userId });
      if (doctor) {
        query = { doctorId: doctor._id };
      }
    }

    const callHistory = await CallLog.find(query)
      .populate("patientId", "full_name")
      .populate("doctorId", "specialty")
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(callHistory);
  } catch (error) {
    console.error("[Stream] Get call history error:", error);
    res
      .status(500)
      .json({ message: "Failed to get call history", error: error.message });
  }
};
