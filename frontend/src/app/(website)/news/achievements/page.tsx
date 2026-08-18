"use client";

import { Award, Calendar, ExternalLink, FileText, Sparkles, Trophy } from "lucide-react";
import { MOCK_ACHIEVEMENTS } from "@/lib/mock-data";
import { useDepartment } from "@/context/department-context";

export default function AchievementsPage() {
  const { activeDepartment } = useDepartment();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6 bg-white min-h-[85vh]">
      {/* Title Header */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <Trophy className="w-6 h-6 text-[#85261e]" />
              Department Achievements &amp; Accolades
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2 py-0.5 rounded uppercase">
              {activeDepartment.code}
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-0.5">
            Key international conferences, specialized workshops, faculty honors, and major student milestones organized by Department of {activeDepartment.name}.
          </p>
        </div>
      </div>

      {/* Achievements Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_ACHIEVEMENTS.map((item: any, idx: number) => (
          <div
            key={item.id}
            className="bg-white border border-[#eedfd8] rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-[#85261e]/40 transition flex flex-col justify-between group"
          >
            <div>
              {/* Feature Image */}
              {item.photo_url && (
                <div className="relative w-full h-48 sm:h-52 bg-neutral-100 overflow-hidden border-b border-[#eedfd8]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.photo_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-5 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="bg-[#33110e] text-white text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-neutral-500 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-[#85261e]" /> {item.publish_date}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#1c110c] group-hover:text-[#85261e] transition leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-neutral-700 leading-relaxed line-clamp-4">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Footer / Actions */}
            {item.pdf_url && (
              <div className="p-4 bg-[#fff9f6] border-t border-[#eedfd8] flex justify-end">
                <a
                  href={item.pdf_url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#33110e] text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#85261e] transition flex items-center gap-1.5 shadow-xs"
                >
                  <span>{item.pdf_url.includes("pdf") ? "View Official Brochure" : "Visit Event Portal"}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {MOCK_ACHIEVEMENTS.length === 0 && (
        <div className="text-center py-20 text-neutral-500 text-xs bg-[#fff9f6] rounded-lg border border-[#eedfd8]">
          No achievements recorded for this department yet.
        </div>
      )}
    </div>
  );
}
