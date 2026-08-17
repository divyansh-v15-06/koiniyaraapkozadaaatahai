"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  FileText,
  Lightbulb,
  Award,
  Download,
  Plus,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { MOCK_FACULTY, MOCK_PUBLICATIONS, MOCK_PATENTS, MOCK_PROJECTS } from "@/lib/mock-data";

export default function FacultyDashboardPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const raw = localStorage.getItem("auth_user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {}
    }
  }, []);

  const faculty = MOCK_FACULTY[0];
  const publications = MOCK_PUBLICATIONS;
  const patents = MOCK_PATENTS;
  const projects = MOCK_PROJECTS;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="rounded-md bg-primary/20 px-2.5 py-0.5 font-mono text-xs font-bold text-primary">
              {user?.employee_code || faculty.employee_code}
            </span>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Welcome, {user?.full_name || faculty.full_name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {faculty.designation} • Department of Computer Science &amp; Engineering
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/faculty/publications"
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition"
            >
              <Plus className="h-4 w-4" /> Add Publication
            </Link>
            <Link
              href="/faculty/export"
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-accent transition"
            >
              <Download className="h-4 w-4" /> Export CV
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Publications", value: publications.length, icon: BookOpen, color: "text-primary", bg: "bg-primary/10" },
          { label: "Patents", value: patents.length, icon: FileText, color: "text-chart-2", bg: "bg-chart-2/10" },
          { label: "R&D Projects", value: projects.length, icon: Lightbulb, color: "text-chart-3", bg: "bg-chart-3/10" },
          { label: "Awards & Honors", value: "4", icon: Award, color: "text-chart-4", bg: "bg-chart-4/10" },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {kpi.label}
              </span>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${kpi.bg} ${kpi.color}`}>
                <kpi.icon className="h-4 w-4" />
              </div>
            </div>
            <p className={`mt-2 text-3xl font-bold font-mono ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Submissions & Quick Navigation */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Publications */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-foreground">Recent Publications</h2>
            <Link href="/faculty/publications" className="text-xs font-semibold text-primary hover:underline">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {publications.slice(0, 3).map((pub) => (
              <div key={pub.id} className="rounded-xl border border-border/80 bg-background p-4">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                    {pub.publication_type}
                  </span>
                  <span className="text-xs text-muted-foreground">{pub.year}</span>
                </div>
                <h3 className="mt-1.5 text-sm font-bold text-foreground">{pub.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground italic">{pub.journal_or_conference_name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Profile & CV Completion */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-foreground">CV Completeness</h2>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="font-semibold text-muted-foreground">Profile Status</span>
              <span className="font-bold text-emerald-600">92% Complete</span>
            </div>
            <div className="mt-1.5 h-2 w-full rounded-full bg-secondary">
              <div className="h-full rounded-full bg-emerald-500 w-[92%]" />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-border/60">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Manage Portfolio</p>
            {[
              { label: "Educational Qualifications", href: "/faculty/qualifications" },
              { label: "Teaching Experience", href: "/faculty/teaching-exp" },
              { label: "Administrative Roles", href: "/faculty/admin-exp" },
              { label: "Honors & Recognitions", href: "/faculty/honors" },
              { label: "Invited Talks & Lectures", href: "/faculty/expert-talks" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between rounded-lg p-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition"
              >
                <span>{link.label}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
