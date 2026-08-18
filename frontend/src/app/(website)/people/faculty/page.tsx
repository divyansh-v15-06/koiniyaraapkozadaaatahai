"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { MOCK_FACULTY } from "@/lib/mock-data";
import {
  Search,
  Mail,
  Phone,
  ExternalLink,
  BookOpen,
  GraduationCap,
  ChevronRight,
  Building2,
  Layers,
  Sparkles,
  Award,
  FileText,
  User,
  RotateCcw,
} from "lucide-react";
import { useDepartment } from "@/context/department-context";

export default function FacultyDirectoryPage() {
  const { activeDepartment } = useDepartment();
  const [search, setSearch] = useState("");
  const [designationFilter, setDesignationFilter] = useState("ALL");

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

  const countByDesignation = useMemo(() => {
    const total = MOCK_FACULTY.length;
    const profs = MOCK_FACULTY.filter((f) => f.designation.toLowerCase().includes("professor") && !f.designation.toLowerCase().includes("associate") && !f.designation.toLowerCase().includes("assistant")).length;
    const assoc = MOCK_FACULTY.filter((f) => f.designation.toLowerCase().includes("associate")).length;
    const assist = MOCK_FACULTY.filter((f) => f.designation.toLowerCase().includes("assistant")).length;
    return { total, profs, assoc, assist };
  }, []);

  const getDesignationBadge = (designation: string) => {
    const d = designation.toLowerCase();
    if (d.includes("professor") && !d.includes("associate") && !d.includes("assistant")) {
      return "bg-[#33110e] text-white border-[#33110e]";
    }
    if (d.includes("associate")) {
      return "bg-[#85261e] text-white border-[#85261e]";
    }
    if (d.includes("assistant")) {
      return "bg-[#fff9f6] text-[#85261e] border-[#eedfd8]";
    }
    return "bg-neutral-100 text-neutral-800 border-neutral-300";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6 bg-white min-h-[85vh] font-sans">
      {/* Title Header */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-[#85261e]" />
              Faculty Directory
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2 py-0.5 rounded uppercase">
              {activeDepartment.code}
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Distinguished professors, associate professors, and assistant professors of Department of {activeDepartment.name}.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#fff9f6] p-1 rounded-lg border border-[#eedfd8]">
          {[
            { id: "ALL", label: `All (${countByDesignation.total})` },
            { id: "Professor", label: `Professors (${countByDesignation.profs})` },
            { id: "Associate", label: `Associate Prof. (${countByDesignation.assoc})` },
            { id: "Assistant", label: `Assistant Prof. (${countByDesignation.assist})` },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setDesignationFilter(cat.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                designationFilter === cat.id
                  ? "bg-[#33110e] text-white shadow-xs"
                  : "text-[#33110e] hover:bg-[#eedfd8]/50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Info Bar */}
      <div className="bg-[#fff9f6] border border-[#eedfd8] rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search faculty name, email, or research field..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#eedfd8] bg-white text-[#33110e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-neutral-500 font-semibold">
            Showing {filteredFaculty.length} of {MOCK_FACULTY.length} faculty members
          </span>
          {(search || designationFilter !== "ALL") && (
            <button
              onClick={() => {
                setSearch("");
                setDesignationFilter("ALL");
              }}
              className="px-2.5 py-1 text-xs font-semibold text-neutral-600 hover:text-[#33110e] transition flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredFaculty.map((fac) => {
          const profileSlug = fac.employee_code || fac.id;
          return (
            <div
              key={fac.id}
              className="bg-white rounded-2xl border border-[#eedfd8] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between p-5 hover:border-[#85261e]/50 group relative overflow-hidden"
            >
              {/* Top Accent Line on hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#33110e] to-[#85261e] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div>
                {/* Profile Photo Header */}
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-3 border-[#eedfd8] group-hover:border-[#85261e] transition-all duration-300 mb-3 shadow-xs bg-[#fff9f6] flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={fac.image_url || "/hod.jpg"}
                      alt={fac.full_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/17059155995973.jpg";
                      }}
                    />
                  </div>

                  {/* Name */}
                  <h2 className="font-bold text-sm sm:text-base text-[#1c110c] group-hover:text-[#85261e] transition leading-tight mb-1">
                    {fac.full_name}
                  </h2>

                  {/* Designation Badge */}
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border mb-3 ${getDesignationBadge(fac.designation)}`}>
                    {fac.designation}
                  </span>
                </div>

                {/* Contact Info & Details */}
                <div className="space-y-2 text-xs text-neutral-600 border-t border-[#eedfd8]/60 pt-3">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-[#85261e] flex-shrink-0" />
                    <a
                      href={`mailto:${fac.email}`}
                      className="hover:text-[#85261e] hover:underline truncate font-medium text-[11px]"
                    >
                      {fac.email}
                    </a>
                  </div>

                  {fac.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#85261e] flex-shrink-0" />
                      <span className="text-[11px] font-mono text-neutral-700">{fac.phone}</span>
                    </div>
                  )}

                  {/* Research Area Tags */}
                  {fac.research_interests && fac.research_interests.length > 0 && (
                    <div className="pt-2">
                      <p className="text-[10px] font-bold text-[#85261e] uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Research Areas:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {fac.research_interests.slice(0, 3).map((area: string, i: number) => (
                          <span
                            key={i}
                            className="bg-[#fff9f6] text-[#33110e] border border-[#eedfd8] text-[10px] font-semibold px-2 py-0.5 rounded"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-4 mt-3 border-t border-[#eedfd8]/60 flex items-center gap-2">
                <Link
                  href={`/people/faculty/${profileSlug}?dept=${activeDepartment.slug}`}
                  className="w-full bg-[#33110e] text-white text-xs font-bold py-2 rounded-xl hover:bg-[#85261e] transition flex items-center justify-center gap-1 shadow-xs group-hover:shadow-md"
                >
                  <span>View Full Profile</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                {(fac as any).portfolio_url && (
                  <a
                    href={(fac as any).portfolio_url}
                    target="_blank"
                    rel="noreferrer"
                    title="Open Institute Portfolio"
                    className="p-2 rounded-xl border border-[#eedfd8] bg-[#fff9f6] text-[#33110e] hover:bg-[#33110e] hover:text-white transition flex-shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredFaculty.length === 0 && (
        <div className="text-center py-16 text-neutral-500 text-xs bg-[#fff9f6] rounded-2xl border border-[#eedfd8]">
          No faculty members found matching your search criteria for Department of {activeDepartment.name}.
        </div>
      )}
    </div>
  );
}
