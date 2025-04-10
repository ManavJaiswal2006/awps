// app/api/dashboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@/lib/db/models/user";
import connectDB from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Dashboard not found" },
        { status: 404 }
      );
    }

    const balance = user.balance;
    const activeSession = user.activeParking;
    console.log(user.parkingHistory.at(-1));
    const activeParkingSession =
      user.parkingHistory.at(-1)?.type === "entry"
        ? user.parkingHistory.at(-1).time
        : null;

    const availableSlots = 10;

    return NextResponse.json({
      status: activeSession ? "Parked" : "Not Parked",
      balance,
      totalSessions: Math.floor(user.parkingHistory.length / 2),
      availableSlots,
      activeParkingSession,
      name: user.name,
    });
  } catch (err) {
    console.error("Dashboard API Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
