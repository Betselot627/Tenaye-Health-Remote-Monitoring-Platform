import mongoose from "mongoose";

const trackerSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tracker_type: { type: String, required: true }, // blood_sugar, blood_pressure, heart_rate, weight
    value: { type: Number, required: true },
    unit: { type: String, default: "ml" },
    note: { type: String },
    source: {
      type: String,
      enum: ["manual", "rppg_camera", "spo2_camera"],
      default: "manual",
    },
    confidence: { type: String, enum: ["high", "medium", "low"] },
    consultation: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    recorded_at: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export default mongoose.model("Tracker", trackerSchema);
