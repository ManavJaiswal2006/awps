// models/History.ts
import mongoose from 'mongoose';

const historySchema = new mongoose.Schema(
  {
    email: String,
    cardId: String,
    action: String, // "entry" or "exit"
    timestamp: Date,
    duration: Number,
  },
  { timestamps: true }
);

export default mongoose.models.History || mongoose.model('History', historySchema);
