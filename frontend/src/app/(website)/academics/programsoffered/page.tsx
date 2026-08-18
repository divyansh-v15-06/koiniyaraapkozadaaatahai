"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Award,
  BookOpen,
  Clock,
  Users,
  ArrowRight,
  Download,
  FileText,
  CheckCircle2,
  Sparkles,
  Layers,
  Building2,
  Calendar,
} from "lucide-react";
import { useDepartment } from "@/context/department-context";

export default function ProgrammesPage() {
  const { activeDepartment } = useDepartment();
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");

  const programmes = [
    {
      code: "B.Tech",
      name: `Bachelor of Technology in ${activeDepartment.name}`,
      level: "Undergraduate (UG)",
      duration: "4 Years (8 Semesters)",
      intake: 120,
      badge: "Flagship UG Programme",
      description: `Comprehensive 4-year undergraduate degree aligned with NEP-2020. Emphasizes foundational computing theory, advanced algorithmic analysis, system architecture, artificial intelligence, software engineering, and industry-partnered capstone internships.`,
      highlights: [
        "Curriculum fully restructured as per National Education Policy (NEP-2020)",
        "Multidisciplinary open electives and minor specialization options",
        "Mandatory 6-month industry internship in 8th semester",
        "Hands-on lab practicals across 12 specialized departmental labs",
      ],
      syllabusLink: "https://nith.ac.in/uploads/topics/new-nep-cse-syllabus17222307132912.pdf",
      syllabusSize: "2.4 MB PDF",
    },
    {
      code: "M.Tech CSE",
      name: `Master of Technology in ${activeDepartment.name}`,
      level: "Postgraduate (PG)",
      duration: "2 Years (4 Semesters)",
      intake: 30,
      badge: "GATE Qualified Intake",
      description: `Advanced 2-year postgraduate program offering rigorous research training in distributed algorithms, high-performance computing, advanced cryptography, cloud infrastructure, and wireless cyber-physical systems.`,
      highlights: [
        "Specialized coursework with active laboratory research",
        "1-year dedicated Master's dissertation under faculty supervision",
        "CCMT centralized admissions with GATE institutional assistantships",
        "Publication requirement in Scopus/SCI peer-reviewed venues",
      ],
      syllabusLink: "https://nith.ac.in",
      syllabusSize: "1.8 MB PDF",
    },
    {
      code: "M.Tech AI",
      name: "Master of Technology in Artificial Intelligence & Data Science",
      level: "Postgraduate (PG)",
      duration: "2 Years (4 Semesters)",
      intake: 30,
      badge: "Emerging Technologies Track",
      description: `Cutting-edge postgraduate degree dedicated to deep learning models, natural language processing, computer vision, reinforcement learning, edge AI architectures, and large-scale data science pipelines.`,
      highlights: [
        "Focus on LLMs, generative AI, transformer architectures, and explainable AI",
        "High-performance GPU computing access (NVIDIA DGX & RTX clusters)",
        "Interdisciplinary research with biomedical and robotics applications",
        "Collaborative projects with industry leaders and research centers",
      ],
      syllabusLink: "https://nith.ac.in",
      syllabusSize: "2.1 MB PDF",
    },
    {
      code: "Dual Degree",
      name: `Integrated Dual Degree (B.Tech & M.Tech in ${activeDepartment.name})`,
      level: "Integrated Dual Degree",
      duration: "5 Years (10 Semesters)",
      intake: 30,
      badge: "Integrated 5-Year Track",
      description: `Seamless 5-year integrated program combining undergraduate fundamentals with advanced postgraduate research. Students graduate with both Bachelor's and Master's credentials upon completion of a rigorous dual-degree thesis.`,
      highlights: [
        "Continuous curriculum without separate master's entrance tests",
        "Accelerated entry into master's thesis research from 7th semester",
        "Dual degree awarded upon completion of 10 semesters",
        "Preferred pathway for doctoral research transitions",
      ],
      syllabusLink: "https://nith.ac.in",
      syllabusSize: "2.8 MB PDF",
    },
    {
      code: "Ph.D.",
      name: `Doctor of Philosophy in ${activeDepartment.name}`,
      level: "Doctoral (Ph.D.)",
      duration: "3 - 5 Years",
      intake: "Rolling Admission",
      badge: "Institute Fellowship Available",
      description: `Premier doctoral research program preparing scholars for careers in academia, industrial R&D, and national laboratories. Doctoral scholars work on pioneering research funded by SERB, DST, MeitY, and DRDO.`,
      highlights: [
        "Institutional Teaching & Research Assistantships (MHRD/MoE fellowships)",
        "Rigorous comprehensive examination, state-of-the-art seminars, and pre-submission defense",
        "Access to advanced departmental compute servers, digital libraries, and international travel grants",
        "Over 105 active scholars currently pursuing research in the department",
      ],
      syllabusLink: "https://nith.ac.in",
      syllabusSize: "1.2 MB Guidelines",
    },
    {
      code: "Minor Degree",
      name: `Minor Degree in ${activeDepartment.name} (NEP-2020)`,
      level: "Undergraduate Minor",
      duration: "6 Semesters (3rd - 8th Sem)",
      intake: 45,
      badge: "Interdisciplinary Minor",
      description: `Specialized minor stream designed for students enrolled in other engineering branches (ECE, EE, ME, Civil, Chemical, etc.) wanting strong credentials in software engineering, algorithms, data science, and AI.`,
      highlights: [
        "Earn 18-20 additional credits alongside major engineering degree",
        "Covers Data Structures, Object-Oriented Programming, DBMS, Operating Systems, and AI",
        "Special notation on official institute degree transcript upon graduation",
        "Enhances multidisciplinary placement and research eligibility",
      ],
      syllabusLink: "https://nith.ac.in/uploads/topics/syllabus-cse-minor-degree17216260326071.pdf",
      syllabusSize: "1.4 MB PDF",
    },
  ];

  const filteredProgrammes = programmes.filter((p) => {
    if (selectedLevel === "ALL") return true;
    if (selectedLevel === "UG") return p.level.includes("Undergraduate");
    if (selectedLevel === "PG") return p.level.includes("Postgraduate");
    if (selectedLevel === "DUAL") return p.level.includes("Integrated");
    if (selectedLevel === "PHD") return p.level.includes("Doctoral");
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 bg-white min-h-[85vh] font-sans">
      {/* Title Header */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-[#85261e]" />
              Academic Programmes Offered
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2 py-0.5 rounded uppercase">
              {activeDepartment.code}
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Undergraduate, Postgraduate, Integrated Dual Degree, and Doctoral research programs offered by Department of {activeDepartment.name}.
          </p>
        </div>

        {/* Level Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#fff9f6] p-1 rounded-lg border border-[#eedfd8]">
          {[
            { id: "ALL", label: "All Programmes" },
            { id: "UG", label: "Undergraduate (UG)" },
            { id: "PG", label: "Postgraduate (PG)" },
            { id: "DUAL", label: "Dual Degree" },
            { id: "PHD", label: "Ph.D. Doctoral" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedLevel(cat.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                selectedLevel === cat.id
                  ? "bg-[#33110e] text-white shadow-xs"
                  : "text-[#33110e] hover:bg-[#eedfd8]/50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stat Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#fff9f6] border border-[#eedfd8] rounded-xl p-4 text-center">
          <span className="text-2xl font-extrabold text-[#33110e]">6</span>
          <p className="text-xs font-bold text-[#85261e] uppercase mt-0.5">Degree Programs</p>
          <p className="text-[11px] text-neutral-500">UG, PG, Dual, PhD &amp; Minor</p>
        </div>
        <div className="bg-[#fff9f6] border border-[#eedfd8] rounded-xl p-4 text-center">
          <span className="text-2xl font-extrabold text-[#33110e]">255+</span>
          <p className="text-xs font-bold text-[#85261e] uppercase mt-0.5">Annual Intake</p>
          <p className="text-[11px] text-neutral-500">JEE Main, CCMT &amp; Institute Exam</p>
        </div>
        <div className="bg-[#fff9f6] border border-[#eedfd8] rounded-xl p-4 text-center">
          <span className="text-2xl font-extrabold text-[#33110e]">NEP-2020</span>
          <p className="text-xs font-bold text-[#85261e] uppercase mt-0.5">Curriculum Scheme</p>
          <p className="text-[11px] text-neutral-500">Flexible credit &amp; minor tracks</p>
        </div>
        <div className="bg-[#fff9f6] border border-[#eedfd8] rounded-xl p-4 text-center">
          <span className="text-2xl font-extrabold text-[#33110e]">105+</span>
          <p className="text-xs font-bold text-[#85261e] uppercase mt-0.5">PhD Scholars</p>
          <p className="text-[11px] text-neutral-500">Active research scholars</p>
        </div>
      </div>

      {/* Program Cards */}
      <div className="space-y-6">
        {filteredProgrammes.map((p) => (
          <div
            key={p.code}
            className="bg-white border border-[#eedfd8] rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-[#85261e]/40 transition space-y-4"
          >
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#eedfd8]/60 pb-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[#33110e] text-white font-mono text-xs font-bold px-2.5 py-0.5 rounded uppercase">
                    {p.code}
                  </span>
                  <span className="bg-[#fff9f6] border border-[#eedfd8] text-[#85261e] text-xs font-bold px-2.5 py-0.5 rounded">
                    {p.level}
                  </span>
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">
                    {p.badge}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#1c110c] mt-2">
                  {p.name}
                </h2>
              </div>

              {/* Quick meta pills */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-neutral-700">
                <span className="flex items-center gap-1.5 bg-[#fff9f6] border border-[#eedfd8] px-3 py-1.5 rounded-lg">
                  <Clock className="w-4 h-4 text-[#85261e]" /> {p.duration}
                </span>
                <span className="flex items-center gap-1.5 bg-[#fff9f6] border border-[#eedfd8] px-3 py-1.5 rounded-lg">
                  <Users className="w-4 h-4 text-[#85261e]" /> Intake: {p.intake}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
              {p.description}
            </p>

            {/* Highlights bullet list */}
            <div className="bg-[#fff9f6] border border-[#eedfd8] rounded-xl p-4 space-y-2">
              <h3 className="text-xs font-bold uppercase text-[#33110e] tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#85261e]" /> Key Programme Highlights &amp; Outcomes
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-700">
                {p.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#85261e] flex-shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={p.syllabusLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#33110e] hover:bg-[#85261e] text-white text-xs font-bold transition shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-amber-300" />
                  <span>Download Curriculum Scheme ({p.syllabusSize})</span>
                </a>
                <Link
                  href="/academics/courses"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#eedfd8] bg-white hover:bg-[#fff9f6] text-xs font-semibold text-[#33110e] transition"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#85261e]" />
                  <span>View Course Catalogue</span>
                </Link>
              </div>

              <Link
                href="/academics/syllabus"
                className="text-xs font-bold text-[#85261e] hover:underline flex items-center gap-1"
              >
                <span>Ordinances &amp; Course Structure</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
