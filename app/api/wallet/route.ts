// app/api/wallet/route.ts
import { connectDB } from "@/lib/mongodb"
import { Transaction } from "@/lib/db/models/transaction"
import { NextResponse } from "next/server"

export const GET = async () => {
  try {
    await connectDB()
    const transactions = await Transaction.find().sort({ createdAt: -1 })
    return NextResponse.json({ transactions })
  } catch (err) {
    console.error("Wallet fetch error:", err)
    return NextResponse.json({ error: "Failed to fetch wallet data" }, { status: 500 })
  }
}
