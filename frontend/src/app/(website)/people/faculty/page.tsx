"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { MOCK_FACULTY } from "@/lib/mock-data";
import { Search, Mail, Phone, ExternalLink, BookOpen, GraduationCap, ChevronRight, Building2, Layers } from "lucide-react";
import { useDepartment } from "@/context/department-context";

export default function FacultyDirectoryPage() {
  const { activeDepartment, departments, selectDepartmentBySlug } = useDepartment();
  const [search, setSearch] = useState("");
  const [designationFilter, setDesignationFilter] = useState("ALL");
  const [departmentFilter, setDepartmentFilter] = useState<string>(activeDepartment.slug);

  // Sync default filter with active department
  useMemo(() => {
    setDepartmentFilter(activeDepartment.slug);
  }, [activeDepartment.slug]);

  const filteredFaculty = useMemo(() => {
    return MOCK_FACULTY.filter((f) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        f.full_name.toLowerCase().includes(searchLower) ||
        f.research_interests?.some((r: string) => r.toLowerCase().includes(searchLower)) ||
        f.email.toLowerCase().includes(searchLower);

      const matchesDesignation =
        designationFilter === "ALL" ||
        f.designation.toLowerCase().includes(designationFilter.toLowerCase());

      return matchesSearch && matchesDesignation;
    });
  }, [search, designationFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6 bg-white min-h-[80vh]">
      {/* Page Title Header */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase">
              Faculty Directory
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2 py-0.5 rounded uppercase">
              {activeDepartment.code}
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-0.5">
            Department of {activeDepartment.name}, National Institute of Technology Hamirpur
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Live Search */}
          <div className="relative flex-1 md:w-60">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search faculty or research area..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded border border-[#eedfd8] bg-[#fff9f6] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
            />
          </div>

          {/* Department Switcher */}
          <div className="flex items-center gap-1.5 bg-[#fff9f6] border border-[#eedfd8] rounded px-2 py-1">
            <Building2 className="w-3.5 h-3.5 text-[#85261e]" />
            <select
              value={activeDepartment.slug}
              onChange={(e) => selectDepartmentBySlug(e.target.value)}
              className="text-xs bg-transparent text-[#33110e] font-semibold focus:outline-none cursor-pointer"
            >
              {departments.map((d) => (
                <option key={d.id} value={d.slug}>
                  {d.code} - {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Designation Filter */}
          <select
            value={designationFilter}
            onChange={(e) => setDesignationFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded border border-[#eedfd8] bg-[#fff9f6] text-neutral-800 focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
          >
            <option value="ALL">All Designations</option>
            <option value="Professor">Professors</option>
            <option value="Associate">Associate Professors</option>
            <option value="Assistant">Assistant Professors</option>
          </select>
        </div>
      </div>

      {/* Faculty Cards Grid (Replicating tempcse signature layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredFaculty.map((fac) => (
          <div
            key={fac.id}
            className="bg-white rounded-lg border border-[#eedfd8] shadow-xs hover:shadow-md transition duration-200 flex flex-col items-center text-center p-5 hover:border-[#85261e]/40 group"
          >
            {/* Circular Profile Photo */}
            <div className="w-32 h-32 rounded-full overflow-hidden border-3 border-[#eedfd8] group-hover:border-[#85261e] transition mb-3 shadow-xs bg-neutral-100 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fac.image_url || "/hod.jpg"}
                alt={fac.full_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400";
                }}
              />
            </div>

            {/* Name & Designation */}
            <h3 className="font-bold text-sm text-[#33110e] group-hover:text-[#85261e] transition leading-tight mb-1">
              {fac.full_name}
            </h3>
            <span className="text-[11px] font-semibold text-[#85261e] bg-[#fff9f6] px-2 py-0.5 rounded-full border border-[#eedfd8] mb-3">
              {fac.designation}
            </span>

            {/* Contact Details */}
            <div className="w-full text-left space-y-1.5 text-[11px] text-neutral-600 border-t border-[#f4ece8] pt-3 flex-1">
              <div className="flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                <a
                  href={`mailto:${fac.email}`}
                  className="hover:text-[#33110e] truncate"
                >
                  {fac.email}
                </a>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                <span>{fac.phone}</span>
              </div>
              {fac.research_interests && fac.research_interests.length > 0 && (
                <div className="pt-1.5">
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                    Research Area:
                  </p>
                  <p className="text-[11px] text-neutral-700 line-clamp-2 mt-0.5">
                    {fac.research_interests.join(", ")}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="w-full pt-3 mt-2 border-t border-[#f4ece8] flex gap-2">
              <Link
                href={`/people/faculty/${fac.employee_code || fac.id}?dept=${activeDepartment.slug}`}
                className="w-full bg-[#33110e] text-white text-[11px] font-semibold py-1.5 rounded hover:bg-[#85261e] transition flex items-center justify-center gap-1 shadow-xs"
              >
                View Profile <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredFaculty.length === 0 && (
        <div className="text-center py-16 text-neutral-500 text-xs bg-[#fff9f6] rounded-lg border border-[#eedfd8]">
          No faculty members found matching your search criteria for Department of {activeDepartment.name}.
        </div>
      )}
    </div>
  );
}
