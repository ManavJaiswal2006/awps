"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { format } from "date-fns";
import { Loader2, RefreshCcw } from "lucide-react";

type Transaction = {
  amount: number;
  type: "credit" | "debit";
  time: string;
};

export default function WalletPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/wallet");
      const data = await res.json();
      setTransactions(data.history || []);
    } catch (error) {
      console.error("Wallet fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAddFunds = async () => {
    setIsLoading(true);
    if (!amount || isNaN(Number(amount))) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      const res = await fetch("/api/wallet/add-funds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Add Funds API Error:", data);
        throw new Error(data?.error || "Failed to add funds");
      }

      toast.success("Funds added successfully");
      setTransactions([data.transaction, ...transactions]);
      setAmount("");
    } catch (error: any) {
      console.error("Frontend Add Funds Error:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const balance = transactions.reduce((acc, t) => {
    return t.type === "credit" ? acc + t.amount : acc - t.amount;
  }, 0);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Wallet</h1>
      <div className="w-full flex justify-between items-center">
        <p className="text-lg">Balance: ₹{balance}</p>
        <button
          onClick={fetchTransactions}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="flex gap-4">
        <Input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button onClick={handleAddFunds}>Add Funds</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading ? (
            <>
              {transactions.map((transaction, i) => (
                <TableRow key={i}>
                  <TableCell>
                    {format(new Date(transaction.time), "PPpp")}
                  </TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>₹{transaction.amount}</TableCell>
                </TableRow>
              ))}
            </>
          ) : (
            <div className="w-full m-auto flex items-center justify-center min-h-[100px] ">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
