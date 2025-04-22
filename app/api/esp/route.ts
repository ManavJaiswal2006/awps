import { connectDB } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/lib/db/models/user";

const chargePerHour = 1; // Change this to your desired rate

export const POST = async (req: NextRequest) => {
  try {
    const { rfid } = await req.json();
    console.log("rfid from espp == >>  ", rfid);

    if (!rfid) {
      return NextResponse.json(
        { error: "Please provide valid RFID" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ rfid });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user?.parkingHistory.at(-1)?.type == "entry") {
      user.activeParking = false;
      const timeSpent = Math.floor(
        (Date.now() - user.parkingHistory.at(-1).time) / 1000
      );
      const amount = timeSpent * chargePerHour;
      user.parkingHistory.push({
        type: "exit",
        amountDeducted: amount,
        time: Date.now(),
      });

      user.transactionHistory.push({
        type: "debit",
        amount: amount,
        time: Date.now(),
      });

      user.balance -= amount;

      await user.save();
      return NextResponse.json("EXIT_GRANTED", { status: 200 });
    } else {
      if (user.balance < 50) {
        return NextResponse.json("Insufficient balance", { status: 402 });
      }
      user.activeParking = true;
      user.parkingHistory.push({
        type: "entry",
        amountDeducted: 15,
        time: Date.now(),
      });

      user.transactionHistory.push({
        type: "debit",
        amount: 15,
        time: Date.now(),
      });

      user.balance -= 15;

      await user.save();

      return NextResponse.json("ENTRY_GRANTED", { status: 200 });
    }
  } catch (err: any) {
    console.error("Esp api error => ", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
