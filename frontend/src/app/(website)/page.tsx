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
  GraduationCap,
  Sparkles,
  Users,
  Lightbulb,
  Layers,
} from "lucide-react";
import { useDepartment } from "@/context/department-context";

export default function HomePage() {
  const { activeDepartment, departments, setActiveDepartment } = useDepartment();
  const [activeSlide, setActiveSlide] = useState(0);

  const heroSlides = [
    {
      src: "/nithbg12.jpg",
      title: `Department of ${activeDepartment.name}`,
      subtitle: `National Institute of Technology Hamirpur (HP) • ${activeDepartment.code}`,
    },
    {
      src: "/cseDepartmentPhoto.png",
      title: "Advanced Laboratories & Specialized Research Centers",
      subtitle: "Fostering Innovation, Scientific Research & Hands-on Engineering",
    },
    {
      src: "/17059155995973.jpg",
      title: "Excellence in Technical Education & Industry Collaboration",
      subtitle: "Top-Tier NIRF Ranking, NBA Accreditation, and Outstanding Placements",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <div className="space-y-6 pb-16 bg-[#ffffff]">
      {/* 1. Symmetrical Modern Announcement Bar */}
      <div className="bg-[#fff9f6] border-y border-[#eedfd8] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center h-10 gap-3">
          {/* Symmetrical Left Badge */}
          <div className="flex items-center gap-1.5 bg-[#33110e] text-white px-3 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase flex-shrink-0 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping mr-0.5 inline-block"></span>
            <span>Announcements</span>
            <span className="bg-[#85261e] text-amber-300 text-[10px] px-1.5 py-0.2 rounded font-mono ml-1">
              {activeDepartment.code}
            </span>
          </div>

          {/* Smooth Marquee Scroller with Left/Right Fade Masks */}
          <div className="relative flex-1 overflow-hidden h-full flex items-center">
            {/* Left fade gradient mask */}
            <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#fff9f6] to-transparent z-10 pointer-events-none"></div>

            {/* Marquee Content */}
            <div className="animate-marquee text-xs text-[#33110e] font-medium flex items-center gap-8 cursor-pointer">
              <Link
                href={`/news/announcements?dept=${activeDepartment.slug}`}
                className="flex items-center gap-2 hover:text-[#85261e] transition"
              >
                <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.2 rounded font-bold uppercase">
                  Admissions
                </span>
                <span>Ph.D. Admissions Open for Autumn Session 2026-2027 in Department of {activeDepartment.name}.</span>
              </Link>

              <span className="text-neutral-300">•</span>

              <Link
                href={`/news/announcements?dept=${activeDepartment.slug}`}
                className="flex items-center gap-2 hover:text-[#85261e] transition"
              >
                <span className="bg-[#85261e] text-white text-[10px] px-1.5 py-0.2 rounded font-bold uppercase">
                  Notice
                </span>
                <span>Schedule for Final Year Major Project Demonstrations &amp; Capstone Reviews.</span>
              </Link>

              <span className="text-neutral-300">•</span>

              <Link
                href={`/news/achievements?dept=${activeDepartment.slug}`}
                className="flex items-center gap-2 hover:text-[#85261e] transition"
              >
                <span className="bg-amber-600 text-white text-[10px] px-1.5 py-0.2 rounded font-bold uppercase">
                  Achievement
                </span>
                <span>{activeDepartment.code} Student Team Wins 1st Prize at National Innovation Hackathon!</span>
              </Link>
            </div>

            {/* Right fade gradient mask */}
            <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#fff9f6] to-transparent z-10 pointer-events-none"></div>
          </div>

          {/* Right Action Button for Symmetry */}
          <div className="flex-shrink-0 border-l border-[#eedfd8] pl-3 hidden sm:flex items-center">
            <Link
              href={`/news/announcements?dept=${activeDepartment.slug}`}
              className="text-[11px] font-bold text-[#85261e] hover:text-[#33110e] transition flex items-center gap-1"
            >
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Hero 3-Column Section (Signature tempcse Layout) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left Column: Announcements Box */}
          <div className="lg:col-span-3 bg-white rounded-lg border border-[#eedfd8] shadow-sm flex flex-col overflow-hidden h-[420px]">
            <div className="bg-[#33110e] text-white p-3 text-center font-bold text-xs uppercase tracking-wider">
              {activeDepartment.code} News & Updates
            </div>
            <div className="p-3 divide-y divide-neutral-100 overflow-y-auto no-scrollbar flex-1 space-y-2">
              {MOCK_ANNOUNCEMENTS.map((ann, i) => (
                <div key={ann.id} className="pt-2 first:pt-0">
                  <div className="flex items-center gap-1.5 text-[10px] text-[#85261e] font-semibold mb-1">
                    <Calendar className="w-3 h-3" />
                    <span>{ann.publish_date}</span>
                    {i === 0 && (
                      <span className="bg-red-600 text-white text-[9px] px-1 rounded font-bold">
                        NEW
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-semibold text-neutral-800 line-clamp-2 hover:text-[#33110e] cursor-pointer">
                    {ann.title}
                  </h4>
                  <p className="text-[11px] text-neutral-500 line-clamp-2 mt-1">
                    {ann.body}
                  </p>
                </div>
              ))}
              <div className="pt-2">
                <div className="flex items-center gap-1.5 text-[10px] text-[#85261e] font-semibold mb-1">
                  <Calendar className="w-3 h-3" />
                  <span>2026-04-15</span>
                </div>
                <h4 className="text-xs font-semibold text-neutral-800 line-clamp-2">
                  National Workshop on Emerging Frontiers in {activeDepartment.name}
                </h4>
                <p className="text-[11px] text-neutral-500 line-clamp-2 mt-1">
                  Organized by Department of {activeDepartment.name}, NIT Hamirpur.
                </p>
              </div>
            </div>
            <div className="p-2 bg-[#fff9f6] border-t border-[#eedfd8] text-center">
              <Link
                href={`/news/announcements?dept=${activeDepartment.slug}`}
                className="text-[11px] text-[#33110e] font-bold hover:underline flex items-center justify-center gap-1"
              >
                View All Announcements <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Center Column: Hero Carousel */}
          <div className="lg:col-span-6 rounded-lg overflow-hidden border border-[#eedfd8] relative shadow-sm h-[420px] bg-neutral-900 group">
            {heroSlides.map((slide, idx) => (
              <div
                key={slide.src}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  idx === activeSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <Image
                  src={slide.src}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={idx === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="bg-[#85261e] text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded w-fit mb-2">
                    Department of {activeDepartment.name}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight mb-1">
                    {slide.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-200 line-clamp-2">
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            ))}

            {/* Carousel Indicators */}
            <div className="absolute bottom-3 right-4 z-20 flex gap-1.5">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === activeSlide ? "bg-white w-6" : "bg-white/50"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Research Highlights Box */}
          <div className="lg:col-span-3 bg-white rounded-lg border border-[#eedfd8] shadow-sm flex flex-col overflow-hidden h-[420px]">
            <div className="bg-[#33110e] text-white p-3 text-center font-bold text-xs uppercase tracking-wider">
              Research Highlights
            </div>
            <div className="p-4 space-y-4 overflow-y-auto no-scrollbar flex-1 bg-[#fff9f6]/40">
              <div className="bg-white p-3 rounded border border-[#eedfd8] shadow-xs">
                <div className="flex items-center gap-2 text-[#85261e] font-bold text-xs mb-1">
                  <BookOpen className="w-4 h-4" />
                  <span>110+ Publications</span>
                </div>
                <p className="text-[11px] text-neutral-600">
                  Published in top SCI/Scopus IEEE Transactions, Elsevier Journals & Springer Conferences.
                </p>
              </div>

              <div className="bg-white p-3 rounded border border-[#eedfd8] shadow-xs">
                <div className="flex items-center gap-2 text-[#85261e] font-bold text-xs mb-1">
                  <Lightbulb className="w-4 h-4" />
                  <span>14 Patents Filed & Granted</span>
                </div>
                <p className="text-[11px] text-neutral-600">
                  Intellectual property spanning smart systems, sensors, and computing.
                </p>
              </div>

              <div className="bg-white p-3 rounded border border-[#eedfd8] shadow-xs">
                <div className="flex items-center gap-2 text-[#85261e] font-bold text-xs mb-1">
                  <Award className="w-4 h-4" />
                  <span>₹3.8+ Cr R&D Grants</span>
                </div>
                <p className="text-[11px] text-neutral-600">
                  Sponsored research projects from DST-SERB, MeitY, and SJVN.
                </p>
              </div>
            </div>
            <div className="p-2 bg-[#fff9f6] border-t border-[#eedfd8] text-center">
              <Link
                href={`/research/publications?dept=${activeDepartment.slug}`}
                className="text-[11px] text-[#33110e] font-bold hover:underline flex items-center justify-center gap-1"
              >
                Browse Research Output <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Stats Counters (tempcse signature 4-card metric section) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-4">
        <div className="bg-[#1c110c] text-white rounded-lg p-6 shadow-md border border-[#33110e]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-neutral-800">
            <div className="pt-3 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">
                {MOCK_FACULTY.length}
              </div>
              <p className="text-xs text-neutral-300 uppercase tracking-wider font-semibold mt-1">
                Faculty Members
              </p>
            </div>
            <div className="pt-3 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">
                {MOCK_PUBLICATIONS.length}+
              </div>
              <p className="text-xs text-neutral-300 uppercase tracking-wider font-semibold mt-1">
                Publications
              </p>
            </div>
            <div className="pt-3 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">
                {MOCK_STUDENTS.length}+
              </div>
              <p className="text-xs text-neutral-300 uppercase tracking-wider font-semibold mt-1">
                Enrolled Students
              </p>
            </div>
            <div className="pt-3 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">
                100%
              </div>
              <p className="text-xs text-neutral-300 uppercase tracking-wider font-semibold mt-1">
                Placement Record
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. About Department & HOD Message Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Department Overview */}
          <div className="lg:col-span-8 bg-white rounded-lg border border-[#eedfd8] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#eedfd8] pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#85261e]" />
                <h3 className="text-lg font-bold text-[#33110e] tracking-tight uppercase">
                  Welcome to Department of {activeDepartment.name}
                </h3>
              </div>
              <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2 py-0.5 rounded uppercase">
                {activeDepartment.code}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
              {activeDepartment.about}
            </p>
            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
              We offer comprehensive undergraduate (B.Tech), postgraduate (M.Tech), Dual Degree, and Doctoral (Ph.D.) programmes designed to equip engineers and researchers with strong foundational principles and state-of-the-art applied skills.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-[#fff9f6] rounded border border-[#eedfd8] flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-[#85261e]" />
                <div>
                  <h4 className="text-xs font-bold text-[#33110e]">Academic Programmes</h4>
                  <p className="text-[11px] text-neutral-600">B.Tech, M.Tech & Ph.D.</p>
                </div>
              </div>
              <div className="p-3 bg-[#fff9f6] rounded border border-[#eedfd8] flex items-center gap-3">
                <Users className="w-6 h-6 text-[#85261e]" />
                <div>
                  <h4 className="text-xs font-bold text-[#33110e]">Faculty Expertise</h4>
                  <p className="text-[11px] text-neutral-600">Renowned Professors & Researchers</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={`/aboutus?dept=${activeDepartment.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#33110e] hover:text-[#85261e]"
              >
                Read More About Department <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* HOD Message Card */}
          <div className="lg:col-span-4 bg-[#fff9f6] rounded-lg border border-[#eedfd8] p-5 shadow-sm space-y-4 text-center">
            <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden border-3 border-[#85261e] shadow-sm">
              <Image
                src="/hod.jpg"
                alt="Head of Department"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#33110e]">
                {activeDepartment.hod_name}
              </h4>
              <p className="text-xs text-[#85261e] font-semibold">
                Head of Department, {activeDepartment.code}
              </p>
            </div>
            <p className="text-xs text-neutral-600 italic leading-relaxed">
              &quot;Our mission is to nurture technical acumen, ethics, and innovation so our students can lead global technology transformations and solve critical societal problems.&quot;
            </p>
            <Link
              href={`/aboutus/hod?dept=${activeDepartment.slug}`}
              className="inline-block bg-[#33110e] text-white text-xs font-semibold px-4 py-1.5 rounded hover:bg-[#85261e] transition shadow-xs"
            >
              Read Full Message
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
