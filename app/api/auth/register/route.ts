import { NextRequest, NextResponse } from "next/server"
import { User } from "@/lib/db/models/user"
import connectDB from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const body = await req.json()
    const { name, email, password, rfid } = body

    if (!name || !email || !password || !rfid) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      rfid,
      parkingHistory: [],
    })

    return NextResponse.json({ message: "User registered", user: newUser }, { status: 201 })
  } catch (err) {
    console.error("Register API Error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
