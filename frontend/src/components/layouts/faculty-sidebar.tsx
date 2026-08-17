"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  GraduationCap,
  Briefcase,
  Award,
  Globe,
  Mic2,
  BookOpen,
  FileText,
  Lightbulb,
  FlaskConical,
  Users,
  Calendar,
  Download,
  LogOut,
} from "lucide-react";

type SidebarLink =
  | { label: string; href: string; icon: any }
  | { section: string; items: { label: string; href: string; icon: any }[] };

const sidebarLinks: SidebarLink[] = [
  { label: "Dashboard", href: "/faculty", icon: LayoutDashboard },
  { label: "Profile", href: "/faculty/profile", icon: User },
  {
    section: "CV & Experience",
    items: [
      { label: "Qualifications", href: "/faculty/qualifications", icon: GraduationCap },
      { label: "Teaching Experience", href: "/faculty/teaching-exp", icon: Briefcase },
      { label: "Admin Experience", href: "/faculty/admin-exp", icon: Briefcase },
      { label: "Honors & Awards", href: "/faculty/honors", icon: Award },
      { label: "Exposure & Visits", href: "/faculty/exposures", icon: Globe },
      { label: "Expert Talks", href: "/faculty/expert-talks", icon: Mic2 },
    ],
  },
  {
    section: "Research Output",
    items: [
      { label: "Publications", href: "/faculty/publications", icon: BookOpen },
      { label: "Patents", href: "/faculty/patents", icon: FileText },
      { label: "Projects", href: "/faculty/projects", icon: Lightbulb },
      { label: "Consultancies", href: "/faculty/consultancies", icon: FlaskConical },
      { label: "Supervisions", href: "/faculty/supervisions", icon: Users },
      { label: "Events", href: "/faculty/events", icon: Calendar },
    ],
  },
  { label: "Export Resume", href: "/faculty/export", icon: Download },
];

export function FacultySidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
          F
        </div>
        <span className="text-sm font-semibold">Faculty Portal</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {sidebarLinks.map((item, i) => {
            if ("section" in item) {
              return (
                <li key={i}>
                  <p className="mb-1 mt-4 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                    {item.section}
                  </p>
                  <ul className="space-y-0.5">
                    {item.items.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition",
                            pathname === link.href
                              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                          )}
                        >
                          <link.icon className="h-4 w-4 flex-shrink-0" />
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            }
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition",
                    pathname === item.href
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="border-t border-sidebar-border p-3">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/70 transition hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
