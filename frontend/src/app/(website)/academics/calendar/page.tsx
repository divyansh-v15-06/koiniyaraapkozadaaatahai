"use client";

import { useState } from "react";
import {
  Calendar as CalendarIcon,
  Download,
  Clock,
  CheckCircle2,
  FileText,
  AlertCircle,
  Sun,
  CloudRain,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { useDepartment } from "@/context/department-context";

export default function AcademicCalendarPage() {
  const { activeDepartment } = useDepartment();
  const [activeTab, setActiveTab] = useState<"ODD" | "EVEN" | "ARCHIVE">("ODD");

  const oddSemesterEvents = [
    {
      sr: 1,
      activity: "Physical Reporting & Registration for UG (B.Tech 1st Year) / PG / Ph.D.",
      date: "July 24 - 26, 2025",
      type: "Registration",
      isKey: true,
    },
    {
      sr: 2,
      activity: "Registration for Continuing UG (3rd, 5th, 7th Sem) & PG Students",
      date: "July 28 - 29, 2025",
      type: "Registration",
      isKey: false,
    },
    {
      sr: 3,
      activity: "Commencement of Regular Academic Classes & Laboratory Practicals",
      date: "August 01, 2025",
      type: "Academic",
      isKey: true,
    },
    {
      sr: 4,
      activity: "Last Date for Course Add / Drop & Section Reallocation",
      date: "August 12, 2025",
      type: "Academic",
      isKey: false,
    },
    {
      sr: 5,
      activity: "Mid-Semester Examination (MSE) - Theory & Sessional Evaluations",
      date: "September 22 - 27, 2025",
      type: "Examination",
      isKey: true,
    },
    {
      sr: 6,
      activity: "Display of MSE Answer Scripts & Student Performance Review",
      date: "October 06 - 08, 2025",
      type: "Evaluation",
      isKey: false,
    },
    {
      sr: 7,
      activity: "Institute Annual Technical Festival (NIMBUS 2025)",
      date: "October 17 - 19, 2025",
      type: "Co-Curricular",
      isKey: false,
    },
    {
      sr: 8,
      activity: "Mid-Term Project Evaluation for Final Year B.Tech & M.Tech Dissertations",
      date: "November 03 - 07, 2025",
      type: "Academic",
      isKey: false,
    },
    {
      sr: 9,
      activity: "Last Day of Instruction / Academic Teaching",
      date: "November 21, 2025",
      type: "Academic",
      isKey: true,
    },
    {
      sr: 10,
      activity: "End-Semester Practical & Laboratory Examinations",
      date: "November 24 - 28, 2025",
      type: "Examination",
      isKey: false,
    },
    {
      sr: 11,
      activity: "End-Semester Theory Examinations (ESE - Odd Semester)",
      date: "December 01 - 12, 2025",
      type: "Examination",
      isKey: true,
    },
    {
      sr: 12,
      activity: "Submission of Grades by Faculty on Institute ERP Portal",
      date: "December 18, 2025",
      type: "Result",
      isKey: false,
    },
    {
      sr: 13,
      activity: "Winter Vacation for UG / PG Students",
      date: "December 15, 2025 - January 09, 2026",
      type: "Vacation",
      isKey: true,
    },
  ];

  const evenSemesterEvents = [
    {
      sr: 1,
      activity: "Physical / ERP Course Registration for Even Semester (All UG / PG / Ph.D.)",
      date: "January 08 - 09, 2026",
      type: "Registration",
      isKey: true,
    },
    {
      sr: 2,
      activity: "Commencement of Regular Academic Classes for Even Semester",
      date: "January 12, 2026",
      type: "Academic",
      isKey: true,
    },
    {
      sr: 3,
      activity: "Last Date for Late Registration with Prescribed Fine",
      date: "January 19, 2026",
      type: "Registration",
      isKey: false,
    },
    {
      sr: 4,
      activity: "Institute Annual Cultural Festival (HILL'FFAIR 2026)",
      date: "February 13 - 15, 2026",
      type: "Co-Curricular",
      isKey: false,
    },
    {
      sr: 5,
      activity: "Mid-Semester Examination (MSE - Even Semester)",
      date: "March 02 - 07, 2026",
      type: "Examination",
      isKey: true,
    },
    {
      sr: 6,
      activity: "Mid-Term Project & Capstone Prototype Demonstration",
      date: "April 06 - 10, 2026",
      type: "Evaluation",
      isKey: false,
    },
    {
      sr: 7,
      activity: "Last Day of Instruction for Even Semester",
      date: "April 30, 2026",
      type: "Academic",
      isKey: true,
    },
    {
      sr: 8,
      activity: "End-Semester Practical & Lab Examinations",
      date: "May 04 - 08, 2026",
      type: "Examination",
      isKey: false,
    },
    {
      sr: 9,
      activity: "End-Semester Theory Examinations (ESE - Even Semester)",
      date: "May 11 - 22, 2026",
      type: "Examination",
      isKey: true,
    },
    {
      sr: 10,
      activity: "Submission of Final Year Project Reports & Plagiarism Verification",
      date: "May 25, 2026",
      type: "Academic",
      isKey: false,
    },
    {
      sr: 11,
      activity: "Summer Vacation / Mandatory Industry Internship Period",
      date: "May 25 - July 17, 2026",
      type: "Vacation",
      isKey: true,
    },
  ];

  const archivedCalendars = [
    {
      session: "Academic Session 2025-2026",
      title: "Complete Academic Calendar (Odd & Even Semesters)",
      oddPdf: "https://nith.ac.in/uploads/topics/academic-calendar-2025-26.pdf",
      evenPdf: "https://nith.ac.in/uploads/topics/academic-calendar-2025-26.pdf",
      updated: "July 2025",
    },
    {
      session: "Academic Session 2024-2025",
      title: "Odd Semester Academic Calendar (July - Dec 2024)",
      oddPdf: "https://nith.ac.in",
      evenPdf: "https://nith.ac.in",
      updated: "June 2024",
    },
    {
      session: "Academic Session 2024-2025",
      title: "Even Semester Academic Calendar (Jan - June 2025)",
      oddPdf: "https://nith.ac.in",
      evenPdf: "https://nith.ac.in",
      updated: "December 2024",
    },
    {
      session: "Academic Session 2023-2024",
      title: "Annual Academic Calendar & Holiday List 2023-2024",
      oddPdf: "https://nith.ac.in",
      evenPdf: "https://nith.ac.in",
      updated: "July 2023",
    },
  ];

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "Examination":
        return "bg-red-100 text-red-900 border border-red-200 font-bold";
      case "Academic":
        return "bg-sky-100 text-sky-900 border border-sky-200 font-semibold";
      case "Registration":
        return "bg-amber-100 text-amber-900 border border-amber-200 font-bold";
      case "Vacation":
        return "bg-emerald-100 text-emerald-900 border border-emerald-200 font-semibold";
      case "Co-Curricular":
        return "bg-purple-100 text-purple-900 border border-purple-200 font-semibold";
      default:
        return "bg-neutral-100 text-neutral-800 border border-neutral-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 bg-white min-h-[85vh] font-sans">
      {/* Title Header */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-[#85261e]" />
              Academic Calendar
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2 py-0.5 rounded uppercase">
              {activeDepartment.code}
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Official schedules of registration, classes, MSE/ESE examinations, festivals, and vacations for Odd and Even semesters.
          </p>
        </div>

        {/* Download Official PDF Button */}
        <a
          href="https://nith.ac.in"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] text-white text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <Download className="w-4 h-4 text-amber-300" />
          <span>Download Institute Calendar (PDF)</span>
        </a>
      </div>

      {/* Odd / Even Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#eedfd8] pb-3">
        <button
          onClick={() => setActiveTab("ODD")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
            activeTab === "ODD"
              ? "bg-[#33110e] text-white shadow-xs"
              : "bg-[#fff9f6] border border-[#eedfd8] text-[#33110e] hover:bg-[#eedfd8]/40"
          }`}
        >
          <CloudRain className="w-4 h-4 text-amber-300" />
          <span>Odd Semester (Autumn / Monsoon Session)</span>
        </button>

        <button
          onClick={() => setActiveTab("EVEN")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
            activeTab === "EVEN"
              ? "bg-[#33110e] text-white shadow-xs"
              : "bg-[#fff9f6] border border-[#eedfd8] text-[#33110e] hover:bg-[#eedfd8]/40"
          }`}
        >
          <Sun className="w-4 h-4 text-amber-300" />
          <span>Even Semester (Spring / Winter Session)</span>
        </button>

        <button
          onClick={() => setActiveTab("ARCHIVE")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
            activeTab === "ARCHIVE"
              ? "bg-[#33110e] text-white shadow-xs"
              : "bg-[#fff9f6] border border-[#eedfd8] text-[#33110e] hover:bg-[#eedfd8]/40"
          }`}
        >
          <FileText className="w-4 h-4 text-[#85261e]" />
          <span>Archived Calendars &amp; PDFs</span>
        </button>
      </div>

      {/* Odd Semester Table */}
      {activeTab === "ODD" && (
        <div className="space-y-4">
          <div className="bg-[#fff9f6] border border-[#eedfd8] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="bg-[#33110e] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                Odd Semester (July - December 2025)
              </span>
              <h2 className="text-base font-bold text-[#1c110c] mt-1">
                Schedule of Academic Activities &amp; Examinations
              </h2>
            </div>
            <a
              href="https://nith.ac.in"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#eedfd8] bg-white text-xs font-bold text-[#33110e] hover:bg-[#33110e] hover:text-white transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Odd Sem PDF</span>
            </a>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#eedfd8] shadow-xs">
            <table className="w-full text-left border-collapse bg-white text-xs">
              <thead>
                <tr className="bg-[#1c110c] text-white text-xs font-bold uppercase tracking-wider">
                  <th className="py-3 px-3 text-center border-r border-neutral-800 w-16">Sr. No.</th>
                  <th className="py-3 px-4 border-r border-neutral-800">Academic Milestone / Activity</th>
                  <th className="py-3 px-4 text-center border-r border-neutral-800 w-48">Scheduled Dates</th>
                  <th className="py-3 px-3 text-center w-28">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eedfd8]">
                {oddSemesterEvents.map((ev) => (
                  <tr
                    key={ev.sr}
                    className={`transition ${ev.isKey ? "bg-[#fff9f6]/80 font-medium" : "hover:bg-[#fff9f6]"}`}
                  >
                    <td className="py-3 px-3 text-center font-bold text-neutral-600 border-r border-[#eedfd8]">
                      #{ev.sr}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#1c110c] border-r border-[#eedfd8] flex items-center gap-2">
                      {ev.isKey && <CheckCircle2 className="w-3.5 h-3.5 text-[#85261e] flex-shrink-0" />}
                      <span>{ev.activity}</span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-[#85261e] border-r border-[#eedfd8]">
                      {ev.date}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`text-[10px] px-2 py-0.5 rounded ${getTypeBadge(ev.type)}`}>
                        {ev.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Even Semester Table */}
      {activeTab === "EVEN" && (
        <div className="space-y-4">
          <div className="bg-[#fff9f6] border border-[#eedfd8] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="bg-[#33110e] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                Even Semester (January - June 2026)
              </span>
              <h2 className="text-base font-bold text-[#1c110c] mt-1">
                Schedule of Academic Activities &amp; Examinations
              </h2>
            </div>
            <a
              href="https://nith.ac.in"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#eedfd8] bg-white text-xs font-bold text-[#33110e] hover:bg-[#33110e] hover:text-white transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Even Sem PDF</span>
            </a>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#eedfd8] shadow-xs">
            <table className="w-full text-left border-collapse bg-white text-xs">
              <thead>
                <tr className="bg-[#1c110c] text-white text-xs font-bold uppercase tracking-wider">
                  <th className="py-3 px-3 text-center border-r border-neutral-800 w-16">Sr. No.</th>
                  <th className="py-3 px-4 border-r border-neutral-800">Academic Milestone / Activity</th>
                  <th className="py-3 px-4 text-center border-r border-neutral-800 w-48">Scheduled Dates</th>
                  <th className="py-3 px-3 text-center w-28">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eedfd8]">
                {evenSemesterEvents.map((ev) => (
                  <tr
                    key={ev.sr}
                    className={`transition ${ev.isKey ? "bg-[#fff9f6]/80 font-medium" : "hover:bg-[#fff9f6]"}`}
                  >
                    <td className="py-3 px-3 text-center font-bold text-neutral-600 border-r border-[#eedfd8]">
                      #{ev.sr}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#1c110c] border-r border-[#eedfd8] flex items-center gap-2">
                      {ev.isKey && <CheckCircle2 className="w-3.5 h-3.5 text-[#85261e] flex-shrink-0" />}
                      <span>{ev.activity}</span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-[#85261e] border-r border-[#eedfd8]">
                      {ev.date}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`text-[10px] px-2 py-0.5 rounded ${getTypeBadge(ev.type)}`}>
                        {ev.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Archive / Downloadable Documents */}
      {activeTab === "ARCHIVE" && (
        <div className="space-y-4">
          <div className="bg-[#fff9f6] border border-[#eedfd8] rounded-xl p-4">
            <h2 className="text-base font-bold text-[#1c110c]">
              Archived Academic Calendars &amp; Official Notifications
            </h2>
            <p className="text-xs text-neutral-600 mt-0.5">
              Official downloadable PDFs approved by Senate / Dean Academic for previous sessions.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {archivedCalendars.map((cal, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#eedfd8] rounded-xl p-5 shadow-xs hover:shadow-md transition space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="bg-[#fff9f6] border border-[#eedfd8] text-[#85261e] text-[10px] font-bold px-2 py-0.5 rounded">
                    {cal.session}
                  </span>
                  <span className="text-[11px] text-neutral-500 font-mono">Updated: {cal.updated}</span>
                </div>

                <h3 className="text-sm font-bold text-[#1c110c] leading-snug">
                  {cal.title}
                </h3>

                <div className="pt-2 flex flex-wrap gap-2 border-t border-[#eedfd8]/60">
                  <a
                    href={cal.oddPdf}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#33110e] hover:bg-[#85261e] text-white text-xs font-bold transition shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-300" />
                    <span>Download Calendar PDF</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
