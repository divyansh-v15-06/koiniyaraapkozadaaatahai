"use client";

import { useState, useMemo } from "react";
import { Search, BookOpen, Layers, Filter, CheckCircle2, RotateCcw } from "lucide-react";
import { MOCK_COURSES } from "@/lib/mock-data";
import { useDepartment } from "@/context/department-context";
import { DepartmentEmptyState } from "@/components/common/department-empty-state";

export default function CoursesPage() {
  const { activeDepartment } = useDepartment();
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [semesterFilter, setSemesterFilter] = useState("ALL");
  const hasData = activeDepartment.slug === "cse";

  const filtered = useMemo(() => {
    if (!hasData) return [];
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
  }, [search, levelFilter, semesterFilter, hasData]);

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
            Complete catalogue of core subjects, program electives, open multidisciplinary electives, and lab courses for Department of{" "}
            {activeDepartment.name}.
          </p>
        </div>
      </div>

      {!hasData ? (
        <DepartmentEmptyState sectionTitle="Curriculum & Course Catalogue" />
      ) : (
        <>
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
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#eedfd8]">
                {[
                  { id: "ALL", label: "All Levels" },
                  { id: "UG", label: "Undergraduate (UG)" },
                  { id: "PG", label: "Postgraduate (PG)" },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => setLevelFilter(lvl.id)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                      levelFilter === lvl.id
                        ? "bg-[#33110e] text-white shadow-xs"
                        : "text-[#33110e] hover:bg-[#eedfd8]/40"
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Semester Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap border-t border-[#eedfd8]/60 pt-2.5">
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mr-1">
                Semester:
              </span>
              <button
                onClick={() => setSemesterFilter("ALL")}
                className={`px-2.5 py-0.5 text-xs font-semibold rounded transition cursor-pointer ${
                  semesterFilter === "ALL"
                    ? "bg-[#85261e] text-white font-bold"
                    : "text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                All Semesters
              </button>
              {semesters.map((sem) => (
                <button
                  key={sem}
                  onClick={() => setSemesterFilter(String(sem))}
                  className={`px-2.5 py-0.5 text-xs font-semibold rounded transition cursor-pointer ${
                    semesterFilter === String(sem)
                      ? "bg-[#85261e] text-white font-bold"
                      : "text-neutral-700 hover:bg-neutral-200"
                  }`}
                >
                  Sem {sem}
                </button>
              ))}
            </div>
          </div>

          {/* Courses Table / Cards */}
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((course: any) => (
              <div
                key={course.id || course.code}
                className="bg-white border border-[#eedfd8] rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-[#85261e]/40 transition space-y-3"
              >
                <div className="flex items-start justify-between gap-2 border-b border-[#eedfd8]/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-sm text-[#85261e]">
                      {course.code}
                    </span>
                    <span className="bg-[#fff9f6] text-[#33110e] border border-[#eedfd8] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {course.level} • Sem {course.semester}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-xs bg-amber-50 text-amber-900 border border-amber-300 px-2 py-0.5 rounded">
                    {course.credits} Credits ({course.lecture_hours}-{course.tutorial_hours}-{course.practical_hours})
                  </span>
                </div>

                <h3 className="font-bold text-base text-[#1c110c] leading-snug">
                  {course.name}
                </h3>

                {course.description && (
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {course.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
