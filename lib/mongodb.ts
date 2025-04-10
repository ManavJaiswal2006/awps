// File: lib/db.ts

import mongoose from "mongoose"

let isConnected = false

export const connectDB = async () => {
  if (isConnected) return

  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: "parkingDB", // replace if you have another name
    })

    isConnected = true
    console.log("✅ Connected to MongoDB")
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error)
    throw error
  }
}
