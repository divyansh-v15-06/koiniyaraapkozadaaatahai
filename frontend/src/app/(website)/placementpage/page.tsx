"use client";

import { TrendingUp, Award, Briefcase, CheckCircle2 } from "lucide-react";
import { MOCK_PLACEMENT_STATS } from "@/lib/mock-data";

const recruiters = [
  "Google", "Microsoft", "Amazon", "Adobe", "Oracle", "Goldman Sachs",
  "Qualcomm", "Texas Instruments", "Samsung R&D", "Morgan Stanley", "Uber", "Flipkart"
];

export default function PlacementPage() {
  const latestBtech = MOCK_PLACEMENT_STATS.find((s) => s.branch === "B.Tech CSE" && s.year === 2025)!;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">Career Outcomes</span>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Training &amp; Placements
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Outstanding placement records with top global technology firms and quantitative finance institutions.
        </p>
      </div>

      {/* Top Highlight Counters */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Highest Package (2025)", value: `₹${latestBtech.highest_lpa} LPA`, color: "text-primary" },
          { label: "Average Package (B.Tech)", value: `₹${latestBtech.avg_lpa} LPA`, color: "text-chart-2" },
          { label: "Placement Percentage", value: `${Math.round((latestBtech.placed / latestBtech.graduating) * 100)}%`, color: "text-chart-3" },
          { label: "Total Job Offers", value: latestBtech.offers, color: "text-chart-4" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-6 shadow-sm text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
            <p className={`mt-2 text-3xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Placement Statistics Table */}
      <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border bg-muted/30 px-6 py-4">
          <h2 className="text-base font-bold text-foreground">Year-Wise Branch Placement Statistics</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/20 text-xs font-semibold uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-3">Academic Year</th>
                <th className="px-6 py-3">Programme</th>
                <th className="px-6 py-3">Graduating</th>
                <th className="px-6 py-3">Placed</th>
                <th className="px-6 py-3">Offers</th>
                <th className="px-6 py-3">Highest Package</th>
                <th className="px-6 py-3">Average Package</th>
                <th className="px-6 py-3">Placement %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {MOCK_PLACEMENT_STATS.map((s, i) => (
                <tr key={i} className="hover:bg-accent/40 transition">
                  <td className="px-6 py-4 font-mono font-bold text-foreground">{s.year}</td>
                  <td className="px-6 py-4 font-semibold text-primary">{s.branch}</td>
                  <td className="px-6 py-4 text-muted-foreground">{s.graduating}</td>
                  <td className="px-6 py-4 text-emerald-600 font-semibold">{s.placed}</td>
                  <td className="px-6 py-4 text-muted-foreground">{s.offers}</td>
                  <td className="px-6 py-4 font-mono font-bold text-foreground">₹{s.highest_lpa} LPA</td>
                  <td className="px-6 py-4 font-mono text-muted-foreground">₹{s.avg_lpa} LPA</td>
                  <td className="px-6 py-4 font-bold text-emerald-600">
                    {Math.round((s.placed / s.graduating) * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prominent Recruiters */}
      <div className="mt-10 rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h2 className="text-xl font-bold text-foreground text-center">Our Top Recruiting Partners</h2>
        <p className="mt-1 text-center text-xs text-muted-foreground">
          Industry leaders regularly hiring graduates from our department
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {recruiters.map((r) => (
            <div
              key={r}
              className="flex h-16 items-center justify-center rounded-xl border border-border/80 bg-background font-semibold text-foreground text-sm shadow-xs transition hover:border-primary/50 hover:bg-primary/5"
            >
              {r}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
