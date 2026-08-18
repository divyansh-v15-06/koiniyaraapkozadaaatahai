"use client";

import Link from "next/link";
import { ArrowLeft, Mail, Phone, Quote, Building2, Award, BookOpen, GraduationCap, MapPin } from "lucide-react";
import { useDepartment } from "@/context/department-context";
import { DepartmentEmptyState } from "@/components/common/department-empty-state";

export default function HodMessagePage() {
  const { activeDepartment } = useDepartment();
  const hasData = activeDepartment.slug === "cse";

  const hodData = {
    name: "Dr. Siddhartha Chauhan",
    designation: `Head of Department & Associate Professor`,
    department: `Department of ${activeDepartment.name}`,
    image: "/hod.jpg",
    email: "siddhartha@nith.ac.in",
    phone: "+91-1972-254424",
    office: "Room 204, Department of CSE Building, NIT Hamirpur",
    qualifications: "Ph.D. (NIT Hamirpur), M.Tech (CSE), B.Tech (CSE)",
    message: [
      `It is with great pleasure and pride that I welcome you to the Department of ${activeDepartment.name} at National Institute of Technology Hamirpur. Since its establishment, the department has been dedicated to cultivating an environment of intellectual curiosity, rigorous engineering disciplines, and innovative technological contributions.`,
      `In an era characterized by rapid digital transformation, artificial intelligence, cyber-physical systems, and quantum breakthroughs, our curriculum is carefully curated to bridge core theoretical foundations with state-of-the-art technological practices as per NEP-2020.`,
      `I extend my sincere gratitude to our accomplished faculty, hardworking staff, and talented students who continually uphold the highest academic and research standards of NIT Hamirpur. We warmly invite prospective students, academic collaborators, and industry partners to join us in advancing the frontiers of computing sciences.`,
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-6 bg-white min-h-[85vh] font-sans">
      {/* Back button */}
      <div>
        <Link
          href={`/aboutus?dept=${activeDepartment.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#85261e] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to About Us
        </Link>
      </div>

      {!hasData ? (
        <DepartmentEmptyState sectionTitle="HOD Message & Profile" />
      ) : (
        /* Main HOD Message Card */
        <div className="bg-white border border-[#eedfd8] rounded-2xl p-6 sm:p-10 shadow-xs hover:border-[#85261e]/40 transition space-y-6">
          {/* Profile Row */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-[#eedfd8] pb-6">
            <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-2 border-[#eedfd8] shadow-md flex-shrink-0 bg-[#fff9f6]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hodData.image}
                alt={hodData.name}
                className="w-full h-full object-cover"
                onError={(e: any) => {
                  e.target.src = "/17059155995973.jpg";
                }}
              />
            </div>

            <div className="space-y-1.5 text-center sm:text-left flex-1">
              <span className="bg-[#33110e] text-white text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                Head of Department
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1c110c] tracking-tight">
                {hodData.name}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-[#85261e]">
                {hodData.designation}
              </p>
              <p className="text-xs text-neutral-600">
                {hodData.department}
              </p>
              <p className="text-xs text-neutral-500 font-mono">
                {hodData.qualifications}
              </p>

              <div className="pt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-neutral-700">
                <span className="flex items-center gap-1 bg-[#fff9f6] border border-[#eedfd8] px-2.5 py-1 rounded-md">
                  <Mail className="w-3.5 h-3.5 text-[#85261e]" /> {hodData.email}
                </span>
                <span className="flex items-center gap-1 bg-[#fff9f6] border border-[#eedfd8] px-2.5 py-1 rounded-md">
                  <Phone className="w-3.5 h-3.5 text-[#85261e]" /> {hodData.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div className="relative pt-2 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#85261e] tracking-wider">
              <Quote className="w-4 h-4 text-[#85261e]" /> Official Message &amp; Welcome Address
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-neutral-800 leading-relaxed font-normal">
              {hodData.message.map((paragraph, idx) => (
                <p key={idx} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Signature block */}
            <div className="pt-6 border-t border-[#eedfd8]/60 flex flex-col items-end text-right">
              <p className="text-sm font-bold text-[#1c110c]">{hodData.name}</p>
              <p className="text-xs text-[#85261e] font-semibold">{hodData.designation}</p>
              <p className="text-xs text-neutral-500">{hodData.department}</p>
              <p className="text-xs text-neutral-500">National Institute of Technology Hamirpur</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
