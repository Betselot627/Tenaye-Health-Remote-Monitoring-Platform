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
    gateway: { type: String, enum: ["chapa", "receipt_upload"] },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "awaiting_verification"],
      default: "pending",
    },
    tx_ref: { type: String },
    paid_at: { type: Date },
    receipt_url: { type: String },
    receipt_filename: { type: String },
    rejection_reason: { type: String },
    chapa_transaction_id: { type: String }, // From Chapa webhook
  },
  { timestamps: true },
);

export default mongoose.model("Payment", paymentSchema);
