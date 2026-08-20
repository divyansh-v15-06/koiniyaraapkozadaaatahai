"use client";

import type { ReactNode } from "react";
import { FacultySidebar } from "@/components/layouts/faculty-sidebar";
import { useEffect, useState } from "react";
import { MOCK_FACULTY } from "@/lib/mock-data";
import { resolveFacultyDepartment } from "@/lib/faculty-storage";
import Link from "next/link";
import { Download, ExternalLink, GraduationCap, ShieldCheck } from "lucide-react";

export default function FacultyPagesLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const raw = localStorage.getItem("auth_user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {}
    }
  }, []);

  const activeFaculty =
    MOCK_FACULTY.find(
      (f) =>
        f.employee_code?.toLowerCase() === user?.employee_code?.toLowerCase() ||
        f.email?.toLowerCase() === user?.email?.toLowerCase() ||
        f.id === user?.faculty_id
    ) || MOCK_FACULTY[0];

  const facultyDept = resolveFacultyDepartment(activeFaculty, user);

  return (
    <div className="flex min-h-screen bg-[#faf6f3] font-sans">
      <FacultySidebar />
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#eedfd8] bg-white px-6 shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2 py-0.5 rounded uppercase">
              {facultyDept.code} Faculty Portal
            </span>
            <span className="text-xs text-neutral-400 hidden sm:inline">•</span>
            <h2 className="text-xs sm:text-sm font-bold text-[#1c110c] hidden sm:block">
              {activeFaculty.full_name} ({activeFaculty.designation})
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/faculty/export"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#eedfd8] bg-[#fff9f6] text-[#33110e] text-xs font-bold hover:bg-[#33110e] hover:text-white transition shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" /> Export CV
            </Link>

            <Link
              href={`/people/faculty/${activeFaculty.employee_code || activeFaculty.id}?dept=${facultyDept.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#33110e] hover:bg-[#85261e] text-white text-xs font-bold transition shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Public View
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
