"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  GraduationCap,
} from "lucide-react";

const navItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About Us",
    href: "/aboutus",
    children: [
      { label: "Department Overview", href: "/aboutus" },
      { label: "HOD Message", href: "/aboutus/hod" },
      { label: "Labs & Facilities", href: "/aboutus/labs" },
      { label: "FAQ", href: "/aboutus/faq" },
    ],
  },
  {
    label: "Academics",
    href: "/academics",
    children: [
      { label: "Programmes Offered", href: "/academics/programsoffered" },
      { label: "Courses", href: "/academics/courses" },
      { label: "Syllabus", href: "/academics/syllabus" },
      { label: "Academic Calendar", href: "/academics/calendar" },
      { label: "Labs", href: "/academics/labs" },
    ],
  },
  {
    label: "People",
    href: "/people",
    children: [
      { label: "Faculty", href: "/people/faculty" },
      { label: "Staff", href: "/people/staff" },
      { label: "Students", href: "/people/students" },
      { label: "PhD Scholars", href: "/people/phdscholars" },
    ],
  },
  {
    label: "Research",
    href: "/research",
    children: [
      { label: "Publications", href: "/research/publications" },
      { label: "Patents", href: "/research/patents" },
      { label: "Sponsored Projects", href: "/research/projects" },
      { label: "Consultancies", href: "/research/consultancy" },
      { label: "Events & Workshops", href: "/research/events" },
    ],
  },
  {
    label: "News",
    href: "/news",
    children: [
      { label: "Announcements", href: "/news/announcements" },
      { label: "Achievements", href: "/news/achievements" },
    ],
  },
  {
    label: "Placements",
    href: "/placementpage",
  },
];

export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md">
      {/* Top bar */}
      <div className="border-b border-border/50 bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5 text-xs">
          <span className="flex items-center gap-2">
            <GraduationCap className="h-3.5 w-3.5" />
            National Institute of Technology
          </span>
          <div className="flex gap-4">
            <Link href="/faculty/login" className="transition hover:text-white/80">
              Faculty Login
            </Link>
            <Link href="/admin/login" className="transition hover:text-white/80">
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            CSE
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold leading-tight">
              Computer Science &amp; Engineering
            </p>
            <p className="text-xs text-muted-foreground">Department Portal</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <li key={item.label} className="group relative">
              <Link
                href={item.href}
                className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition hover:bg-accent hover:text-accent-foreground"
              >
                {item.label}
                {item.children && <ChevronDown className="h-3.5 w-3.5" />}
              </Link>
              {item.children && (
                <div className="invisible absolute left-0 top-full z-50 min-w-[200px] translate-y-1 rounded-lg border border-border bg-popover p-1.5 shadow-lg opacity-0 transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded-md px-3 py-2 text-sm transition hover:bg-accent"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-md p-2 lg:hidden hover:bg-accent"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-border bg-card px-6 pb-4 pt-2 lg:hidden">
          {navItems.map((item) => (
            <div key={item.label} className="border-b border-border/50 py-2">
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block py-1.5 text-sm font-medium"
              >
                {item.label}
              </Link>
              {item.children?.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-1 pl-4 text-sm text-muted-foreground"
                >
                  {child.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
