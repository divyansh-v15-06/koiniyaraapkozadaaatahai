"use client";

import { useState } from "react";
import { Search, BookOpen, Layers } from "lucide-react";
import { MOCK_COURSES } from "@/lib/mock-data";

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("ALL");

  const filtered = MOCK_COURSES.filter((c) => {
    const matchesSearch =
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase());

    const matchesLevel = levelFilter === "ALL" || c.level === levelFilter;

    return matchesSearch && matchesLevel;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">Curriculum</span>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Course Catalogue
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Undergraduate and postgraduate courses offered by the Department of Computer Science &amp; Engineering.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by course code or title..."
            className="w-full rounded-xl border border-input bg-card py-2.5 pl-10 pr-4 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex gap-2">
          {["ALL", "UG", "PG"].map((level) => (
            <button
              key={level}
              onClick={() => setLevelFilter(level)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                levelFilter === level
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {level === "ALL" ? "All Courses" : `${level} Courses`}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Course Code</th>
                <th className="px-6 py-4">Course Title</th>
                <th className="px-6 py-4">Credits</th>
                <th className="px-6 py-4">Semester</th>
                <th className="px-6 py-4">Level</th>
                <th className="px-6 py-4">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((course) => (
                <tr key={course.code} className="hover:bg-accent/40 transition">
                  <td className="whitespace-nowrap px-6 py-4 font-mono font-bold text-primary">
                    {course.code}
                  </td>
                  <td className="px-6 py-4 font-semibold text-foreground">{course.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{course.credits} Credits</td>
                  <td className="px-6 py-4 text-muted-foreground">Sem {course.semester}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-md bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                      {course.level}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-md px-2.5 py-0.5 text-xs font-semibold ${
                        course.type === "Core"
                          ? "bg-primary/10 text-primary"
                          : "bg-chart-3/10 text-chart-3"
                      }`}
                    >
                      {course.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
