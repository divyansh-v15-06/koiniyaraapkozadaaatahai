"use client";

import { Calendar, Users, MapPin, Sparkles } from "lucide-react";
import { MOCK_EVENTS } from "@/lib/mock-data";
import { useDepartment } from "@/context/department-context";
import { DepartmentEmptyState } from "@/components/common/department-empty-state";

export default function EventsPage() {
  const { activeDepartment } = useDepartment();
  const hasData = activeDepartment.slug === "cse";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6 bg-white min-h-[85vh] font-sans">
      {/* Title Header */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#85261e]" />
              Conferences, STCs, FDPs &amp; Workshops
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2 py-0.5 rounded uppercase">
              {activeDepartment.code}
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Academic conferences, short-term courses, and faculty development programmes organized by Department of {activeDepartment.name}.
          </p>
        </div>
      </div>

      {!hasData ? (
        <DepartmentEmptyState sectionTitle="Academic Event Records" />
      ) : (
        <div className="space-y-4">
          {MOCK_EVENTS.map((ev: any, i: number) => (
            <div
              key={ev.id || i}
              className="rounded-2xl border border-[#eedfd8] bg-white p-6 shadow-xs transition hover:border-[#85261e]/40 hover:shadow-md space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] px-2.5 py-0.5 text-xs font-bold rounded">
                  {ev.event_type || ev.category}
                </span>
                <span className="text-xs text-neutral-500 font-semibold flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-[#85261e]" />{" "}
                  {ev.start_date ? `${ev.start_date} – ${ev.end_date}` : ev.year || "2024-2025"}
                </span>
              </div>

              <h3 className="text-[#1c110c] font-bold text-base leading-snug">{ev.title}</h3>

              <div className="grid gap-2 sm:grid-cols-3 border-t border-[#eedfd8]/60 pt-3 text-xs text-neutral-600">
                {ev.venue && (
                  <span className="flex items-center gap-1.5 truncate">
                    <MapPin className="h-3.5 w-3.5 text-[#85261e]" /> Venue: <strong className="text-[#1c110c]">{ev.venue}</strong>
                  </span>
                )}
                {(ev.coordinator || ev.convenor) && (
                  <span className="flex items-center gap-1.5 truncate">
                    <Users className="h-3.5 w-3.5 text-[#85261e]" /> Organizers: <strong className="text-[#1c110c]">{ev.coordinator || ev.convenor}</strong>
                  </span>
                )}
                {ev.sponsoring_agency && (
                  <span className="truncate">
                    Sponsor: <strong>{ev.sponsoring_agency}</strong>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
