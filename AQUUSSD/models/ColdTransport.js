import mongoose from "mongoose";

const coldTransportSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, required: true },
    pickup: { type: String, required: true },
    destination: { type: String, required: true },
    weightKg: { type: Number, required: true },
    status: { type: String, enum: ["Requested", "In Transit", "Delivered"], default: "Requested" },
  },
  { timestamps: true }
);

export default mongoose.model("ColdTransport", coldTransportSchema);
