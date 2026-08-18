"use client";

import { useState, useMemo } from "react";
import { Mail, Phone, UserCog, Search, Building2, Wrench, ShieldCheck } from "lucide-react";
import { MOCK_STAFF } from "@/lib/mock-data";
import { useDepartment } from "@/context/department-context";

export default function StaffPage() {
  const { activeDepartment } = useDepartment();
  const [search, setSearch] = useState("");

  const filteredStaff = useMemo(() => {
    return MOCK_STAFF.filter((staff) => {
      const q = search.toLowerCase();
      return (
        !search ||
        staff.name.toLowerCase().includes(q) ||
        staff.designation.toLowerCase().includes(q) ||
        staff.email.toLowerCase().includes(q)
      );
    });
  }, [search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6 bg-white min-h-[85vh] font-sans">
      {/* Title Header */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <UserCog className="w-6 h-6 text-[#85261e]" />
              Technical &amp; Administrative Staff
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2 py-0.5 rounded uppercase">
              {activeDepartment.code}
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Laboratory technical officers, network system administrators, and executive staff of Department of {activeDepartment.name}.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-[#fff9f6] border border-[#eedfd8] rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search staff name or designation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#eedfd8] bg-white text-[#33110e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
          />
        </div>

        <span className="text-xs text-neutral-600 font-semibold">
          Showing {filteredStaff.length} of {MOCK_STAFF.length} staff members
        </span>
      </div>

      {/* Staff Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredStaff.map((staff) => (
          <div
            key={staff.id}
            className="bg-white rounded-2xl border border-[#eedfd8] p-5 shadow-xs hover:shadow-md hover:border-[#85261e]/40 transition duration-200 flex flex-col items-center text-center justify-between group"
          >
            <div className="flex flex-col items-center w-full">
              {/* Profile Photo */}
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-3 border-[#eedfd8] group-hover:border-[#85261e] transition mb-3 shadow-xs bg-[#fff9f6] flex items-center justify-center">
                {staff.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={staff.photo_url}
                    alt={staff.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <UserCog className="w-10 h-10 text-[#85261e]" />
                )}
              </div>

              {/* Name & Designation */}
              <h2 className="font-bold text-sm text-[#1c110c] group-hover:text-[#85261e] transition leading-tight mb-1">
                {staff.name}
              </h2>
              <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-3 uppercase">
                {staff.designation}
              </span>
            </div>

            {/* Contact Strip */}
            <div className="w-full space-y-1.5 text-xs text-neutral-600 border-t border-[#eedfd8]/60 pt-3 text-left">
              <div className="flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-[#85261e] flex-shrink-0" />
                <a
                  href={`mailto:${staff.email}`}
                  className="hover:text-[#85261e] hover:underline truncate text-[11px]"
                >
                  {staff.email}
                </a>
              </div>

              {staff.phone && staff.phone !== "—" && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#85261e] flex-shrink-0" />
                  <span className="text-[11px] font-mono text-neutral-700">{staff.phone}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredStaff.length === 0 && (
        <div className="text-center py-16 text-neutral-500 text-xs bg-[#fff9f6] rounded-xl border border-[#eedfd8]">
          No staff members found matching your search.
        </div>
      )}
    </div>
  );
}
