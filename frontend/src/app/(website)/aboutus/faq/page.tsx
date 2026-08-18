"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Search, Sparkles, BookOpen, GraduationCap, Briefcase, Cpu } from "lucide-react";
import { useDepartment } from "@/context/department-context";

export default function FAQPage() {
  const { activeDepartment } = useDepartment();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");

  const faqs = [
    {
      category: "Admissions",
      q: "How can I apply for Ph.D. admissions in the Department?",
      a: "Ph.D. admissions are conducted bi-annually (Autumn and Spring sessions) through the central NIT Hamirpur admission portal. Candidates with valid GATE/NET scores or eligible Master's degrees in engineering/technology must apply online, submit research proposals, and appear for a departmental written evaluation and interview.",
    },
    {
      category: "Admissions",
      q: "What are the admission criteria for M.Tech CSE and M.Tech in Artificial Intelligence?",
      a: "Admissions to both M.Tech programmes are conducted through CCMT (Centralized Counselling for M.Tech/M.Arch/M.Plan) based strictly on valid GATE scores in Computer Science and Information Technology (CS) or Data Science & AI (DA). Institutional fellowships of ₹12,400/month are provided to all regular GATE-qualified students as per MoE guidelines.",
    },
    {
      category: "Academics",
      q: "How does the NEP-2020 curriculum benefit undergraduate B.Tech students?",
      a: "The NEP-2020 curriculum offers multidisciplinary flexibility, allowing students to take open electives across other engineering departments, enroll in specialized Minor Degree programs (e.g., Minor in AI, Robotics, Financial Tech), and participate in a mandatory 6-month full-time industry internship in the final semester.",
    },
    {
      category: "Research",
      q: "What computing and GPU infrastructure is available for student research projects?",
      a: "Students have 24/7 access to high-performance computing clusters featuring NVIDIA DGX Station and RTX GPU workstations, OpenStack cloud testbeds, IoT sensor testbeds, biometric iris/fingerprint scanners, and campus-wide high-speed Gigabit LAN connectivity.",
    },
    {
      category: "Research",
      q: "Can undergraduate students participate in sponsored research projects?",
      a: "Yes. Faculty members actively recruit undergraduate and master's students as Student Research Assistants (SRAs) on sponsored projects funded by SERB, DST, MeitY, and DRDO, offering stipends, research exposure, and co-authorship on peer-reviewed SCI publications.",
    },
    {
      category: "Placements",
      q: "What is the placement record of the department?",
      a: "The department consistently achieves a 95%+ placement rate with top recruiters including Google, Microsoft, Amazon, Adobe, Oracle, Qualcomm, Samsung R&D, and Texas Instruments, with the highest compensation package reaching 52 LPA and an average package exceeding 16.5 LPA.",
    },
    {
      category: "Internships",
      q: "How can external students apply for summer internships with department faculty?",
      a: "The department opens summer research internship applications every year in March/April. Interested undergraduate students from recognized institutes can apply through the NIT Hamirpur summer internship portal or email faculty members directly along with their academic transcript and research CV.",
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const qLower = search.toLowerCase();
    const matchesSearch =
      !search ||
      faq.q.toLowerCase().includes(qLower) ||
      faq.a.toLowerCase().includes(qLower);

    const matchesCategory =
      selectedCategory === "ALL" || faq.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-6 bg-white min-h-[85vh] font-sans">
      {/* Title Header */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-[#85261e]" />
              Frequently Asked Questions
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2 py-0.5 rounded uppercase">
              {activeDepartment.code}
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Common inquiries regarding admissions, research facilities, fellowships, and academic guidelines for Department of {activeDepartment.name}.
          </p>
        </div>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="bg-[#fff9f6] border border-[#eedfd8] rounded-xl p-4 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search question or topic (e.g., PhD admissions, fellowships, GPU labs)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#eedfd8] bg-white text-[#33110e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#eedfd8]/80">
          {[
            { id: "ALL", label: "All Questions" },
            { id: "Admissions", label: "Admissions (UG/PG/PhD)" },
            { id: "Academics", label: "NEP-2020 & Curriculum" },
            { id: "Research", label: "Research & GPU Labs" },
            { id: "Placements", label: "Placements & Internships" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#33110e] text-white shadow-xs"
                  : "bg-white border border-[#eedfd8] text-[#33110e] hover:bg-[#eedfd8]/50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-[#eedfd8] bg-white transition shadow-xs hover:border-[#85261e]/40"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between p-5 text-left font-bold text-[#1c110c] transition hover:bg-[#fff9f6] cursor-pointer"
              >
                <span className="flex items-center gap-3 text-xs sm:text-sm">
                  <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-[10px] font-bold px-2 py-0.5 rounded">
                    {faq.category}
                  </span>
                  <span>{faq.q}</span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-[#85261e] transition duration-200 flex-shrink-0 ${
                    isOpen ? "rotate-180 text-[#33110e]" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="border-t border-[#eedfd8] bg-[#fff9f6]/40 px-5 py-4 text-xs sm:text-sm leading-relaxed text-neutral-700">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12 text-neutral-500 text-xs bg-[#fff9f6] rounded-xl border border-[#eedfd8]">
            No matching questions found for your query.
          </div>
        )}
      </div>
    </div>
  );
}
