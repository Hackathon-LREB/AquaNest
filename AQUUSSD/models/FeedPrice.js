import mongoose from "mongoose";

const feedPriceSchema = new mongoose.Schema(
  {
    feedType: {
      type: String,
      enum: ["Starter", "Grower", "Finisher"],
      required: true,
    },
    pricePerKg: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("FeedPrice", feedPriceSchema);
