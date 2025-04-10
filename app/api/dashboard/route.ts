// app/api/dashboard/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { User } from "@/lib/db/models/user"
import { Transaction } from "@/lib/db/models/transaction"
import connectDB from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)
    const email = session?.user?.email

    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: "Dashboard not found" }, { status: 404 })
    }

    const transactions = await Transaction.find({ email })

    const balance = transactions.reduce((total, txn) => {
      return txn.type === "credit" ? total + txn.amount : total - txn.amount
    }, 0)

    const activeSession = user.parkingHistory.find((s: any) => !s.exitTime)

    const totalSlots = 10
    const activeUserSessions = await User.countDocuments({
      "parkingHistory.exitTime": null
    })

    const availableSlots = totalSlots - activeUserSessions

    return NextResponse.json({
      status: activeSession ? "Parked" : "Not Parked",
      balance,
      totalSessions: user.parkingHistory.length,
      availableSlots,
    })
  } catch (err) {
    console.error("Dashboard API Error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
