"use client";

import { formatINR } from "@/lib/utils";
import { Briefcase, Building, Calendar, CheckCircle2 } from "lucide-react";
import { MOCK_PROJECTS } from "@/lib/mock-data";
import { useDepartment } from "@/context/department-context";
import { DepartmentEmptyState } from "@/components/common/department-empty-state";

export default function ProjectsPage() {
  const { activeDepartment } = useDepartment();
  const hasData = activeDepartment.slug === "cse";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6 bg-white min-h-[85vh] font-sans">
      {/* Title Header */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-[#85261e]" />
              Sponsored Research Grants &amp; Projects
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2 py-0.5 rounded uppercase">
              {activeDepartment.code}
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Externally funded research initiatives supported by national ministries (SERB, MeitY, DST) and industry partners in Department of {activeDepartment.name}.
          </p>
        </div>
      </div>

      {!hasData ? (
        <DepartmentEmptyState sectionTitle="Sponsored R&D Projects" />
      ) : (
        <div className="space-y-4">
          {MOCK_PROJECTS.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-[#eedfd8] bg-white p-6 shadow-xs transition hover:border-[#85261e]/40 hover:shadow-md space-y-4"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-md px-2.5 py-0.5 text-xs font-bold ${
                        p.status === "Ongoing"
                          ? "bg-blue-50 text-blue-800 border border-blue-300"
                          : "bg-emerald-50 text-emerald-800 border border-emerald-300"
                      }`}
                    >
                      {p.status}
                    </span>
                    <span className="rounded-md bg-[#fff9f6] border border-[#eedfd8] px-2.5 py-0.5 text-xs font-semibold text-[#33110e]">
                      {p.project_type || "Sponsored Grant"}
                    </span>
                    {p.scheme && (
                      <span className="text-xs font-medium text-neutral-500">
                        • {p.scheme}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-2 text-base font-bold text-[#1c110c] leading-snug">
                    {p.title}
                  </h3>
                </div>

                <div className="flex-shrink-0 text-right sm:self-center">
                  <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Sanctioned Budget</p>
                  <p className="text-xl font-bold text-[#85261e] font-mono">
                    {formatINR(p.total_sanctioned_amount)}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 border-t border-[#eedfd8]/60 pt-3 text-xs text-neutral-600">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-[#85261e]" />
                  <span>
                    Agency: <strong>{p.funding_agency}</strong>
                  </span>
                </div>

                {p.raw_investigators && (
                  <div className="truncate">
                    <span>
                      Investigators: <strong>{p.raw_investigators}</strong>
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 font-mono text-[11px] sm:justify-end text-neutral-500">
                  <Calendar className="h-3.5 w-3.5 text-[#85261e]" />
                  <span>Ref: {p.reference_number || "N/A"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
