"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { MOCK_PLACEMENT_STATS } from "@/lib/mock-data";

export default function AdminPlacementPage() {
  const [stats, setStats] = useState(MOCK_PLACEMENT_STATS);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Placement Statistics Manager</h1>
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-6 py-4">Year</th>
              <th className="px-6 py-4">Branch</th>
              <th className="px-6 py-4">Graduating</th>
              <th className="px-6 py-4">Placed</th>
              <th className="px-6 py-4">Highest LPA</th>
              <th className="px-6 py-4">Average LPA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {stats.map((s, i) => (
              <tr key={i} className="hover:bg-accent/30">
                <td className="px-6 py-4 font-mono font-bold">{s.year}</td>
                <td className="px-6 py-4 font-semibold text-primary">{s.branch}</td>
                <td className="px-6 py-4">{s.graduating}</td>
                <td className="px-6 py-4 text-emerald-600 font-bold">{s.placed}</td>
                <td className="px-6 py-4 font-mono font-bold">₹{s.highest_lpa} LPA</td>
                <td className="px-6 py-4 font-mono">₹{s.avg_lpa} LPA</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
