"use client";

import { Download, FileText, Calendar, BookOpen, ExternalLink, Sparkles } from "lucide-react";
import { useDepartment } from "@/context/department-context";

export default function SyllabusPage() {
  const { activeDepartment } = useDepartment();

  const syllabusItems = [
    {
      programme: `B.Tech in ${activeDepartment.name} (NEP-2020 Scheme)`,
      version: "2024-2028 Restructured Scheme",
      updated: "Academic Session 2024-2025",
      size: "2.4 MB PDF",
      url: "https://nith.ac.in/uploads/topics/new-nep-cse-syllabus17222307132912.pdf",
      description: "Complete 8-semester course structure, credit distribution, core engineering modules, multidisciplinary electives, and evaluation ordinances.",
    },
    {
      programme: `Minor Degree in ${activeDepartment.name} (NEP-2020)`,
      version: "2024 Scheme for Non-Major Branches",
      updated: "Academic Session 2024-2025",
      size: "1.4 MB PDF",
      url: "https://nith.ac.in/uploads/topics/syllabus-cse-minor-degree17216260326071.pdf",
      description: "6-semester minor stream coursework for students of other departments desiring minor specialization in algorithms and computing.",
    },
    {
      programme: `M.Tech in ${activeDepartment.name}`,
      version: "2024 Scheme with Advanced Electives",
      updated: "July 2024",
      size: "1.8 MB PDF",
      url: "https://nith.ac.in",
      description: "Postgraduate curriculum detailing specialized research tracks, laboratory modules, seminar formats, and 1-year dissertation guidelines.",
    },
    {
      programme: "M.Tech in Artificial Intelligence & Data Science",
      version: "2025 Scheme for AI Specialization",
      updated: "December 2024",
      size: "2.1 MB PDF",
      url: "https://nith.ac.in",
      description: "Detailed curriculum covering Deep Learning, NLP, Computer Vision, Edge AI, Reinforcement Learning, and Big Data frameworks.",
    },
    {
      programme: `Dual Degree (B.Tech & M.Tech in ${activeDepartment.name})`,
      version: "5-Year Integrated Degree Scheme",
      updated: "July 2024",
      size: "2.8 MB PDF",
      url: "https://nith.ac.in",
      description: "10-semester integrated curriculum mapping undergraduate coursework directly into advanced master's thesis research.",
    },
    {
      programme: "Ph.D. Coursework Syllabus & Research Guidelines",
      version: "2024 Doctoral Ordinance & Regulations",
      updated: "January 2024",
      size: "1.2 MB PDF",
      url: "https://nith.ac.in",
      description: "Doctoral research guidelines, mandatory credit coursework, state-of-the-art seminar requirements, comprehensive exams, and thesis submission ordinances.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 bg-white min-h-[85vh] font-sans">
      {/* Title Header */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#85261e]" />
              Syllabus &amp; Academic Ordinances
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2 py-0.5 rounded uppercase">
              {activeDepartment.code}
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Official curriculum schemes, NEP-2020 course outlines, credit charts, and downloadable PDFs for Department of {activeDepartment.name}.
          </p>
        </div>
      </div>

      {/* Syllabus Grid */}
      <div className="space-y-4">
        {syllabusItems.map((item, i) => (
          <div
            key={i}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-[#eedfd8] bg-white p-6 shadow-xs transition hover:border-[#85261e]/40 hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#fff9f6] border border-[#eedfd8] text-[#85261e]">
                <FileText className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-bold text-[#1c110c] text-base">{item.programme}</h2>
                  <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-[10px] font-bold px-2 py-0.5 rounded">
                    {item.version}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {item.description}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-mono pt-1">
                  <Calendar className="h-3.5 w-3.5 text-[#85261e]" /> Updated: {item.updated} • File: {item.size}
                </div>
              </div>
            </div>

            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="flex-shrink-0 flex items-center justify-center gap-2 rounded-xl bg-[#33110e] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#85261e] shadow-xs"
            >
              <Download className="h-4 w-4 text-amber-300" />
              <span>Download Scheme PDF</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
