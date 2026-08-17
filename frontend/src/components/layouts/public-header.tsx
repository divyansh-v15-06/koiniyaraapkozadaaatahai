"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  Lock,
  UserCheck,
  ExternalLink,
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
      { label: "Laboratories", href: "/academics/labs" },
    ],
  },
  {
    label: "People",
    href: "/people/faculty",
    children: [
      { label: "Faculty Members", href: "/people/faculty" },
      { label: "Staff Members", href: "/people/staff" },
      { label: "Students Roster", href: "/people/students" },
      { label: "PhD Scholars", href: "/people/phdscholars" },
    ],
  },
  {
    label: "Research",
    href: "/research/publications",
    children: [
      { label: "Publications", href: "/research/publications" },
      { label: "Patents & IP", href: "/research/patents" },
      { label: "Sponsored Projects", href: "/research/projects" },
      { label: "Consultancies", href: "/research/consultancy" },
      { label: "Events & STCs", href: "/research/events" },
    ],
  },
  {
    label: "News & Events",
    href: "/news/announcements",
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="w-full font-sans border-b border-[#eedfd8]">
      {/* 1. Top Mini Bar - Signature #33110e from tempcse */}
      <div className="bg-[#33110e] text-neutral-100 text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3 text-neutral-300">
            <a
              href="https://mail.google.com/a/nith.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition flex items-center gap-1"
            >
              Web Mail <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
            <span className="text-neutral-500">|</span>
            <a
              href="https://portfolios.nith.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition flex items-center gap-1"
            >
              Faculty Portfolio <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
            <span className="text-neutral-500 hidden md:inline">|</span>
            <a
              href="https://nith.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition hidden md:inline"
            >
              NITH Main Portal
            </a>
          </div>

          <div className="flex items-center space-x-3 text-neutral-300">
            <Link
              href="/faculty/login"
              className="hover:text-white transition flex items-center gap-1 font-medium bg-[#4a1814] px-2 py-0.5 rounded text-[11px]"
            >
              <UserCheck className="w-3 h-3 text-amber-400" />
              Faculty Portal
            </Link>
            <span className="text-neutral-500">|</span>
            <Link
              href="/admin/login"
              className="hover:text-white transition flex items-center gap-1 font-medium bg-[#4a1814] px-2 py-0.5 rounded text-[11px]"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Institutional Brand Header with Logo & Typography */}
      <div className="bg-white py-3 px-4 sm:px-8 border-b border-[#f4ece8]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 sm:gap-4 group">
            <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/nitHamirpurLogo.png"
                alt="NIT Hamirpur Official Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="text-[11px] sm:text-[13px] font-semibold text-[#6b5c58] leading-tight">
                राष्ट्रीय प्रौद्योगिकी संस्थान हमीरपुर
              </p>
              <h1 className="text-base sm:text-xl md:text-2xl font-bold text-[#33110e] tracking-tight leading-tight group-hover:text-[#85261e] transition">
                National Institute of Technology Hamirpur
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-[#85261e] tracking-wide">
                Department of Computer Science & Engineering
              </p>
            </div>
          </Link>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#33110e] hover:bg-[#fff9f6] border border-[#eedfd8]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 3. Primary Navigation Bar - #1c110c background from tempcse */}
      <nav className="bg-[#1c110c] text-white shadow-md hidden lg:block sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center px-4">
          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative group"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="px-3.5 py-3 text-[13px] font-semibold text-neutral-200 hover:text-white hover:bg-[#33110e] flex items-center gap-1 transition tracking-wide uppercase"
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:rotate-180 transition duration-200" />
                  )}
                </Link>

                {item.children && openDropdown === item.label && (
                  <div className="absolute left-0 top-full w-56 bg-white text-[#1c110c] rounded-b-md shadow-xl border border-[#eedfd8] py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-[#fff9f6] hover:text-[#33110e] hover:pl-5 transition-all border-b border-neutral-100 last:border-0"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#eedfd8] px-4 py-3 space-y-2">
          {navItems.map((item) => (
            <div key={item.label} className="border-b border-neutral-100 pb-2">
              <Link
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-bold text-sm text-[#33110e] block py-1"
              >
                {item.label}
              </Link>
              {item.children && (
                <div className="pl-4 space-y-1 mt-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-xs text-neutral-600 hover:text-[#33110e] py-1"
                    >
                      • {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
