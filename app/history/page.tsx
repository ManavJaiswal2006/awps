'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';

type HistoryItem = {
  _id: string;
  cardId: string;
  action: 'entry' | 'exit';
  timestamp: string;
  duration?: number;
};

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      if (!res.ok) throw new Error('Failed to fetch');
  
      const json = await res.json();
      setHistory(json.history || []);
    } catch (err) {
      console.error("Error loading history:", err);
      setHistory([]); // fallback to empty
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 bg-black text-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Parking History</h1>
      {history.length === 0 ? (
        <p>No history available.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b border-gray-700">
              <th className="py-2">Date</th>
              <th className="py-2">Action</th>
              <th className="py-2">Card ID</th>
              <th className="py-2">Duration</th>
            </tr>
          </thead>
          <tbody>
            {history.map((tx) => (
              <tr key={tx._id} className="border-b border-gray-800 hover:bg-gray-900">
                <td className="py-2">{format(new Date(tx.timestamp), 'PPpp')}</td>
                <td className="py-2 capitalize">{tx.action}</td>
                <td className="py-2">{tx.cardId}</td>
                <td className="py-2">
                  {tx.action === 'exit' && tx.duration
                    ? `${Math.round(tx.duration / 60)} min`
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
