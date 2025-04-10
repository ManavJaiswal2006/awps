export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  balance: number;
  rfidTag?: string;
}

export interface ParkingRecord {
  id: string;
  userId: string;
  entryTime: Date;
  exitTime?: Date;
  duration?: number;
  cost: number;
  status: "active" | "completed";
  slotNumber: number;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: "deposit" | "withdrawal" | "parking";
  status: "completed" | "pending" | "failed";
  createdAt: Date;
  reference: string;
}

export interface ParkingSlot {
  id: number;
  status: "available" | "occupied";
  occupiedBy?: string;
  lastUpdated: Date;
}