"use client";

import { useState } from "react";
import { Shield, Search } from "lucide-react";
import { MOCK_PATENTS } from "@/lib/mock-data";

export default function PatentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = MOCK_PATENTS.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.application_number?.toLowerCase().includes(search.toLowerCase()) ||
      p.patent_number?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">Intellectual Property</span>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Patents &amp; Innovations
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Patented technologies, apparatuses, and software architectures developed by department faculty.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patents by title, application number, or keyword..."
            className="w-full rounded-xl border border-input bg-card py-2.5 pl-10 pr-4 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {["ALL", "Granted", "Published", "Filed"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                statusFilter === status
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {status === "ALL" ? "All Patents" : status}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((patent) => (
          <div
            key={patent.id}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-primary/40"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-md px-2.5 py-0.5 text-xs font-bold ${
                    patent.status === "Granted"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : patent.status === "Published"
                      ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {patent.status}
                </span>
                {patent.patent_number && (
                  <span className="font-mono text-xs font-bold text-foreground">
                    No: {patent.patent_number}
                  </span>
                )}
              </div>

              <span className="font-mono text-xs text-muted-foreground">
                App No: {patent.application_number}
              </span>
            </div>

            <h3 className="mt-3 text-base font-bold text-foreground leading-snug">
              {patent.title}
            </h3>

            {patent.abstract_text && (
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {patent.abstract_text}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-4 border-t border-border/60 pt-3 text-xs text-muted-foreground">
              <span>Country: <strong className="text-foreground">{patent.country}</strong></span>
              {patent.filing_date && <span>Filing Date: <strong className="text-foreground">{patent.filing_date}</strong></span>}
              {patent.grant_date && <span>Grant Date: <strong className="text-foreground">{patent.grant_date}</strong></span>}
              {patent.patent_office && <span>Office: <strong className="text-foreground">{patent.patent_office}</strong></span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
