"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Mail, Phone, ExternalLink, Award, BookOpen, FileText } from "lucide-react";
import { MOCK_FACULTY } from "@/lib/mock-data";

export default function FacultyDirectoryPage() {
  const [search, setSearch] = useState("");
  const [designationFilter, setDesignationFilter] = useState("ALL");

  const filteredFaculty = MOCK_FACULTY.filter((f) => {
    const matchesSearch =
      f.full_name.toLowerCase().includes(search.toLowerCase()) ||
      f.employee_code.toLowerCase().includes(search.toLowerCase()) ||
      f.research_interests.some((r) => r.toLowerCase().includes(search.toLowerCase())) ||
      f.profile?.specializations.toLowerCase().includes(search.toLowerCase());

    const matchesDesignation =
      designationFilter === "ALL" || f.designation.includes(designationFilter);

    return matchesSearch && matchesDesignation;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">Department Members</span>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Faculty Directory
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Meet our distinguished faculty dedicated to world-class research, teaching, and technological innovation.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, research area, or faculty code..."
            className="w-full rounded-xl border border-input bg-card py-2.5 pl-10 pr-4 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {["ALL", "Professor", "Associate Professor", "Assistant Professor"].map((desig) => (
            <button
              key={desig}
              onClick={() => setDesignationFilter(desig)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                designationFilter === desig
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {desig === "ALL" ? "All Faculty" : desig}
            </button>
          ))}
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {filteredFaculty.map((faculty) => (
          <div
            key={faculty.id}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex flex-col gap-5 sm:flex-row">
              {/* Profile Image */}
              <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl border border-border/80 bg-muted">
                <img
                  src={faculty.image_url}
                  alt={faculty.full_name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs font-semibold text-primary">
                    {faculty.employee_code}
                  </span>
                  <span className="text-xs text-muted-foreground">{faculty.experience_years} yrs exp</span>
                </div>
                <h3 className="mt-1.5 text-lg font-bold text-foreground group-hover:text-primary transition">
                  <Link href={`/people/faculty/${faculty.employee_code.toLowerCase()}`}>
                    {faculty.full_name}
                  </Link>
                </h3>
                <p className="text-xs font-medium text-muted-foreground">{faculty.designation}</p>

                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <a
                    href={`mailto:${faculty.email}`}
                    className="flex items-center gap-1.5 hover:text-primary transition"
                  >
                    <Mail className="h-3.5 w-3.5 text-primary" /> {faculty.email}
                  </a>
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" /> {faculty.phone}
                  </span>
                </div>
              </div>
            </div>

            {/* Research Areas Tag Cloud */}
            <div className="mt-5 border-t border-border/60 pt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Research Areas
              </p>
              <div className="flex flex-wrap gap-1.5">
                {faculty.research_interests.map((interest) => (
                  <span
                    key={interest}
                    className="rounded-md bg-secondary/80 px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {faculty.profile?.google_scholar_id && (
                  <span className="flex items-center gap-1 font-medium hover:text-primary">
                    <BookOpen className="h-3.5 w-3.5" /> Scholar
                  </span>
                )}
                {faculty.profile?.scopus_id && (
                  <span className="flex items-center gap-1 font-medium hover:text-primary">
                    <FileText className="h-3.5 w-3.5" /> Scopus
                  </span>
                )}
              </div>

              <Link
                href={`/people/faculty/${faculty.employee_code.toLowerCase()}`}
                className="flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
              >
                View Full Portfolio <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
