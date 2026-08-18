"use client";

import { TrendingUp, Award, Briefcase, CheckCircle2 } from "lucide-react";
import { MOCK_PLACEMENT_STATS } from "@/lib/mock-data";
import { useDepartment } from "@/context/department-context";
import { DepartmentEmptyState } from "@/components/common/department-empty-state";

const recruiters = [
  "Google", "Microsoft", "Amazon", "Adobe", "Oracle", "Goldman Sachs",
  "Qualcomm", "Texas Instruments", "Samsung R&D", "Morgan Stanley", "Uber", "Flipkart"
];

export default function PlacementPage() {
  const { activeDepartment } = useDepartment();
  const hasData = activeDepartment.slug === "cse";
  const latestBtech = MOCK_PLACEMENT_STATS.find((s) => s.branch === "B.Tech CSE" && s.year === 2025)!;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6 bg-white min-h-[85vh] font-sans">
      {/* Title Header */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-[#85261e]" />
              Training &amp; Placements
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2 py-0.5 rounded uppercase">
              {activeDepartment.code}
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Career outcomes, campus placement statistics, and corporate recruitments for Department of {activeDepartment.name}.
          </p>
        </div>
      </div>

      {!hasData ? (
        <DepartmentEmptyState sectionTitle="Placement & Career Outcomes" />
      ) : (
        <>
          {/* Top Highlight Counters */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Highest Package (2025)", value: `₹${latestBtech.highest_lpa} LPA`, color: "text-[#85261e]" },
              { label: "Average Package (B.Tech)", value: `₹${latestBtech.avg_lpa} LPA`, color: "text-[#33110e]" },
              { label: "Placement Percentage", value: `${Math.round((latestBtech.placed / latestBtech.graduating) * 100)}%`, color: "text-emerald-700" },
              { label: "Total Job Offers", value: latestBtech.offers, color: "text-blue-700" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-[#eedfd8] bg-[#fff9f6] p-6 shadow-xs text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">{stat.label}</p>
                <p className={`mt-2 text-3xl font-extrabold font-mono ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Placement Statistics Table */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-[#eedfd8] bg-white shadow-xs">
            <div className="border-b border-[#eedfd8] bg-[#fff9f6] px-6 py-4">
              <h2 className="text-sm font-bold text-[#33110e] uppercase tracking-wide">Year-Wise Branch Placement Statistics</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#eedfd8] bg-[#33110e] text-white uppercase text-[10px] tracking-wider font-bold">
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
                <tbody className="divide-y divide-[#eedfd8] bg-white">
                  {MOCK_PLACEMENT_STATS.map((row, i) => {
                    const pct = Math.round((row.placed / row.graduating) * 100);
                    return (
                      <tr key={i} className="hover:bg-[#fff9f6] transition-colors">
                        <td className="px-6 py-3 font-mono font-bold text-[#85261e]">{row.year}</td>
                        <td className="px-6 py-3 font-semibold text-[#1c110c]">{row.branch}</td>
                        <td className="px-6 py-3 font-mono text-neutral-600">{row.graduating}</td>
                        <td className="px-6 py-3 font-mono text-neutral-600">{row.placed}</td>
                        <td className="px-6 py-3 font-mono text-neutral-600">{row.offers}</td>
                        <td className="px-6 py-3 font-mono font-bold text-emerald-700">₹{row.highest_lpa} LPA</td>
                        <td className="px-6 py-3 font-mono font-bold text-[#85261e]">₹{row.avg_lpa} LPA</td>
                        <td className="px-6 py-3">
                          <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                            {pct}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Recruiters */}
          <div className="mt-8 rounded-2xl border border-[#eedfd8] bg-[#fff9f6] p-6 shadow-xs">
            <h2 className="text-sm font-bold text-[#33110e] uppercase tracking-wide">Key Campus Recruiters</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {recruiters.map((r) => (
                <span
                  key={r}
                  className="rounded-xl border border-[#eedfd8] bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-800 shadow-2xs"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
