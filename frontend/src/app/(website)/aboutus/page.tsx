"use client";

import Link from "next/link";
import {
  Building2,
  Target,
  Eye,
  Award,
  Users,
  BookOpen,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  ArrowRight,
  HelpCircle,
  Clock,
  Flame,
} from "lucide-react";
import { useDepartment } from "@/context/department-context";
import { DepartmentEmptyState } from "@/components/common/department-empty-state";

export default function AboutUsPage() {
  const { activeDepartment } = useDepartment();
  const hasData = activeDepartment.slug === "cse";

  const metrics = [
    { label: "Established Faculty", value: "26+", sub: "Doctoral & Postdoc Mentors" },
    { label: "Enrolled Students", value: "600+", sub: "UG, PG & Dual Degree" },
    { label: "Doctoral Scholars", value: "105+", sub: "Active Ph.D. Researchers" },
    { label: "Specialized Labs", value: "12", sub: "GPU & Cloud Infrastructure" },
  ];

  const quickNav = [
    {
      title: "HOD Message",
      href: "/aboutus/hod",
      desc: "Read the official address from the Head of Department on vision and goals.",
      icon: Users,
      badge: "Leadership",
    },
    {
      title: "Specialized Laboratories",
      href: "/aboutus/labs",
      desc: "Explore 12 state-of-the-art research facilities, GPU clusters, and servers.",
      icon: Cpu,
      badge: "Infrastructure",
    },
    {
      title: "Academic Programmes",
      href: "/academics/programsoffered",
      desc: "Comprehensive NEP-2020 curriculum for B.Tech, M.Tech, Dual Degree & Ph.D.",
      icon: GraduationCap,
      badge: "Academics",
    },
    {
      title: "Frequently Asked Questions",
      href: "/aboutus/faq",
      desc: "Common queries regarding admissions, fellowships, coursework, and placements.",
      icon: HelpCircle,
      badge: "Help & FAQ",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 bg-white min-h-[85vh] font-sans">
      {/* Title Header */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <Building2 className="w-6 h-6 text-[#85261e]" />
              About Department
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2 py-0.5 rounded uppercase">
              {activeDepartment.code}
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Department of {activeDepartment.name}, National Institute of Technology Hamirpur (Himachal Pradesh).
          </p>
        </div>
      </div>

      {!hasData ? (
        <DepartmentEmptyState sectionTitle="Department Overview" />
      ) : (
        <>
          {/* Hero Overview */}
          <div className="bg-[#fff9f6] border border-[#eedfd8] rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#33110e] text-white text-xs font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                Department Overview
              </span>
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-2.5 py-0.5 rounded">
                NBA Accredited &amp; NIRF Top Tier
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1c110c] leading-snug">
              Pioneering Excellence in Computing Sciences, Technological Innovation &amp; Research
            </h2>

            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
              The Department of {activeDepartment.name} at NIT Hamirpur was established to impart world-class education, advance high-impact scientific research, and produce visionary engineers equipped to solve complex national and global technological challenges.
            </p>
            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
              Our faculty and scholars conduct cutting-edge research in Artificial Intelligence, Machine Learning, Cyber Security, Blockchain, Quantum Computing, IoT, High Performance Computing, and Software Engineering, supported by funding from premier agencies including SERB, DST, MeitY, and DRDO.
            </p>

            {/* Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#eedfd8]">
              {metrics.map((m, idx) => (
                <div key={idx} className="bg-white border border-[#eedfd8] rounded-xl p-3.5 text-center shadow-2xs">
                  <span className="text-xl sm:text-2xl font-extrabold text-[#33110e]">{m.value}</span>
                  <p className="text-xs font-bold text-[#85261e] uppercase mt-0.5">{m.label}</p>
                  <p className="text-[10px] text-neutral-500">{m.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Vision & Mission Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Vision Card */}
            <div className="bg-white border border-[#eedfd8] rounded-2xl p-6 shadow-xs hover:border-[#85261e]/40 transition space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#fff9f6] border border-[#eedfd8] flex items-center justify-center text-[#85261e]">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#85261e] tracking-wider">Strategic Intent</span>
                  <h3 className="text-lg font-bold text-[#1c110c]">Department Vision</h3>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed pt-1">
                To become a premier center of excellence in computer science education and multidisciplinary research, producing globally competent, innovative, and ethically grounded professionals who contribute meaningfully to technological advancement and societal well-being.
              </p>
            </div>

            {/* Mission Card */}
            <div className="bg-white border border-[#eedfd8] rounded-2xl p-6 shadow-xs hover:border-[#85261e]/40 transition space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#fff9f6] border border-[#eedfd8] flex items-center justify-center text-[#85261e]">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#85261e] tracking-wider">Core Purpose</span>
                  <h3 className="text-lg font-bold text-[#1c110c]">Department Mission</h3>
                </div>
              </div>
              <div className="space-y-2 text-xs sm:text-sm text-neutral-700 pt-1">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#85261e] flex-shrink-0 mt-0.5" />
                  <span>Deliver rigorous undergraduate, postgraduate, and doctoral curricula aligned with global industry benchmarks and NEP-2020.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#85261e] flex-shrink-0 mt-0.5" />
                  <span>Foster an environment of innovative inquiry, collaborative sponsored research, and intellectual property creation.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#85261e] flex-shrink-0 mt-0.5" />
                  <span>Cultivate ethical leadership, professional integrity, and continuous lifelong learning among graduates.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Navigation Sections */}
          <div>
            <div className="mb-4">
              <span className="text-xs font-bold uppercase text-[#85261e] tracking-wider">Explore Department</span>
              <h2 className="text-xl font-bold text-[#1c110c]">Key Sections &amp; Resources</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quickNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="bg-white border border-[#eedfd8] rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-[#85261e] transition group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#fff9f6] border border-[#eedfd8] flex items-center justify-center text-[#33110e] group-hover:bg-[#33110e] group-hover:text-white transition">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-[10px] font-bold px-2 py-0.5 rounded">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#1c110c] group-hover:text-[#85261e] transition">
                      {item.title}
                    </h3>
                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-4 flex items-center gap-1 text-xs font-bold text-[#85261e] group-hover:translate-x-1 transition duration-150">
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
