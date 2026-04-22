import mongoose from "mongoose";

const labOrderSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    test_name: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    result: { type: String },
    ordered_at: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export default mongoose.model("LabOrder", labOrderSchema);
