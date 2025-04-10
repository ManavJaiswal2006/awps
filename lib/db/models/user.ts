import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  balance: { type: Number, default: 0 },
  rfidTag: { type: String, unique: true, sparse: true, default: null },
  activeParking: { type: Boolean, default: false },
  parkingHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSession' }],
  createdAt: { type: Date, default: Date.now }
})

export const User = mongoose.models.User || mongoose.model('User', userSchema)
