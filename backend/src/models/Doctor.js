import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    specialty: { type: String, required: true },
    bio: { type: String },
    rating: { type: Number, default: 0 },
    years_experience: { type: Number },
    is_verified: { type: Boolean, default: false },
    consultation_fee: { type: Number },
    availability: [{ day: String, slots: [String] }],
  },
  { timestamps: true },
);

export default mongoose.model("Doctor", doctorSchema);
