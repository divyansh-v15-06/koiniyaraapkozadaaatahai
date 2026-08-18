"use client";

import Link from "next/link";
import { useDepartment } from "@/context/department-context";
import { Building2, ArrowRight, RotateCcw, AlertCircle, Database } from "lucide-react";

interface DepartmentEmptyStateProps {
  sectionTitle?: string;
  customMessage?: string;
}

export function DepartmentEmptyState({
  sectionTitle = "Records",
  customMessage,
}: DepartmentEmptyStateProps) {
  const { activeDepartment, departments, setActiveDepartment } = useDepartment();

  const handleSwitchToCse = () => {
    const cse = departments.find((d) => d.slug === "cse");
    if (cse) {
      setActiveDepartment(cse);
    }
  };

  return (
    <div className="rounded-3xl border border-[#eedfd8] bg-[#fff9f6] p-8 sm:p-12 text-center space-y-5 shadow-xs my-6 max-w-3xl mx-auto font-sans">
      <div className="mx-auto w-16 h-16 rounded-3xl bg-white border border-[#eedfd8] flex items-center justify-center text-[#85261e] shadow-xs">
        <Database className="w-8 h-8 opacity-80" />
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-white text-[#85261e] border border-[#eedfd8] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{activeDepartment.code} Department Record</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold text-[#33110e] tracking-tight">
          No {sectionTitle} Available for Department of {activeDepartment.name}
        </h3>

        <p className="text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed">
          {customMessage ||
            `Institutional data records for ${activeDepartment.name} (${activeDepartment.code}) are currently undergoing digitization and will be available once uploaded and verified by the departmental administrator.`}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleSwitchToCse}
          className="inline-flex items-center gap-2 bg-[#33110e] hover:bg-[#85261e] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-amber-300" />
          <span>Switch to CSE Department (Live Data)</span>
        </button>

        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-white hover:bg-neutral-50 text-[#33110e] border border-[#eedfd8] px-4 py-2.5 rounded-xl text-xs font-bold shadow-2xs transition"
        >
          <span>Institute Home</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
