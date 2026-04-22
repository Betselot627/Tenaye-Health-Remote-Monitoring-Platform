import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
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
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    amount: { type: Number, required: true },
    currency: { type: String, default: "ETB" },
    gateway: { type: String, enum: ["chapa", "telebirr"] },
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    tx_ref: { type: String },
    paid_at: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.model("Payment", paymentSchema);
