"use client";

import { useState } from "react";
import { Shield, Search, Award } from "lucide-react";
import { MOCK_PATENTS } from "@/lib/mock-data";
import { useDepartment } from "@/context/department-context";
import { DepartmentEmptyState } from "@/components/common/department-empty-state";

export default function PatentsPage() {
  const { activeDepartment } = useDepartment();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const hasData = activeDepartment.slug === "cse";

  const filtered = hasData
    ? MOCK_PATENTS.filter((p) => {
        const matchesSearch =
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.application_number?.toLowerCase().includes(search.toLowerCase()) ||
          p.patent_number?.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6 bg-white min-h-[85vh] font-sans">
      {/* Title Header */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <Award className="w-6 h-6 text-[#85261e]" />
              Patents &amp; Intellectual Property
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2 py-0.5 rounded uppercase">
              {activeDepartment.code}
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Patented technologies, apparatuses, and software architectures developed by faculty and research scholars of Department of {activeDepartment.name}.
          </p>
        </div>
      </div>

      {!hasData ? (
        <DepartmentEmptyState sectionTitle="Patents & Intellectual Property Records" />
      ) : (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-[#fff9f6] p-4 rounded-xl border border-[#eedfd8]">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patents by title, application number, or keyword..."
                className="w-full rounded-xl border border-[#eedfd8] bg-white py-2 pl-10 pr-4 text-xs shadow-2xs transition focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {["ALL", "Granted", "Published", "Filed"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    statusFilter === status
                      ? "bg-[#33110e] text-white shadow-xs"
                      : "border border-[#eedfd8] bg-white text-neutral-700 hover:bg-[#fff9f6]"
                  }`}
                >
                  {status === "ALL" ? "All Patents" : status}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((patent) => (
              <div
                key={patent.id}
                className="flex flex-col justify-between rounded-2xl border border-[#eedfd8] bg-white p-6 shadow-xs hover:shadow-md transition space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        patent.status === "Granted"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                          : patent.status === "Published"
                          ? "bg-blue-50 text-blue-800 border border-blue-300"
                          : "bg-amber-50 text-amber-800 border border-amber-300"
                      }`}
                    >
                      {patent.status}
                    </span>
                    <span className="text-xs font-bold text-neutral-500 font-mono">
                      {patent.filing_date?.split("-")[0] || "2023"}
                    </span>
                  </div>

                  <h3 className="mt-3 text-sm font-bold text-[#1c110c] leading-snug">
                    {patent.title}
                  </h3>

                  {patent.raw_inventors && (
                    <p className="mt-2 text-xs text-neutral-600">
                      <strong>Inventors:</strong> {patent.raw_inventors}
                    </p>
                  )}
                </div>

                <div className="border-t border-[#eedfd8]/60 pt-3 text-xs text-neutral-500 space-y-1 font-mono">
                  {patent.application_number && (
                    <p>
                      <span className="font-sans font-semibold text-neutral-700">App No:</span>{" "}
                      {patent.application_number}
                    </p>
                  )}
                  {patent.patent_number && (
                    <p className="text-emerald-800 font-bold">
                      <span className="font-sans font-semibold text-neutral-700">Patent No:</span>{" "}
                      {patent.patent_number}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
