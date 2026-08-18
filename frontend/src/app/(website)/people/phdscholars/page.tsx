"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  UserCheck,
  Search,
  ExternalLink,
  GraduationCap,
  Sparkles,
  Award,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Calendar,
  Layers,
} from "lucide-react";
import { MOCK_PHD_SCHOLARS } from "@/lib/mock-data";
import { useDepartment } from "@/context/department-context";

const ITEMS_PER_PAGE = 24;

export default function PhdScholarsPage() {
  const { activeDepartment } = useDepartment();
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");
  const [supervisorFilter, setSupervisorFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Extract unique supervisors list
  const supervisorsList = useMemo(() => {
    const set = new Set<string>();
    MOCK_PHD_SCHOLARS.forEach((p) => {
      if (p.supervisor && p.supervisor !== "Faculty Supervisor") {
        set.add(p.supervisor);
      }
    });
    return Array.from(set).sort();
  }, []);

  const countByStatus = useMemo(() => {
    const total = MOCK_PHD_SCHOLARS.length;
    const pursuing = MOCK_PHD_SCHOLARS.filter((p) => p.status === "pursuing").length;
    const passed = MOCK_PHD_SCHOLARS.filter((p) => p.status === "passed").length;
    return { total, pursuing, passed };
  }, []);

  const filteredScholars = useMemo(() => {
    return MOCK_PHD_SCHOLARS.filter((sch) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        sch.name.toLowerCase().includes(q) ||
        sch.enrollment_number?.toLowerCase().includes(q) ||
        sch.topic?.toLowerCase().includes(q) ||
        sch.supervisor?.toLowerCase().includes(q) ||
        sch.research_area?.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "ALL" || sch.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesSupervisor =
        supervisorFilter === "ALL" ||
        sch.supervisor?.toLowerCase().includes(supervisorFilter.toLowerCase()) ||
        sch.co_supervisor?.toLowerCase().includes(supervisorFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesSupervisor;
    });
  }, [search, statusFilter, supervisorFilter]);

  const totalPages = Math.ceil(filteredScholars.length / ITEMS_PER_PAGE) || 1;
  const paginatedScholars = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredScholars.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredScholars, currentPage]);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setSupervisorFilter("ALL");
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6 bg-white min-h-[85vh] font-sans">
      {/* Title Header */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-[#85261e]" />
              Doctoral Ph.D. Scholars
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2 py-0.5 rounded uppercase">
              {activeDepartment.code}
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Research scholars pursuing doctoral degrees and alumni who graduated from Department of {activeDepartment.name}.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#fff9f6] p-1 rounded-lg border border-[#eedfd8]">
          {[
            { id: "ALL", label: `All Scholars (${countByStatus.total})` },
            { id: "pursuing", label: `Ongoing (${countByStatus.pursuing})` },
            { id: "passed", label: `Alumni / Graduated (${countByStatus.passed})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setStatusFilter(tab.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-[#33110e] text-white shadow-xs"
                  : "text-[#33110e] hover:bg-[#eedfd8]/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#fff9f6] border border-[#eedfd8] rounded-xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Keyword Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search scholar name, roll number, topic..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#eedfd8] bg-white text-[#33110e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
            />
          </div>

          {/* Supervisor Filter */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <select
              value={supervisorFilter}
              onChange={(e) => {
                setSupervisorFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-[#eedfd8] rounded-lg px-3 py-1.5 text-xs font-semibold text-[#33110e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e] max-w-[220px] truncate"
            >
              <option value="ALL">All Supervisors</option>
              {supervisorsList.map((sup) => (
                <option key={sup} value={sup}>
                  {sup}
                </option>
              ))}
            </select>

            <span className="text-xs text-neutral-500 font-semibold hidden md:inline">
              Showing {filteredScholars.length} scholars
            </span>

            {(search || statusFilter !== "ALL" || supervisorFilter !== "ALL") && (
              <button
                onClick={resetFilters}
                className="px-2.5 py-1.5 text-xs font-semibold text-neutral-600 hover:text-[#33110e] transition flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Scholars Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedScholars.map((sch) => {
          const isPassed = sch.status === "passed";
          return (
            <div
              key={sch.id}
              className="bg-white rounded-2xl border border-[#eedfd8] p-5 shadow-xs hover:shadow-md hover:border-[#85261e]/40 transition duration-200 flex flex-col justify-between space-y-3 group"
            >
              <div>
                {/* Header with Roll No and Status Badge */}
                <div className="flex items-center justify-between gap-2 border-b border-[#eedfd8]/60 pb-3">
                  <span className="font-mono text-xs font-bold text-[#85261e]">
                    {sch.enrollment_number}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      isPassed
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : "bg-sky-50 text-sky-800 border-sky-300"
                    }`}
                  >
                    {isPassed ? "Degree Awarded (Alumni)" : "Ongoing Research"}
                  </span>
                </div>

                {/* Scholar Name */}
                <h2 className="text-base font-bold text-[#1c110c] group-hover:text-[#85261e] transition mt-2.5 leading-snug">
                  {sch.name}
                </h2>

                {/* Research Topic */}
                <div className="mt-2.5 bg-[#fff9f6] border border-[#eedfd8]/80 rounded-xl p-3 text-xs leading-relaxed">
                  <span className="text-[10px] font-bold uppercase text-[#85261e] tracking-wider block mb-1">
                    Dissertation Title / Topic:
                  </span>
                  <p className="text-neutral-800 font-medium italic">
                    &quot;{sch.topic || sch.dissertation_title}&quot;
                  </p>
                </div>
              </div>

              {/* Supervision and Metadata Footer */}
              <div className="pt-3 border-t border-[#eedfd8]/60 space-y-1 text-xs text-neutral-600">
                <div className="flex items-start gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#85261e] flex-shrink-0 mt-0.5" />
                  <div>
                    <span>Supervisor: </span>
                    <strong className="text-[#1c110c]">{sch.supervisor}</strong>
                    {sch.co_supervisor && (
                      <span className="text-neutral-500 block text-[11px]">
                        Co-Supervisor: {sch.co_supervisor}
                      </span>
                    )}
                  </div>
                </div>

                {sch.registration_year && (
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 pt-1">
                    <Calendar className="w-3 h-3 text-[#85261e]" />
                    <span>Registered: {sch.registration_year}</span>
                    {sch.end_date && <span>• Completed: {sch.end_date}</span>}
                  </div>
                )}

                {/* Scholar Links */}
                {(sch.google_scholar_url || sch.scopus_url) && (
                  <div className="pt-2 flex items-center gap-2">
                    {sch.google_scholar_url && (
                      <a
                        href={sch.google_scholar_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-[#33110e] hover:text-[#85261e]"
                      >
                        <ExternalLink className="w-3 h-3" /> Google Scholar
                      </a>
                    )}
                    {sch.scopus_url && (
                      <a
                        href={sch.scopus_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-[#33110e] hover:text-[#85261e]"
                      >
                        <ExternalLink className="w-3 h-3" /> Scopus
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredScholars.length === 0 && (
        <div className="text-center py-16 text-neutral-500 text-xs bg-[#fff9f6] rounded-2xl border border-[#eedfd8]">
          No PhD scholars found matching your criteria.
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 text-xs text-neutral-600 border-t border-[#eedfd8]">
          <p>
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredScholars.length)} of {filteredScholars.length} scholars
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-[#eedfd8] bg-white disabled:opacity-40 hover:bg-[#fff9f6] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-[#33110e]" />
            </button>
            <span className="px-3 py-1 font-semibold text-[#33110e]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-[#eedfd8] bg-white disabled:opacity-40 hover:bg-[#fff9f6] cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 text-[#33110e]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
