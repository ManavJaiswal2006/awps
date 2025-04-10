import { connectDB } from "@/lib/mongodb"
import { Transaction } from "@/lib/db/models/transaction"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (req: NextRequest) => {
  try {
    await connectDB()
    console.log("✅ Database connected successfully")

    const { amount } = await req.json()
    console.log("Received amount:", amount)

    if (!amount || isNaN(amount)) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    const transaction = await Transaction.create({
      amount,
      type: "credit",
    })
    console.log("✅ Transaction created:", transaction)

    return NextResponse.json({ transaction })
  } catch (err: any) {
    if (err.name === "ValidationError") {
      console.error("❌ Validation Error:", err)
      return NextResponse.json({ error: "Validation error", details: err.errors }, { status: 400 })
    }
    console.error("❌ Add Funds Error:", err)
    return NextResponse.json({ error: "Failed to add funds" }, { status: 500 })
  }
}