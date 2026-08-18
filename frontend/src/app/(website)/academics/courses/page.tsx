"use client";

import { useState, useMemo } from "react";
import { Search, BookOpen, Layers, Filter, CheckCircle2, RotateCcw } from "lucide-react";
import { MOCK_COURSES } from "@/lib/mock-data";
import { useDepartment } from "@/context/department-context";

export default function CoursesPage() {
  const { activeDepartment } = useDepartment();
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [semesterFilter, setSemesterFilter] = useState("ALL");

  const filtered = useMemo(() => {
    return MOCK_COURSES.filter((c: any) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q);

      const matchesLevel = levelFilter === "ALL" || c.level === levelFilter;
      const matchesSemester = semesterFilter === "ALL" || String(c.semester) === semesterFilter;

      return matchesSearch && matchesLevel && matchesSemester;
    });
  }, [search, levelFilter, semesterFilter]);

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6 bg-white min-h-[85vh] font-sans">
      {/* Title Header */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-[#85261e]" />
              Curriculum Course Catalogue
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2 py-0.5 rounded uppercase">
              {activeDepartment.code}
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-0.5">
            Complete catalogue of core subjects, program electives, open multidisciplinary electives, and lab courses for Department of {activeDepartment.name}.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#fff9f6] border border-[#eedfd8] rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search course code or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#eedfd8] bg-white text-[#33110e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
            />
          </div>

          {/* Level Filter */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {["ALL", "UG", "PG"].map((level) => (
              <button
                key={level}
                onClick={() => setLevelFilter(level)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                  levelFilter === level
                    ? "bg-[#33110e] text-white shadow-xs"
                    : "border border-[#eedfd8] bg-white text-[#33110e] hover:bg-[#eedfd8]/40"
                }`}
              >
                {level === "ALL" ? "All Levels" : `${level} Courses`}
              </button>
            ))}

            {/* Semester Select */}
            <select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              className="bg-white border border-[#eedfd8] rounded-lg px-2.5 py-1 text-xs font-semibold text-[#33110e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
            >
              <option value="ALL">All Semesters</option>
              {semesters.map((s) => (
                <option key={s} value={String(s)}>
                  Semester {s}
                </option>
              ))}
            </select>

            {(search || levelFilter !== "ALL" || semesterFilter !== "ALL") && (
              <button
                onClick={() => {
                  setSearch("");
                  setLevelFilter("ALL");
                  setSemesterFilter("ALL");
                }}
                className="px-2.5 py-1 text-xs font-semibold text-neutral-500 hover:text-[#33110e] transition flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="overflow-x-auto rounded-xl border border-[#eedfd8] shadow-xs">
        <table className="w-full text-left border-collapse bg-white text-xs">
          <thead>
            <tr className="bg-[#1c110c] text-white text-xs font-bold uppercase tracking-wider">
              <th className="py-3 px-4 border-r border-neutral-800 w-32">Course Code</th>
              <th className="py-3 px-4 border-r border-neutral-800">Course Title</th>
              <th className="py-3 px-4 text-center border-r border-neutral-800 w-28">Credits (L-T-P)</th>
              <th className="py-3 px-4 text-center border-r border-neutral-800 w-28">Semester</th>
              <th className="py-3 px-4 text-center border-r border-neutral-800 w-24">Level</th>
              <th className="py-3 px-4 text-center w-28">Category</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eedfd8]">
            {filtered.map((course: any) => (
              <tr key={course.code} className="hover:bg-[#fff9f6] transition">
                <td className="py-3 px-4 font-mono font-bold text-[#85261e] border-r border-[#eedfd8]">
                  {course.code}
                </td>
                <td className="py-3 px-4 font-semibold text-[#1c110c] border-r border-[#eedfd8]">
                  {course.name}
                  {course.description && (
                    <p className="text-[11px] text-neutral-500 font-normal mt-0.5">
                      {course.description}
                    </p>
                  )}
                </td>
                <td className="py-3 px-4 text-center font-semibold text-neutral-700 border-r border-[#eedfd8]">
                  {course.credits} Credits
                </td>
                <td className="py-3 px-4 text-center text-neutral-700 border-r border-[#eedfd8]">
                  Sem {course.semester}
                </td>
                <td className="py-3 px-4 text-center border-r border-[#eedfd8]">
                  <span className="bg-[#fff9f6] border border-[#eedfd8] text-[#33110e] text-[10px] font-bold px-2 py-0.5 rounded">
                    {course.level}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      course.type === "Core"
                        ? "bg-[#33110e] text-white"
                        : "bg-amber-100 text-amber-900 border border-amber-300"
                    }`}
                  >
                    {course.type}
                  </span>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-neutral-500 text-xs">
                  No courses found matching the search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
