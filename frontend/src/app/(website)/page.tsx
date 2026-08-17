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
  ExternalLink,
  GraduationCap,
  Sparkles,
  Users,
  FileText,
  Lightbulb,
} from "lucide-react";

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);

  const heroSlides = [
    {
      src: "/nithbg12.jpg",
      title: "Department of Computer Science & Engineering",
      subtitle: "National Institute of Technology Hamirpur (HP)",
    },
    {
      src: "/cseDepartmentPhoto.png",
      title: "Advanced Research Laboratories & Computing Clusters",
      subtitle: "Fostering Innovation, AI/ML, High-Performance Systems & Cyber Security",
    },
    {
      src: "/17059155995973.jpg",
      title: "Excellence in Technical Education & Research",
      subtitle: "Top-Tier NIRF Ranking, NBA Accreditation, and 100% Core Placements",
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
      {/* 1. Announcement Ticker (Signature tempcse Ribbon Style) */}
      <div className="flex items-center bg-[#fff9f6] border-y border-[#eedfd8] overflow-hidden">
        <div className="bg-[#1c110c] text-white py-2 px-5 font-semibold text-xs tracking-wider relative flex-shrink-0 flex items-center gap-2">
          <span>Announcements</span>
          <div className="absolute top-0 right-0 w-0 h-0 border-l-[16px] border-l-transparent border-t-[16px] border-t-[#fff9f6]"></div>
          <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[16px] border-l-transparent border-b-[16px] border-b-[#fff9f6]"></div>
        </div>
        <div className="flex-1 overflow-hidden py-1.5 px-3">
          <div className="animate-marquee text-xs text-[#33110e] font-medium flex items-center gap-8">
            <span className="flex items-center gap-2">
              <span className="inline-block bg-red-600 text-white text-[10px] px-1.5 py-0.2 rounded font-bold uppercase animate-pulse">
                New
              </span>
              Ph.D. Admissions Open for Autumn Session 2026-2027 — Applications close June 20, 2026.
            </span>
            <span className="text-neutral-400">|</span>
            <span className="flex items-center gap-2">
              <span className="inline-block bg-red-600 text-white text-[10px] px-1.5 py-0.2 rounded font-bold uppercase">
                Notice
              </span>
              Schedule for B.Tech CSE Final Year Major Project Demonstrations (May 28–30).
            </span>
            <span className="text-neutral-400">|</span>
            <span className="flex items-center gap-2">
              <span className="inline-block bg-amber-600 text-white text-[10px] px-1.5 py-0.2 rounded font-bold uppercase">
                Achievement
              </span>
              CSE Student Team Wins 1st Prize at Smart India Hackathon (Hardware Edition)!
            </span>
          </div>
        </div>
      </div>

      {/* 2. Hero 3-Column Section (Signature tempcse Layout) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left Column: Announcements Box */}
          <div className="lg:col-span-3 bg-white rounded-lg border border-[#eedfd8] shadow-sm flex flex-col overflow-hidden h-[420px]">
            <div className="bg-[#33110e] text-white p-3 text-center font-bold text-xs uppercase tracking-wider">
              News & Updates
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
                  Call for Papers: IEEE International Conference on Computing Networks & AI
                </h4>
                <p className="text-[11px] text-neutral-500 line-clamp-2 mt-1">
                  Hosted by CSE Department, NIT Hamirpur. Authors are invited to submit original research manuscripts.
                </p>
              </div>
            </div>
            <div className="p-2 bg-[#fff9f6] border-t border-[#eedfd8] text-center">
              <Link
                href="/news/announcements"
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
                    Department of CSE
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
                  Published in top SCI/Scopus IEEE Transactions, ACM Journals & Springer Conferences.
                </p>
              </div>

              <div className="bg-white p-3 rounded border border-[#eedfd8] shadow-xs">
                <div className="flex items-center gap-2 text-[#85261e] font-bold text-xs mb-1">
                  <Lightbulb className="w-4 h-4" />
                  <span>14 Patents Filed & Granted</span>
                </div>
                <p className="text-[11px] text-neutral-600">
                  Intellectual property spanning healthcare IoT, edge AI, and cryptography.
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
                href="/research/publications"
                className="text-[11px] text-[#33110e] font-bold hover:underline flex items-center justify-center gap-1"
              >
                Browse Research Output <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CSE Stats Counters (tempcse signature 4-card metric section) */}
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

      {/* 4. About Us & HOD Message Section (tempcse signature side-by-side) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Department Overview */}
          <div className="lg:col-span-8 bg-white rounded-lg border border-[#eedfd8] p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-[#eedfd8] pb-3">
              <Building2 className="w-5 h-5 text-[#85261e]" />
              <h3 className="text-lg font-bold text-[#33110e] tracking-tight uppercase">
                Welcome to Department of CSE
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
              The Department of Computer Science & Engineering at National Institute of Technology Hamirpur was established to provide cutting-edge education and foster high-impact research in computing technologies.
            </p>
            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
              We offer comprehensive undergraduate (B.Tech in CSE), postgraduate (M.Tech in CSE and Artificial Intelligence), Dual Degree, and Doctoral (Ph.D.) programmes designed to equip engineers with theoretical foundations and modern applied skills.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-[#fff9f6] rounded border border-[#eedfd8] flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-[#85261e]" />
                <div>
                  <h4 className="text-xs font-bold text-[#33110e]">Academic Programmes</h4>
                  <p className="text-[11px] text-neutral-600">B.Tech, M.Tech, Dual Degree & Ph.D.</p>
                </div>
              </div>
              <div className="p-3 bg-[#fff9f6] rounded border border-[#eedfd8] flex items-center gap-3">
                <Users className="w-6 h-6 text-[#85261e]" />
                <div>
                  <h4 className="text-xs font-bold text-[#33110e]">Expert Faculty</h4>
                  <p className="text-[11px] text-neutral-600">26 Renowned Professors & Researchers</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/aboutus"
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
                Dr. Naveen Chauhan
              </h4>
              <p className="text-xs text-[#85261e] font-semibold">
                Head of Department, CSE
              </p>
            </div>
            <p className="text-xs text-neutral-600 italic leading-relaxed">
              &quot;Our mission is to nurture technical acumen, ethics, and innovation so our students can lead global technology transformations and solve critical societal problems.&quot;
            </p>
            <Link
              href="/aboutus/hod"
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
