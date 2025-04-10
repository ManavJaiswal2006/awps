// lib/db/models/parkingSession.ts
import mongoose from "mongoose"

const parkingSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  entryTime: { type: Date, required: true },
  exitTime: { type: Date, default: null },
  duration: { type: Number, default: 0 },
})

const ParkingSession =
  mongoose.models.ParkingSession || mongoose.model("ParkingSession", parkingSessionSchema)

export default ParkingSession
