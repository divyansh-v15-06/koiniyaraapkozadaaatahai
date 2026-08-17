"use client";

import Link from "next/link";
import { Users, BookOpen, Shield, Lightbulb, ArrowRight, UserPlus, UploadCloud, Megaphone } from "lucide-react";
import { MOCK_FACULTY, MOCK_PUBLICATIONS, MOCK_DEPARTMENT_KPIS } from "@/lib/mock-data";
import { formatINR } from "@/lib/utils";

export default function AdminDashboardPage() {
  const kpis = MOCK_DEPARTMENT_KPIS;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl border border-border bg-gradient-to-r from-card via-card to-primary/5 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="rounded-md bg-destructive/10 px-2.5 py-0.5 font-mono text-xs font-bold text-destructive">
              ADMIN CONTROL PANEL
            </span>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Department Administration
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Computer Science &amp; Engineering • National Institute of Technology
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/people/faculty"
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition"
            >
              <UserPlus className="h-4 w-4" /> Add Faculty
            </Link>
            <Link
              href="/admin/people/students"
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-accent transition"
            >
              <UploadCloud className="h-4 w-4" /> Import CSV
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Faculty Members", value: kpis.faculty_count, color: "text-primary", bg: "bg-primary/10", icon: Users },
          { label: "Total Students", value: kpis.total_students, color: "text-chart-2", bg: "bg-chart-2/10", icon: Users },
          { label: "Research Publications", value: kpis.total_publications, color: "text-chart-3", bg: "bg-chart-3/10", icon: BookOpen },
          { label: "Active Grants", value: formatINR(kpis.total_sanctioned_amount), color: "text-chart-4", bg: "bg-chart-4/10", icon: Lightbulb },
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
            <p className={`mt-2 text-2xl font-bold font-mono ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Grid: Faculty Directory & Admin Actions */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">Department Faculty</h2>
            <Link href="/admin/people/faculty" className="text-xs font-semibold text-primary hover:underline">
              Manage All ({MOCK_FACULTY.length}) →
            </Link>
          </div>

          <div className="divide-y divide-border/60">
            {MOCK_FACULTY.map((f) => (
              <div key={f.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-muted overflow-hidden">
                    <img src={f.image_url} alt={f.full_name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{f.full_name}</p>
                    <p className="text-xs text-muted-foreground">{f.designation} • {f.employee_code}</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Admin Navigation */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
          <h2 className="text-base font-bold text-foreground">Quick Management</h2>
          {[
            { label: "Announcements & Notices", href: "/admin/news/announcements" },
            { label: "Student Roster & CSV Import", href: "/admin/people/students" },
            { label: "Faculty Credentials / Resets", href: "/admin/credentials/facultiescredentials" },
            { label: "Placement Statistics", href: "/admin/placement" },
            { label: "HOD Message", href: "/admin/hod" },
            { label: "Research Visual Analytics", href: "/admin/analytics" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between rounded-xl border border-border/80 bg-background p-3 text-xs font-semibold text-foreground hover:bg-accent hover:text-primary transition"
            >
              <span>{item.label}</span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
