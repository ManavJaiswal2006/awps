// ✅ File: app/wallet/page.tsx

"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"

type Transaction = {
  id: string
  amount: number
  type: "credit" | "debit"
  createdAt: string
}

export default function WalletPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [amount, setAmount] = useState("")

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("/api/wallet")
        const data = await res.json()
        setTransactions(data.transactions || [])
      } catch (error) {
        console.error("Wallet fetch error:", error)
      }
    }

    fetchTransactions()
  }, [])

  const handleAddFunds = async () => {
    if (!amount || isNaN(Number(amount))) {
      toast.error("Please enter a valid amount")
      return
    }

    try {
      const res = await fetch("/api/wallet/add-funds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      })

      const data = await res.json()

      if (!res.ok) {
        console.error("Add Funds API Error:", data)
        throw new Error(data?.error || "Failed to add funds")
      }

      toast.success("Funds added successfully")
      setTransactions([data.transaction, ...transactions])
      setAmount("")
    } catch (error: any) {
      console.error("Frontend Add Funds Error:", error)
      toast.error(error.message)
    }
  }

  const balance = transactions.reduce((acc, t) => {
    return t.type === "credit" ? acc + t.amount : acc - t.amount
  }, 0)

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Wallet</h1>
      <p className="text-lg">Balance: ₹{balance}</p>

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
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{new Date(transaction.createdAt).toLocaleString()}</TableCell>
              <TableCell>{transaction.type}</TableCell>
              <TableCell>₹{transaction.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
