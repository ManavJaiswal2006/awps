import { connectDB } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@/lib/db/models/user";

export const POST = async (req: NextRequest) => {
  try {
    const { amount } = await req.json();

    if (!amount || isNaN(amount)) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const transaction = {
      type: "credit",
      amount,
      time: Date.now(),
    };
    user.transactionHistory.push(transaction);
    user.balance += amount;
    await user.save();

    return NextResponse.json({ transaction });
  } catch (err: any) {
    if (err.name === "ValidationError") {
      console.error("❌ Validation Error:", err);
      return NextResponse.json(
        { error: "Validation error", details: err.errors },
        { status: 400 }
      );
    }
    console.error("❌ Add Funds Error:", err);
    return NextResponse.json({ error: "Failed to add funds" }, { status: 500 });
  }
};
