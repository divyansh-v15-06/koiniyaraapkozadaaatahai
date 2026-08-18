"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Trash2,
  Calendar,
  X,
  Search,
  CheckCircle2,
  Building2,
  Sparkles,
  Users,
  Presentation,
  Clock,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { MOCK_FACULTY, MOCK_EVENTS } from "@/lib/mock-data";

export default function FacultyEventsPage() {
  const [user, setUser] = useState<any>(null);
  const [faculty, setFaculty] = useState<any>(MOCK_FACULTY[0]);
  const [events, setEvents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState("E-STC");
  const [category, setCategory] = useState("organized");
  const [venue, setVenue] = useState("NIT Hamirpur");
  const [agency, setAgency] = useState("NIT Hamirpur");
  const [startDate, setStartDate] = useState("2024-07-01");
  const [endDate, setEndDate] = useState("2024-07-05");
  const [convenor, setConvenor] = useState("");
  const [coordinator, setCoordinator] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("auth_user");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setUser(parsed);
        const match = MOCK_FACULTY.find(
          (f) =>
            f.employee_code?.toLowerCase() === parsed.employee_code?.toLowerCase() ||
            f.email?.toLowerCase() === parsed.email?.toLowerCase() ||
            f.id === parsed.faculty_id
        );
        if (match) {
          setFaculty(match);
          const lastName = match.full_name.toLowerCase().split(" ").pop() || "";
          const userEvents = MOCK_EVENTS.filter((e: any) => {
            if (e.faculty_ids && e.faculty_ids.includes(match.id)) return true;
            if (e.convenor && e.convenor.toLowerCase().includes(lastName)) return true;
            if (e.coordinator && e.coordinator.toLowerCase().includes(lastName)) return true;
            return false;
          });
          setEvents(userEvents.length > 0 ? userEvents : MOCK_EVENTS);
        }
      } catch {}
    } else {
      setEvents(MOCK_EVENTS);
    }
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        e.title.toLowerCase().includes(q) ||
        (e.venue && e.venue.toLowerCase().includes(q)) ||
        (e.convenor && e.convenor.toLowerCase().includes(q)) ||
        (e.coordinator && e.coordinator.toLowerCase().includes(q));

      const matchesCategory =
        categoryFilter === "ALL" || e.category.toLowerCase() === categoryFilter.toLowerCase();

      const matchesType =
        typeFilter === "ALL" || e.event_type.toLowerCase() === typeFilter.toLowerCase();

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [events, search, categoryFilter, typeFilter]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !venue.trim()) {
      toast.error("Please provide Event Title and Venue");
      return;
    }
    const newEntry = {
      id: `ev-${Date.now()}`,
      title: title.trim(),
      category: category,
      event_type: eventType,
      venue: venue.trim(),
      sponsoring_agency: agency.trim() || "NIT Hamirpur",
      start_date: startDate,
      end_date: endDate || startDate,
      academic_session: `${new Date(startDate).getFullYear()}-${new Date(startDate).getFullYear() + 1}`,
      convenor: convenor.trim() || `${faculty.full_name} (Convenor)`,
      coordinator: coordinator.trim(),
      faculty_ids: [faculty.id],
    };
    setEvents([newEntry, ...events]);
    setShowModal(false);
    setTitle("");
    setConvenor("");
    setCoordinator("");
    toast.success("Conference / Event record saved!");
  };

  const handleDelete = (id: string) => {
    setEvents(events.filter((x) => x.id !== id));
    toast.success("Event record removed");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      {/* Header Banner */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <Presentation className="w-6 h-6 text-[#85261e]" />
              Conferences, STCs, FDPs &amp; Workshops
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2.5 py-0.5 rounded-full">
              {events.length} Events Logged
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Short-term courses, faculty development programmes, and national/international workshops organized by{" "}
            <strong>{faculty.full_name}</strong> ({faculty.employee_code || "Faculty"}).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] text-white px-4 py-2.5 text-xs font-bold shadow-xs hover:shadow-md transition cursor-pointer"
        >
          <Plus className="h-4 w-4 text-amber-300" />
          <span>Add Conference / STC</span>
        </button>
      </div>

      {/* Search & Category/Type Filters */}
      <div className="bg-white border border-[#eedfd8] rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search event title, venue, convenor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#eedfd8] bg-[#fff9f6] text-[#33110e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap items-center gap-1.5 bg-[#fff9f6] p-1 rounded-xl border border-[#eedfd8]">
              {[
                { id: "ALL", label: "All Roles" },
                { id: "organized", label: "Organized" },
                { id: "attended", label: "Attended / Chaired" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCategoryFilter(tab.id)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                    categoryFilter === tab.id
                      ? "bg-[#33110e] text-white shadow-xs"
                      : "text-[#33110e] hover:bg-[#eedfd8]/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 bg-[#fff9f6] p-1 rounded-xl border border-[#eedfd8]">
              {[
                { id: "ALL", label: "All Types" },
                { id: "E-STC", label: "E-STC" },
                { id: "STC", label: "STC" },
                { id: "workshop", label: "Workshop" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setTypeFilter(tab.id)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                    typeFilter === tab.id
                      ? "bg-[#85261e] text-white shadow-xs"
                      : "text-[#33110e] hover:bg-[#eedfd8]/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Events Cards Grid */}
      <div className="space-y-3.5">
        {filteredEvents.map((e) => {
          const isOrganized = e.category.toLowerCase() === "organized";
          return (
            <div
              key={e.id}
              className="rounded-2xl border border-[#eedfd8] bg-white p-5 shadow-xs hover:border-[#85261e]/40 transition duration-150 flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                      isOrganized
                        ? "bg-[#33110e] text-white border-[#33110e]"
                        : "bg-neutral-100 text-neutral-800 border-neutral-300"
                    }`}
                  >
                    {e.category}
                  </span>

                  <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase">
                    {e.event_type}
                  </span>

                  <span className="text-[11px] font-mono text-neutral-500 ml-auto flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#85261e]" />
                    <span>{e.start_date} {e.end_date && e.end_date !== e.start_date ? `to ${e.end_date}` : ""}</span>
                  </span>
                </div>

                <h2 className="text-sm sm:text-base font-bold text-[#1c110c] group-hover:text-[#85261e] transition leading-snug">
                  {e.title}
                </h2>

                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-700 font-medium">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-[#85261e]" />
                    <span>Venue: <strong>{e.venue}</strong></span>
                  </span>
                  {e.sponsoring_agency && (
                    <span className="text-neutral-500">
                      • Sponsored by: <strong>{e.sponsoring_agency}</strong>
                    </span>
                  )}
                </div>

                {(e.convenor || e.coordinator) && (
                  <div className="space-y-0.5 pt-1 text-xs text-neutral-600 bg-[#fff9f6] border border-[#eedfd8]/60 rounded-xl p-2.5">
                    {e.convenor && (
                      <p>
                        <span className="font-semibold text-[#85261e]">Convenor: </span>
                        {e.convenor}
                      </p>
                    )}
                    {e.coordinator && (
                      <p>
                        <span className="font-semibold text-[#85261e]">Coordinator(s): </span>
                        {e.coordinator}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end pt-3 border-t border-[#eedfd8]/60">
                <button
                  type="button"
                  onClick={() => handleDelete(e.id)}
                  className="p-1.5 text-neutral-400 hover:text-red-700 transition rounded-lg hover:bg-red-50 cursor-pointer"
                  title="Remove Event"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredEvents.length === 0 && (
          <div className="text-center py-16 text-neutral-500 text-xs bg-white rounded-2xl border border-[#eedfd8]">
            No conferences, STCs, or workshops found matching your filters.
          </div>
        )}
      </div>

      {/* Add Event Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl border border-[#eedfd8] bg-white p-6 sm:p-8 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-[#eedfd8]/60 pb-3">
              <div>
                <h2 className="text-lg font-bold text-[#33110e]">
                  Add Conference / STC / Workshop
                </h2>
                <p className="text-xs text-neutral-500">
                  Log organized or attended faculty development courses and international events.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-[#33110e] hover:bg-[#fff9f6] transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                  Event / Conference Title *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Research Applications of Deep Learning in Computer Vision"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-3 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Event Type *
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs font-semibold text-[#33110e] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  >
                    <option value="E-STC">E-STC (Online Short Term Course)</option>
                    <option value="STC">STC (Short Term Course)</option>
                    <option value="FDP">FDP (Faculty Development Programme)</option>
                    <option value="workshop">Workshop</option>
                    <option value="conference">International / National Conference</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Role Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs font-semibold text-[#33110e] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  >
                    <option value="organized">Organized / Coordinated</option>
                    <option value="attended">Attended / Session Chaired</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Venue / Host Institution *
                  </label>
                  <input
                    type="text"
                    required
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Sponsoring Agency
                  </label>
                  <input
                    type="text"
                    value={agency}
                    onChange={(e) => setAgency(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs font-mono text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs font-mono text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Convenor(s)
                  </label>
                  <input
                    type="text"
                    placeholder={`e.g. ${faculty.full_name} (Convenor)`}
                    value={convenor}
                    onChange={(e) => setConvenor(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Coordinator(s)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Co-Coordinator"
                    value={coordinator}
                    onChange={(e) => setCoordinator(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-[#eedfd8]/60">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-[#eedfd8] bg-white px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-[#fff9f6] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#33110e] hover:bg-[#85261e] text-white px-5 py-2 text-xs font-bold shadow-xs hover:shadow-md transition cursor-pointer"
                >
                  Save Event Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
