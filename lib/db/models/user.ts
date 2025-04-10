import mongoose from "mongoose";

const parkingEventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["entry", "exit"],
      required: true,
    },
    amountDeducted: {
      type: Number,
      default: 0,
    },
    time: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false } // Prevents Mongoose from creating an _id for each subdocument
);

const transactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    time: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 },
  rfid: {
    type: String,
    unique: true,
    required: true,
  },
  activeParking: { type: Boolean, default: false },
  parkingHistory: [parkingEventSchema],
  transactionHistory: [transactionSchema],
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
