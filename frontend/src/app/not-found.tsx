import Link from "next/link";
import {
  Home,
  ArrowLeft,
  Search,
  BookOpen,
  GraduationCap,
  Megaphone,
  Building2,
  FileQuestion,
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fff9f6] flex flex-col justify-between font-sans selection:bg-[#85261e] selection:text-white">
      {/* Top Accent Line */}
      <div className="h-1.5 bg-gradient-to-r from-[#33110e] via-[#85261e] to-amber-500 w-full" />

      {/* Main 404 Container */}
      <main className="max-w-3xl mx-auto px-4 py-16 text-center flex-1 flex flex-col items-center justify-center space-y-8">
        {/* Emblem & Badge */}
        <div className="flex flex-col items-center space-y-3">
          <div className="w-24 h-24 rounded-full bg-white border-2 border-[#eedfd8] p-3 shadow-md flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/nith.png"
              alt="National Institute of Technology Hamirpur"
              className="w-full h-full object-contain filter drop-shadow-xs"
            />
          </div>
          <p className="text-xs font-semibold text-[#6b5c58] tracking-wider uppercase">
            राष्ट्रीय प्रौद्योगिकी संस्थान हमीरपुर • NIT Hamirpur
          </p>
        </div>

        {/* 404 Header */}
        <div className="space-y-2">
          <span className="inline-block bg-[#33110e] text-white text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-xs">
            HTTP 404 Error
          </span>
          <h1 className="text-5xl sm:text-7xl font-black text-[#33110e] tracking-tight">
            404
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1c110c]">
            Page Not Found • पृष्ठ नहीं मिला
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed pt-1">
            The page, faculty profile, or academic circular you are looking for might have been moved, renamed, or is temporarily unavailable.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#33110e] hover:bg-[#85261e] text-white text-xs font-bold transition shadow-sm hover:shadow-md cursor-pointer"
          >
            <Home className="w-4 h-4 text-amber-300" />
            <span>Return to Department Homepage</span>
          </Link>

          <Link
            href="/people/faculty"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#eedfd8] bg-white hover:bg-[#fff9f6] text-[#33110e] text-xs font-semibold transition cursor-pointer"
          >
            <GraduationCap className="w-4 h-4 text-[#85261e]" />
            <span>Faculty Directory</span>
          </Link>
        </div>

        {/* Helpful Department Shortcuts */}
        <div className="w-full bg-white border border-[#eedfd8] rounded-2xl p-6 shadow-xs text-left space-y-3 max-w-xl">
          <h3 className="text-xs font-bold uppercase text-[#85261e] tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" /> Popular Department Pages:
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <Link
              href="/research/publications"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#fff9f6] text-neutral-700 hover:text-[#33110e] transition font-medium border border-transparent hover:border-[#eedfd8]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#85261e]" />
              <span>Research Publications</span>
            </Link>

            <Link
              href="/academics/programsoffered"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#fff9f6] text-neutral-700 hover:text-[#33110e] transition font-medium border border-transparent hover:border-[#eedfd8]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#85261e]" />
              <span>Academic Programmes (NEP)</span>
            </Link>

            <Link
              href="/news/announcements"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#fff9f6] text-neutral-700 hover:text-[#33110e] transition font-medium border border-transparent hover:border-[#eedfd8]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#85261e]" />
              <span>Department Notices &amp; Circulars</span>
            </Link>

            <Link
              href="/academics/calendar"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#fff9f6] text-neutral-700 hover:text-[#33110e] transition font-medium border border-transparent hover:border-[#eedfd8]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#85261e]" />
              <span>Academic Calendar</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Subtle Footer */}
      <footer className="border-t border-[#eedfd8] py-4 text-center text-xs text-neutral-500">
        <p>National Institute of Technology Hamirpur • Himachal Pradesh - 177005</p>
      </footer>
    </div>
  );
}
