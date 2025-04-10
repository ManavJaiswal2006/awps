import mongoose from "mongoose"

const transactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  type: { type: String, enum: ["credit", "debit"], required: true },
  createdAt: { type: Date, default: Date.now },
})

export const Transaction =
  mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema)