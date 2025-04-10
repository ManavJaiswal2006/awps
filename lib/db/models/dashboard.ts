import mongoose from "mongoose"

const dashboardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // One dashboard per user
  },
  balance: {
    type: Number,
    default: 0,
  },
  currentParkingStatus: {
    isParked: { type: Boolean, default: false },
    entryTime: { type: Date },
  },
  parkingHistory: [
    {
      entryTime: Date,
      exitTime: Date,
      duration: Number, // in minutes
      cost: Number,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export const Dashboard =
  mongoose.models.Dashboard || mongoose.model("Dashboard", dashboardSchema)
