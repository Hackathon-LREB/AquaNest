import mongoose from "mongoose";

const buyerBookingSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, required: true },
    quantityKg: { type: Number, required: true },
    location: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Confirmed"], default: "Pending" },
  },
  { timestamps: true }
);

export default mongoose.model("BuyerBooking", buyerBookingSchema);
