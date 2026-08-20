"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/layouts/admin-sidebar";
import Link from "next/link";
import { Bell, ExternalLink, Settings, ShieldCheck } from "lucide-react";

/**
 * Authenticated admin pages layout — sidebar + content area.
 */
import { useDepartment } from "@/context/department-context";
import { toast } from "sonner";

export default function AdminPagesLayout({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<any>(null);
  const { activeDepartment } = useDepartment();

  useEffect(() => {
    const raw = localStorage.getItem("auth_user");
    if (raw) {
      try {
        setAdminUser(JSON.parse(raw));
      } catch {}
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-[#faf6f3] font-sans">
      <AdminSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#eedfd8] bg-white px-6 shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2 py-0.5 rounded uppercase">
              <ShieldCheck className="w-3 h-3 inline -mt-0.5 mr-1" />
              {activeDepartment?.code || "CSE"} Admin Console
            </span>
            <span className="text-xs text-neutral-400 hidden sm:inline">•</span>
            <h2 className="text-xs sm:text-sm font-bold text-[#1c110c] hidden sm:block">
              Department of {activeDepartment?.name || "Computer Science & Engineering"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button
              onClick={() => toast.info("System Notice: 3 pending faculty qualification verification requests.")}
              className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-[#eedfd8] bg-[#fff9f6] text-[#6b5c58] hover:bg-[#33110e] hover:text-white transition cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#85261e] text-[7px] font-bold text-white animate-pulse">
                3
              </span>
            </button>

            {/* Settings */}
            <Link
              href="/admin/credentials/facultiescredentials"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#eedfd8] bg-[#fff9f6] text-[#6b5c58] hover:bg-[#33110e] hover:text-white transition cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
            </Link>

            {/* Public Website Link */}
            <Link
              href={`/?dept=${activeDepartment?.slug || "cse"}`}
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#33110e] hover:bg-[#85261e] text-white text-xs font-bold transition shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Public Site
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
