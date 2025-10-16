import mongoose from "mongoose";

const farmingTipSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["Feeding", "Disease Control", "Water Management", "Breeding"],
      required: true,
    },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("FarmingTip", farmingTipSchema);
