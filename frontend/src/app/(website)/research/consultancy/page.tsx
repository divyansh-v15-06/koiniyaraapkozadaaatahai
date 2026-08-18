"use client";

import { Building2, Briefcase, Calendar } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { MOCK_CONSULTANCIES } from "@/lib/mock-data";
import { useDepartment } from "@/context/department-context";
import { DepartmentEmptyState } from "@/components/common/department-empty-state";

export default function ConsultancyPage() {
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
              Industrial Consultancies &amp; Contracts
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2 py-0.5 rounded uppercase">
              {activeDepartment.code}
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Expert industrial advisory, algorithmic architecture design, and technical audits conducted by Department of {activeDepartment.name}.
          </p>
        </div>
      </div>

      {!hasData ? (
        <DepartmentEmptyState sectionTitle="Industrial Consultancy Records" />
      ) : (
        <div className="space-y-4">
          {MOCK_CONSULTANCIES.map((c, i) => (
            <div
              key={c.id || i}
              className="rounded-2xl border border-[#eedfd8] bg-white p-6 shadow-xs transition hover:border-[#85261e]/40 hover:shadow-md space-y-3"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-bold text-[#1c110c] text-base leading-snug">{c.title}</h3>
                <span className="font-mono font-bold text-[#85261e] text-lg">{formatINR(c.amount)}</span>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-neutral-600 border-t border-[#eedfd8]/60 pt-3">
                <span>
                  Client: <strong className="text-[#1c110c]">{c.client_organisation}</strong>
                </span>
                {c.author_text && (
                  <span>
                    Consultants: <strong className="text-[#1c110c]">{c.author_text}</strong>
                  </span>
                )}
                <span>
                  Session: <strong className="text-[#1c110c]">{c.academic_session}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
