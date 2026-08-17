"use client";

import { useState } from "react";
import { Search, GraduationCap } from "lucide-react";
import { MOCK_STUDENTS } from "@/lib/mock-data";

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [progFilter, setProgFilter] = useState("ALL");

  const filtered = MOCK_STUDENTS.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.roll_number.toLowerCase().includes(search.toLowerCase());

    const matchesProg =
      progFilter === "ALL" || s.programme_id.toLowerCase().includes(progFilter.toLowerCase());

    return matchesSearch && matchesProg;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">Enrolled Cohorts</span>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Students Roster
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Undergraduate and postgraduate students enrolled in CSE degree programmes.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name or roll number..."
            className="w-full rounded-xl border border-input bg-card py-2.5 pl-10 pr-4 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex gap-2">
          {["ALL", "btech", "mtech"].map((prog) => (
            <button
              key={prog}
              onClick={() => setProgFilter(prog)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                progFilter === prog
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {prog === "ALL" ? "All Students" : prog.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Roll Number</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Batch Year</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">CGPA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-accent/40 transition">
                  <td className="whitespace-nowrap px-6 py-4 font-mono font-bold text-primary">
                    {s.roll_number}
                  </td>
                  <td className="px-6 py-4 font-semibold text-foreground">{s.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{s.batch_year}</td>
                  <td className="px-6 py-4 text-xs font-mono text-muted-foreground">{s.email}</td>
                  <td className="px-6 py-4 font-mono font-semibold text-foreground">{s.cgpa || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
