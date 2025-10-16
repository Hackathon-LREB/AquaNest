import mongoose from "mongoose";
const ussdSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    serviceCode: {
      type: String,
    },
    text: {
      type: String,
    },
    // optional structured data for analytics or actions
    actionType: {
      type: String,
      enum: [
        "record_stock",
        "check_feed_price",
        "book_buyer",
        "cold_transport",
        "farming_tips",
        "unknown",
      ],
      default: "unknown",
    },
    // dynamic details based on the selected option
    data: {
      pond: String,
      numberOfFish: Number,
      avgWeight: Number,
      feedType: String,
      feedPrice: Number,
      quantity: Number,
      location: String,
      pickup: String,
      destination: String,
      transportWeight: Number,
      tipCategory: String,
      tipMessage: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("UssdSession", ussdSessionSchema);
