import mongoose from "mongoose";

const totalSlotsSchema = new mongoose.Schema({
  count: {
    type: Number,
    required: true,
    default: 10 // or any number of default slots you have
  }
});

export const TotalSlots = mongoose.models.TotalSlots || mongoose.model("TotalSlots", totalSlotsSchema);
