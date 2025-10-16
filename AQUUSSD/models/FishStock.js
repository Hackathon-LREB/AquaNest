import mongoose from "mongoose";

const fishStockSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, required: true },
    pondName: { type: String, required: true },
    numberOfFish: { type: Number, required: true },
    averageWeight: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("FishStock", fishStockSchema);
