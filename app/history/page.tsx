"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

type HistoryItem = {
  type: "entry" | "exit";
  amountDeducted: number;
  time: Date;
};

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [rfid, setRfid] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/history");
      if (!res.ok) throw new Error("Failed to fetch");

      const json = await res.json();
      console.log(json.history);
      setHistory(json.history || []);
      setRfid(json.rfid || null);
    } catch (err) {
      console.error("Error loading history:", err);
      setHistory([]); // fallback to empty
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 bg-black text-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Parking History</h1>
      {history.length === 0 ? (
        <p>No history available.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b border-gray-700">
              <th className="py-2">Date & Time</th>
              <th className="py-2">Action</th>
              <th className="py-2">Card ID</th>
              <th className="py-2">Amount Deducted</th>
            </tr>
          </thead>
          <tbody>
            {history.map((tx, i) => (
              <tr
                key={i}
                className="border-b border-gray-800 hover:bg-gray-900"
              >
                <td className="py-2">
                  {format(new Date(tx.time), "PPpp")}
                </td>
                <td className="py-2 capitalize">{tx.type}</td>
                <td className="py-2">{rfid}</td>
                <td className="py-2">
                  {tx.amountDeducted}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
