"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  UserCog,
  GraduationCap,
  BookOpen,
  FileText,
  Lightbulb,
  Megaphone,
  Newspaper,
  Image,
  Info,
  MessageSquare,
  HelpCircle,
  FolderOpen,
  FlaskConical,
  MonitorSmartphone,
  Wrench,
  BarChart3,
  ClipboardList,
  Shield,
  LogOut,
} from "lucide-react";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  {
    section: "People",
    items: [
      { label: "Faculty", href: "/admin/people/faculty", icon: Users },
      { label: "Staff", href: "/admin/people/staff", icon: UserCog },
      { label: "Students", href: "/admin/people/students", icon: GraduationCap },
      { label: "PhD Scholars", href: "/admin/people/phdscholars", icon: BookOpen },
    ],
  },
  {
    section: "Research",
    items: [
      { label: "Publications", href: "/admin/research/publications", icon: FileText },
      { label: "Patents", href: "/admin/research/patents", icon: Shield },
      { label: "Projects", href: "/admin/research/projects", icon: Lightbulb },
    ],
  },
  {
    section: "CMS & Content",
    items: [
      { label: "Announcements", href: "/admin/news/announcements", icon: Megaphone },
      { label: "Achievements", href: "/admin/news/achievements", icon: Newspaper },
      { label: "Hero Carousel", href: "/admin/home/carousel", icon: Image },
      { label: "About Us", href: "/admin/home/aboutus", icon: Info },
      { label: "HOD Message", href: "/admin/hod", icon: MessageSquare },
      { label: "FAQ / Q&A", href: "/admin/qna", icon: HelpCircle },
      { label: "Documents", href: "/admin/documents", icon: FolderOpen },
    ],
  },
  {
    section: "Operations",
    items: [
      { label: "Courses", href: "/admin/academics/courses", icon: BookOpen },
      { label: "Labs", href: "/admin/academics/labs", icon: FlaskConical },
      { label: "Equipment", href: "/admin/equipments", icon: MonitorSmartphone },
      { label: "Placement Stats", href: "/admin/placement", icon: BarChart3 },
    ],
  },
  {
    section: "System",
    items: [
      { label: "Credentials", href: "/admin/credentials/facultiescredentials", icon: Wrench },
      { label: "Reports", href: "/admin/report", icon: ClipboardList },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive text-destructive-foreground text-xs font-bold">
          A
        </div>
        <span className="text-sm font-semibold">Admin Portal</span>
      </div>

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
