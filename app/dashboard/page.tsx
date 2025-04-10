"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Car,
  Clock,
  CreditCard,
  History,
  Loader2,
  ParkingCircle,
  RefreshCcw,
} from "lucide-react";
import { format } from "date-fns";

interface DashboardData {
  name: string;
  status: string;
  balance: number;
  totalSessions: number;
  availableSlots: number;
  activeParkingSession: string | null;
}

export default function DashboardPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  const [data, setData] = useState<DashboardData>({
    name: "user",
    status: "Not Parked",
    balance: 0,
    totalSessions: 0,
    availableSlots: 0,
    activeParkingSession: null,
  });

  const [isLoading, setIsLoading] = useState(true);

  // 🧠 Step 1: Redirect if not logged in
  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/login");
    }

    if (sessionStatus === "authenticated") {
      fetchDashboardData();
    }
  }, [sessionStatus]);

  // 🧠 Step 2: Fetch fresh data from API
  const fetchDashboardData = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/dashboard", {
        cache: "no-store", // 🔥 This forces a fresh request every time
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const dashboardData = await response.json();
      console.log("Fetched dashboard data:", dashboardData);
      setData(dashboardData);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 🧠 Step 3: Show loading spinner if still fetching
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {/* 🔁 Step 4: Manual refresh button */}
        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* 🧠 Step 5: Dashboard Cards */}
      <h2 className="text-3xl font-bold pb-6">Welcome, {data.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Parking Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Parking Status
              </CardTitle>
              <ParkingCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.status}</div>
              <p className="text-xs text-muted-foreground">
                Current parking status
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Available Slots */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Available Slots
              </CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.availableSlots}</div>
              <p className="text-xs text-muted-foreground">
                Empty parking spaces
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Wallet Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Balance</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{data.balance}</div>
              <p className="text-xs text-muted-foreground">
                Current wallet balance
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Total Parking Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Sessions
              </CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalSessions}</div>
              <p className="text-xs text-muted-foreground">
                Completed parking sessions
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Active Parking Session */}
      {data.status === "Parked" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Active Parking Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {data.activeParkingSession
                  ? "Parked since " + format(new Date(data.activeParkingSession), "PPpp")
                  : "No active session"}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
