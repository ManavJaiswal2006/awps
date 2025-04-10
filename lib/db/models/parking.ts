import mongoose from 'mongoose';

const parkingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  entryTime: {
    type: Date,
    required: true
  },
  exitTime: {
    type: Date
  },
  duration: {
    type: Number
  },
  cost: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  },
  slotNumber: {
    type: Number,
    required: true
  }
});

export const Parking = mongoose.models.Parking || mongoose.model('Parking', parkingSchema);