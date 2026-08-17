"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { MOCK_PLACEMENT_STATS, MOCK_DEPARTMENT_KPIS } from "@/lib/mock-data";

const pubData = [
  { year: "2020", journals: 38, conferences: 24 },
  { year: "2021", journals: 45, conferences: 31 },
  { year: "2022", journals: 52, conferences: 36 },
  { year: "2023", journals: 64, conferences: 42 },
  { year: "2024", journals: 78, conferences: 48 },
];

const COLORS = ["hsl(217, 72%, 42%)", "hsl(160, 60%, 42%)", "hsl(38, 92%, 50%)", "hsl(280, 65%, 55%)"];

const pieData = [
  { name: "Journal Articles", value: 210 },
  { name: "Conference Papers", value: 105 },
  { name: "Books", value: 12 },
  { name: "Book Chapters", value: 15 },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Department Research &amp; Academic Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">Interactive visualizations for research growth and placements.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Publications Trend Bar Chart */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-base font-bold text-foreground mb-4">5-Year Publication Output</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pubData}>
                <XAxis dataKey="year" stroke="#888888" fontSize={12} tickLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} />
                <Tooltip />
                <Bar dataKey="journals" fill="hsl(217, 72%, 42%)" name="Journals" radius={[4, 4, 0, 0]} />
                <Bar dataKey="conferences" fill="hsl(160, 60%, 42%)" name="Conferences" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Publication Type Breakdown Pie Chart */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-base font-bold text-foreground mb-4">Research Type Breakdown</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
