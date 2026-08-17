"use client";

import { useState, useMemo } from "react";
import { Search, Users, ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";
import { MOCK_STUDENTS } from "@/lib/mock-data";

const ITEMS_PER_PAGE = 50;

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [progFilter, setProgFilter] = useState("ALL");
  const [batchFilter, setBatchFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const batches = useMemo(() => {
    const set = new Set(MOCK_STUDENTS.map((s) => s.batch_year).filter(Boolean));
    return Array.from(set).sort((a, b) => b - a);
  }, []);

  const filtered = useMemo(() => {
    return MOCK_STUDENTS.filter((s) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        s.name.toLowerCase().includes(searchLower) ||
        s.roll_number.toLowerCase().includes(searchLower) ||
        (s.email && s.email.toLowerCase().includes(searchLower));

      const matchesProg =
        progFilter === "ALL" ||
        (progFilter === "btech" && s.programme_name?.includes("B.Tech")) ||
        (progFilter === "mtech" && s.programme_name?.includes("M.Tech")) ||
        (progFilter === "dual" && s.programme_name?.includes("Dual"));

      const matchesBatch =
        batchFilter === "ALL" || s.batch_year.toString() === batchFilter;

      return matchesSearch && matchesProg && matchesBatch;
    });
  }, [search, progFilter, batchFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const handleProgChange = (prog: string) => {
    setProgFilter(prog);
    setCurrentPage(1);
  };

  const handleBatchChange = (batch: string) => {
    setBatchFilter(batch);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6 bg-white min-h-[80vh]">
      {/* Title & Stats Header */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
            <Users className="w-6 h-6 text-[#85261e]" />
            Students Roster ({filtered.length} of {MOCK_STUDENTS.length})
          </h1>
          <p className="text-xs text-neutral-600 mt-0.5">
            Enrolled undergraduate and postgraduate students in Department of CSE, NIT Hamirpur
          </p>
        </div>

        {/* Programme Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#fff9f6] p-1 rounded-lg border border-[#eedfd8]">
          {[
            { id: "ALL", label: "All Programmes" },
            { id: "btech", label: "B.Tech CSE" },
            { id: "mtech", label: "M.Tech CSE" },
            { id: "dual", label: "Dual Degree" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleProgChange(item.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                progFilter === item.id
                  ? "bg-[#33110e] text-white shadow-xs"
                  : "text-[#33110e] hover:bg-[#eedfd8]/50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Batch Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between bg-[#fff9f6] p-3 rounded-lg border border-[#eedfd8]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by student name, roll number, or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded border border-[#eedfd8] bg-white focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-neutral-600 font-semibold">Admission Batch:</span>
          <select
            value={batchFilter}
            onChange={(e) => handleBatchChange(e.target.value)}
            className="px-3 py-1.5 text-xs rounded border border-[#eedfd8] bg-white text-neutral-800 focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
          >
            <option value="ALL">All Batches</option>
            {batches.map((b) => (
              <option key={b} value={b.toString()}>
                Batch of {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Data Table (tempcse signature format) */}
      <div className="border border-[#eedfd8] rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#1c110c] text-white uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4 text-center w-16">Sr. No.</th>
                <th className="py-3 px-4 w-36">Roll Number</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Programme</th>
                <th className="py-3 px-4">Official Email</th>
                <th className="py-3 px-4 text-center w-24">Batch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4ece8]">
              {paginated.map((student, idx) => {
                const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                return (
                  <tr
                    key={student.id || student.roll_number}
                    className={`hover:bg-[#fff9f6] transition ${
                      idx % 2 === 1 ? "bg-[#faf6f3]" : "bg-white"
                    }`}
                  >
                    <td className="py-2.5 px-4 text-center text-neutral-500 font-medium">
                      {globalIndex}
                    </td>
                    <td className="py-2.5 px-4 font-mono font-bold text-[#85261e]">
                      {student.roll_number}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-[#1c110c]">
                      {student.name}
                    </td>
                    <td className="py-2.5 px-4 text-neutral-700">
                      <span className="bg-[#eedfd8]/60 text-[#33110e] px-2 py-0.5 rounded text-[10px] font-semibold">
                        {student.programme_name || "B.Tech CSE"}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-neutral-600 font-mono text-[11px]">
                      {student.email || `${student.roll_number.toLowerCase()}@nith.ac.in`}
                    </td>
                    <td className="py-2.5 px-4 text-center text-neutral-700 font-semibold">
                      {student.batch_year}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-neutral-500 text-xs">
            No students found matching the selected filters.
          </div>
        )}
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-neutral-600">
          <p>
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} students
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded border border-[#eedfd8] bg-white disabled:opacity-40 hover:bg-[#fff9f6]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-semibold text-[#33110e]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded border border-[#eedfd8] bg-white disabled:opacity-40 hover:bg-[#fff9f6]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
