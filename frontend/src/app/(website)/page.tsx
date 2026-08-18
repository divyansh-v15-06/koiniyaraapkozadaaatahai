"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  MOCK_FACULTY,
  MOCK_PUBLICATIONS,
  MOCK_PATENTS,
  MOCK_PROJECTS,
  MOCK_STUDENTS,
  MOCK_ANNOUNCEMENTS,
} from "@/lib/mock-data";
import {
  Award,
  BookOpen,
  Building2,
  Calendar,
  ChevronRight,
  ChevronDown,
  GraduationCap,
  Sparkles,
  Users,
  Lightbulb,
  Layers,
  MapPin,
  ArrowRight,
  ExternalLink,
  Compass,
  Trophy,
  Landmark,
  Briefcase,
  Globe,
  Flame,
  CheckCircle2,
  TrendingUp,
  Zap,
  Cpu,
  Atom,
  ShieldCheck,
  UserCheck,
  Binary,
  Scroll,
  FolderGit2,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);

  // Parallax Scroll Listener with requestAnimationFrame
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Parallax transforms
  const heroImageTranslate = scrollY * 0.4;
  const heroImageScale = 1 + scrollY * 0.0003;
  const heroContentOpacity = Math.max(0, 1 - scrollY / 550);
  const heroContentTranslate = scrollY * 0.15;

  // Collective Pan-Institute Metric Cards (Light Warm Theme)
  const collectiveStats = [
    {
      id: "faculty",
      label: "Total Faculty Members",
      value: "240+",
      sublabel: "Across all 14 Academic Departments",
      icon: Users,
      iconColor: "text-[#85261e]",
      bgColor: "bg-[#fff9f6]",
      borderColor: "border-[#eedfd8]",
    },
    {
      id: "staff",
      label: "Technical & Admin Staff",
      value: "185+",
      sublabel: "Specialized Lab Engineers & Officers",
      icon: UserCheck,
      iconColor: "text-emerald-700",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
    {
      id: "ug",
      label: "Undergraduate Students",
      value: "3,850+",
      sublabel: "Enrolled in B.Tech & B.Arch Programmes",
      icon: GraduationCap,
      iconColor: "text-sky-700",
      bgColor: "bg-sky-50",
      borderColor: "border-sky-200",
    },
    {
      id: "pg",
      label: "Postgraduate Students",
      value: "1,120+",
      sublabel: "M.Tech, M.Arch, M.Sc & MBA Scholars",
      icon: Award,
      iconColor: "text-rose-700",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200",
    },
    {
      id: "phd",
      label: "Pursuing Ph.D. Scholars",
      value: "680+",
      sublabel: "Active Full-time Doctoral Researchers",
      icon: Sparkles,
      iconColor: "text-purple-700",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      id: "publications",
      label: "Scholarly Publications",
      value: "2,450+",
      sublabel: "Scopus, SCI & IEEE Indexed Articles",
      icon: BookOpen,
      iconColor: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    {
      id: "patents",
      label: "Patents Filed & Granted",
      value: "75+",
      sublabel: "National & International IPR Grants",
      icon: Lightbulb,
      iconColor: "text-amber-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    {
      id: "projects",
      label: "Sponsored Ongoing Projects",
      value: "65+",
      sublabel: "Funded by MeitY, SERB, DRDO, DST & SJVN",
      icon: FolderGit2,
      iconColor: "text-teal-700",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200",
    },
  ];

  return (
    <div className="space-y-0 bg-[#ffffff] font-sans text-neutral-900 overflow-hidden">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION WITH HIGH-IMPACT PARALLAX BACKGROUND (MAIN GATE PHOTO)    */}
      {/* ========================================================================= */}
      <section className="relative h-[92vh] min-h-[620px] w-full overflow-hidden bg-neutral-950 flex items-center justify-center">
        {/* Parallax Background Image Container */}
        <div
          className="absolute inset-0 will-change-transform pointer-events-none"
          style={{
            transform: `translate3d(0, ${heroImageTranslate}px, 0) scale(${heroImageScale})`,
          }}
        >
          {/* Main Gate Official Campus Photograph */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/nith_main_gate.png"
            alt="National Institute of Technology Hamirpur Main Entrance Gate"
            className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.05]"
          />
          {/* Dramatic Gradient Overlays for Readability & Depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/30" />
          <div className="absolute inset-0 bg-[#33110e]/30 mix-blend-multiply" />
        </div>

        {/* Hero Foreground Content */}
        <div
          className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 text-center text-white space-y-6 will-change-transform"
          style={{
            opacity: heroContentOpacity,
            transform: `translate3d(0, ${heroContentTranslate}px, 0)`,
          }}
        >
          {/* Institutional Crest & Accreditations Badge */}
          <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/25 px-4 py-1.5 rounded-full shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-amber-300">
              An Institute of National Importance
            </span>
            <span className="text-white/40 hidden sm:inline">•</span>
            <span className="text-[11px] sm:text-xs font-semibold text-white/90 hidden sm:inline">
              Est. 1986 • MoE, Govt. of India
            </span>
          </div>

          {/* Dual-Language Institutional Headline */}
          <div className="space-y-2">
            <p className="text-sm sm:text-lg md:text-xl font-bold tracking-wide text-neutral-200 drop-shadow-md">
              राष्ट्रीय प्रौद्योगिकी संस्थान हमीरपुर
            </p>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white drop-shadow-2xl leading-[1.1]">
              National Institute of Technology{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-white">
                Hamirpur
              </span>
            </h1>
            <p className="text-xs sm:text-base md:text-lg text-neutral-300 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-md pt-1">
              Fostering excellence in technical education, transformative research, and innovation in the scenic foothills of the Himalayan Dhauladhar ranges.
            </p>
          </div>

          {/* Floating Scroll Indicator */}
          <div className="pt-8 animate-bounce flex items-center justify-center gap-1.5 text-xs text-neutral-300 font-medium">
            <span>Scroll to Explore Institute Data</span>
            <ChevronDown className="w-4 h-4 text-amber-300" />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. INSTITUTE ANNOUNCEMENTS & NEWS TICKER BAR                              */}
      {/* ========================================================================= */}
      <div className="bg-[#fff9f6] border-y border-[#eedfd8] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center h-11 gap-3">
          <div className="flex items-center gap-1.5 bg-[#33110e] text-white px-3 py-1 rounded-lg text-[11px] font-bold tracking-wider uppercase flex-shrink-0 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping mr-0.5 inline-block" />
            <span>NITH Bulletins</span>
          </div>

          <div className="relative flex-1 overflow-hidden h-full flex items-center">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#fff9f6] to-transparent z-10 pointer-events-none" />
            <div className="animate-marquee text-xs text-[#33110e] font-medium flex items-center gap-8 cursor-pointer">
              <Link
                href="/news/announcements"
                className="flex items-center gap-2 hover:text-[#85261e] transition"
              >
                <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">
                  Admissions
                </span>
                <span>Ph.D. &amp; M.Tech Admissions Open for Autumn Session 2026-2027 at NIT Hamirpur.</span>
              </Link>
              <span className="text-neutral-300">•</span>
              <Link
                href="/news/announcements"
                className="flex items-center gap-2 hover:text-[#85261e] transition"
              >
                <span className="bg-[#85261e] text-white text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">
                  Notice
                </span>
                <span>Annual Convocation 2026 Registration &amp; Gold Medalist Merit List Published.</span>
              </Link>
              <span className="text-neutral-300">•</span>
              <Link
                href="/news/achievements"
                className="flex items-center gap-2 hover:text-[#85261e] transition"
              >
                <span className="bg-amber-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">
                  Accolade
                </span>
                <span>NIT Hamirpur Ranks Among Top Tier Engineering Institutions in India in NIRF 2025!</span>
              </Link>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#fff9f6] to-transparent z-10 pointer-events-none" />
          </div>

          <div className="flex-shrink-0 border-l border-[#eedfd8] pl-3 hidden sm:flex items-center">
            <Link
              href="/news/announcements"
              className="text-[11px] font-bold text-[#85261e] hover:text-[#33110e] transition flex items-center gap-1"
            >
              All Bulletins <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. GRAND PAN-INSTITUTE COLLECTIVE STATS BANNER                            */}
      {/* ========================================================================= */}
      <section className="bg-[#fff9f6] text-[#1c110c] py-16 px-4 sm:px-8 border-b border-[#eedfd8] relative">
        <div className="max-w-7xl mx-auto space-y-10 relative z-10">
          {/* Section Header */}
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 bg-white text-[#85261e] border border-[#eedfd8] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#85261e]" />
              Pan-Institute Collective Strength
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#33110e] tracking-tight">
              NIT Hamirpur at a Glance
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Consolidated strength and research outputs across all 14 academic departments, specialized laboratories, and doctoral centers.
            </p>
          </div>

          {/* 8-Card Symmetrical Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {collectiveStats.map((stat) => {
              const IconComp = stat.icon;
              return (
                <div
                  key={stat.id}
                  className="rounded-3xl border border-[#eedfd8] bg-white p-5 sm:p-6 shadow-xs hover:shadow-xl hover:border-[#85261e]/50 transition-all duration-200 flex flex-col justify-between space-y-4 group"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-11 h-11 rounded-2xl ${stat.bgColor} border ${stat.borderColor} flex items-center justify-center ${stat.iconColor} shadow-2xs group-hover:scale-110 transition duration-200`}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold">
                      Total
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[#85261e] tracking-tight group-hover:text-[#33110e] transition">
                      {stat.value}
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-[#1c110c] leading-snug">
                      {stat.label}
                    </h3>
                    <p className="text-[11px] text-neutral-500 leading-relaxed pt-0.5">
                      {stat.sublabel}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ABOUT NIT HAMIRPUR & HIMALAYAN SANCTUARY (PLACED DIRECTLY AFTER STATS) */}
      {/* ========================================================================= */}
      <section className="bg-white py-16 px-4 sm:px-8 border-b border-[#eedfd8]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                About The Institute
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#33110e] tracking-tight leading-tight">
                A Himalayan Sanctuary for Engineering &amp; Scientific Discovery
              </h2>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed text-justify">
                National Institute of Technology Hamirpur (NIT Hamirpur) is a premier national technical institution established in 1986 in the picturesque hills of Himachal Pradesh. Spread over 320 acres of lush pine forests against the snow-clad Dhauladhar mountain backdrop, the campus offers an unmatched natural environment for intellectual inquiry, technical rigor, and holistic student development.
              </p>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed text-justify">
                With 14 academic departments, advanced supercomputing clusters, central library housing over 1,00,000 volumes, modern residential facilities, and vibrant student societies, NIT Hamirpur continues to lead in engineering education and technology innovation.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-[#fff9f6] rounded-xl border border-[#eedfd8] flex items-center gap-2.5">
                  <Landmark className="w-5 h-5 text-[#85261e]" />
                  <div>
                    <h4 className="text-xs font-bold text-[#33110e]">Central Library</h4>
                    <p className="text-[11px] text-neutral-600">100,000+ Volumes &amp; IEEE Xplore</p>
                  </div>
                </div>

                <div className="p-3 bg-[#fff9f6] rounded-xl border border-[#eedfd8] flex items-center gap-2.5">
                  <Globe className="w-5 h-5 text-[#85261e]" />
                  <div>
                    <h4 className="text-xs font-bold text-[#33110e]">Global Alumni</h4>
                    <p className="text-[11px] text-neutral-600">Leading Silicon Valley &amp; Academia</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative rounded-3xl overflow-hidden border border-[#eedfd8] shadow-2xl h-[420px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/nithbg12.jpg"
                alt="NIT Hamirpur Campus"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <span className="bg-[#85261e] text-white text-[10px] uppercase font-bold px-2.5 py-0.5 rounded w-fit mb-1">
                  Hamirpur, Himachal Pradesh
                </span>
                <h3 className="text-lg font-bold">Panoramic Campus Overlooking Dhauladhar Himalayas</h3>
                <p className="text-xs text-neutral-300">Clean pine-wooded air, modern academic complexes, and world-class athletic facilities.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CAMPUS LIFE, TECHFEST & STUDENT SOCIETIES                              */}
      {/* ========================================================================= */}
      <section className="bg-[#fff9f6] py-16 px-4 sm:px-8 border-b border-[#eedfd8]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="bg-white text-[#85261e] border border-[#eedfd8] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs">
              Student Life
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#33110e] tracking-tight">
              Vibrant Campus Life &amp; National Festivals
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600">
              Beyond academics, NIT Hamirpur boasts a rich student culture with annual technical &amp; cultural festivals, robotics clubs, and sports tournaments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. NIMBUS Techfest Card */}
            <div className="relative rounded-3xl overflow-hidden border border-[#eedfd8] min-h-[300px] flex flex-col justify-end p-6 shadow-md hover:shadow-2xl transition-all duration-300 group">
              {/* Background Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/17059155995973.jpg"
                alt="NIMBUS Technical Festival at NIT Hamirpur"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/25 group-hover:from-black/98 group-hover:via-black/70 transition-colors" />

              {/* Content */}
              <div className="relative z-10 space-y-2">
                <span className="inline-block bg-[#85261e] text-white text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                  Annual Tech Fest
                </span>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition">
                  NIMBUS • Technical Extravaganza
                </h3>
                <p className="text-xs text-neutral-200 leading-relaxed line-clamp-3">
                  One of North India&apos;s largest annual technical festivals featuring autonomous robotics, drone racing, national AI hackathons, and design conclaves.
                </p>
              </div>
            </div>

            {/* 2. HILLFFAIR Cultural Conclave Card */}
            <div className="relative rounded-3xl overflow-hidden border border-[#eedfd8] min-h-[300px] flex flex-col justify-end p-6 shadow-md hover:shadow-2xl transition-all duration-300 group">
              {/* Background Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/17065024504226.jpg"
                alt="HILLFFAIR Cultural Festival at NIT Hamirpur"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/25 group-hover:from-black/98 group-hover:via-black/70 transition-colors" />

              {/* Content */}
              <div className="relative z-10 space-y-2">
                <span className="inline-block bg-[#85261e] text-white text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                  Annual Cultural Conclave
                </span>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition">
                  HILLFFAIR • Cultural Conclave
                </h3>
                <p className="text-xs text-neutral-200 leading-relaxed line-clamp-3">
                  A 3-day high-energy celebration of folk dance, fashion, music bands, theatrical drama, and celebrity concerts amidst the Himalayan breeze.
                </p>
              </div>
            </div>

            {/* 3. Trekking, Sports & Student Clubs Card */}
            <div className="relative rounded-3xl overflow-hidden border border-[#eedfd8] min-h-[300px] flex flex-col justify-end p-6 shadow-md hover:shadow-2xl transition-all duration-300 group">
              {/* Background Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/17072126181122.jpg"
                alt="Student Clubs and Sports at NIT Hamirpur"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/25 group-hover:from-black/98 group-hover:via-black/70 transition-colors" />

              {/* Content */}
              <div className="relative z-10 space-y-2">
                <span className="inline-block bg-[#85261e] text-white text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                  Clubs &amp; Sports
                </span>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition">
                  Trekking, Sports &amp; Student Societies
                </h3>
                <p className="text-xs text-neutral-200 leading-relaxed line-clamp-3">
                  High-altitude Himalayan trekking expeditions, open-source developers clubs, robotics labs, photography guild, and national inter-NIT sports championships.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. NATIONAL IMPACT & GLOBAL FOOTPRINT (SHIFTED TO THE LAST)               */}
      {/* ========================================================================= */}
      <section className="bg-white py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Institute Hallmarks
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#33110e] tracking-tight">
              National Impact &amp; Global Footprint
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600">
              Transformative research, industry patents, international collaborations, and premier engineering leadership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#fff9f6] border border-[#eedfd8] rounded-3xl p-6 space-y-4 hover:shadow-xl hover:border-[#85261e]/40 transition">
              <div className="w-12 h-12 rounded-2xl bg-[#85261e] flex items-center justify-center text-white shadow-md">
                <Lightbulb className="w-6 h-6 text-amber-300" />
              </div>
              <h3 className="text-lg font-bold text-[#1c110c]">Innovation &amp; Intellectual Property</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                75+ patents filed and granted across AI edge architectures, healthcare telemetry, wireless mesh protocols, and smart systems with dedicated incubation support.
              </p>
              <Link
                href="/research/patents"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#85261e] hover:text-[#33110e] transition"
              >
                <span>Explore Patents</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-[#fff9f6] border border-[#eedfd8] rounded-3xl p-6 space-y-4 hover:shadow-xl hover:border-[#85261e]/40 transition">
              <div className="w-12 h-12 rounded-2xl bg-[#85261e] flex items-center justify-center text-white shadow-md">
                <Briefcase className="w-6 h-6 text-amber-300" />
              </div>
              <h3 className="text-lg font-bold text-[#1c110c]">Sponsored Grants &amp; Industry R&amp;D</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                65+ active research grants worth ₹15+ Crores from MeitY, DST-SERB, DRDO, and corporate partners for national critical cyber infrastructure and clean energy.
              </p>
              <Link
                href="/research/projects"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#85261e] hover:text-[#33110e] transition"
              >
                <span>Browse Research Grants</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-[#fff9f6] border border-[#eedfd8] rounded-3xl p-6 space-y-4 hover:shadow-xl hover:border-[#85261e]/40 transition">
              <div className="w-12 h-12 rounded-2xl bg-[#85261e] flex items-center justify-center text-white shadow-md">
                <Trophy className="w-6 h-6 text-amber-300" />
              </div>
              <h3 className="text-lg font-bold text-[#1c110c]">Industry Recruitment &amp; Placements</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Global leaders including Google, Microsoft, Amazon, Texas Instruments, and Qualcomm actively recruit top graduating engineering minds from NIT Hamirpur.
              </p>
              <Link
                href="/placementpage"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#85261e] hover:text-[#33110e] transition"
              >
                <span>View Placement Record</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
