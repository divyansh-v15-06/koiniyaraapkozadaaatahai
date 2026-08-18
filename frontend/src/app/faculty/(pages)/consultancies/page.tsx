"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Trash2,
  FlaskConical,
  X,
  Search,
  CheckCircle2,
  Building2,
  Calendar,
  Briefcase,
  IndianRupee,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { formatINR } from "@/lib/utils";
import { MOCK_FACULTY, MOCK_CONSULTANCIES } from "@/lib/mock-data";

export default function FacultyConsultanciesPage() {
  const [user, setUser] = useState<any>(null);
  const [faculty, setFaculty] = useState<any>(MOCK_FACULTY[0]);
  const [consultancies, setConsultancies] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState(1500000);
  const [status, setStatus] = useState("Completed");
  const [year, setYear] = useState(new Date().getFullYear());
  const [session, setSession] = useState("2024-2025");
  const [consultants, setConsultants] = useState("");

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
          const userConsultancies = MOCK_CONSULTANCIES.filter((c: any) => {
            if (c.faculty_ids && c.faculty_ids.includes(match.id)) return true;
            if (c.author_text && c.author_text.toLowerCase().includes(lastName)) return true;
            return false;
          });
          setConsultancies(userConsultancies.length > 0 ? userConsultancies : MOCK_CONSULTANCIES);
        }
      } catch {}
    } else {
      setConsultancies(MOCK_CONSULTANCIES);
    }
  }, []);

  const filteredConsultancies = useMemo(() => {
    return consultancies.filter((c) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        c.title.toLowerCase().includes(q) ||
        (c.client_organisation && c.client_organisation.toLowerCase().includes(q)) ||
        (c.author_text && c.author_text.toLowerCase().includes(q));

      const matchesStatus =
        statusFilter === "ALL" || c.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [consultancies, search, statusFilter]);

  const totalRevenue = useMemo(() => {
    return filteredConsultancies.reduce(
      (sum, c) => sum + (Number(c.amount) || 0),
      0
    );
  }, [filteredConsultancies]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !client.trim()) {
      toast.error("Please provide Consultancy Title and Client Organization");
      return;
    }
    const newEntry = {
      id: `cons-${Date.now()}`,
      title: title.trim(),
      client_organisation: client.trim(),
      amount: Number(amount),
      start_year: Number(year) || new Date().getFullYear(),
      academic_session: session.trim() || `${year}-${Number(year) + 1}`,
      status: status,
      author_text: consultants.trim() || faculty.full_name,
      faculty_ids: [faculty.id],
    };
    setConsultancies([newEntry, ...consultancies]);
    setShowModal(false);
    setTitle("");
    setClient("");
    setConsultants("");
    setAmount(1500000);
    setStatus("Completed");
    toast.success("Industrial consultancy engagement saved!");
  };

  const handleDelete = (id: string) => {
    setConsultancies(consultancies.filter((x) => x.id !== id));
    toast.success("Consultancy project removed");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      {/* Header Banner */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <FlaskConical className="w-6 h-6 text-[#85261e]" />
              Industrial Consultancy &amp; Corporate Advisory
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2.5 py-0.5 rounded-full">
              {consultancies.length} Engagements
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Technical advisory, system automation, and corporate testing services rendered by{" "}
            <strong>{faculty.full_name}</strong> ({faculty.employee_code || "Faculty"}).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] text-white px-4 py-2.5 text-xs font-bold shadow-xs hover:shadow-md transition cursor-pointer"
        >
          <Plus className="h-4 w-4 text-amber-300" />
          <span>Add Consultancy</span>
        </button>
      </div>

      {/* Search, Status & Revenue KPI */}
      <div className="bg-white border border-[#eedfd8] rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search consultancy title, client, consultants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#eedfd8] bg-[#fff9f6] text-[#33110e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap items-center gap-1.5 bg-[#fff9f6] p-1 rounded-xl border border-[#eedfd8]">
              {[
                { id: "ALL", label: "All Engagements" },
                { id: "Completed", label: "Completed" },
                { id: "Ongoing", label: "Ongoing" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                    statusFilter === tab.id
                      ? "bg-[#33110e] text-white shadow-xs"
                      : "text-[#33110e] hover:bg-[#eedfd8]/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="bg-[#33110e] text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-2xs">
              <span>Total Revenue: </span>
              <span className="text-amber-300 font-mono">{formatINR(totalRevenue)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Consultancy Cards Grid */}
      <div className="space-y-3.5">
        {filteredConsultancies.map((c) => {
          const isOngoing = c.status.toLowerCase() === "ongoing";
          return (
            <div
              key={c.id}
              className="rounded-2xl border border-[#eedfd8] bg-white p-5 shadow-xs hover:border-[#85261e]/40 transition duration-150 flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      isOngoing
                        ? "bg-sky-50 text-sky-800 border-sky-300"
                        : "bg-emerald-50 text-emerald-800 border-emerald-300"
                    }`}
                  >
                    {c.status}
                  </span>

                  <span className="bg-[#fff9f6] text-[#33110e] border border-[#eedfd8] text-[11px] font-mono font-bold px-2 py-0.5 rounded">
                    Session: {c.academic_session || "2024-2025"}
                  </span>

                  <span className="text-base font-extrabold font-mono text-[#85261e] ml-auto">
                    {formatINR(c.amount)}
                  </span>
                </div>

                <h2 className="text-sm sm:text-base font-bold text-[#1c110c] group-hover:text-[#85261e] transition leading-snug">
                  {c.title}
                </h2>

                <p className="text-xs text-neutral-700 font-medium flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#85261e] flex-shrink-0" />
                  <span>Client: <strong>{c.client_organisation}</strong></span>
                </p>

                {c.author_text && (
                  <p className="text-xs text-neutral-600">
                    <span className="font-semibold text-[#85261e]">Consultant(s): </span>
                    {c.author_text}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end pt-3 border-t border-[#eedfd8]/60">
                <button
                  type="button"
                  onClick={() => handleDelete(c.id)}
                  className="p-1.5 text-neutral-400 hover:text-red-700 transition rounded-lg hover:bg-red-50 cursor-pointer"
                  title="Remove Consultancy"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredConsultancies.length === 0 && (
          <div className="text-center py-16 text-neutral-500 text-xs bg-white rounded-2xl border border-[#eedfd8]">
            No consultancy engagements found matching your search.
          </div>
        )}
      </div>

      {/* Add Consultancy Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl border border-[#eedfd8] bg-white p-6 sm:p-8 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-[#eedfd8]/60 pb-3">
              <div>
                <h2 className="text-lg font-bold text-[#33110e]">
                  Add Industrial Consultancy Project
                </h2>
                <p className="text-xs text-neutral-500">
                  Log corporate advisory, testing, software development, or industrial IT audits.
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
                  Consultancy Project Title *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Setting up Integrated Control Command Centre (ICCC) for Smart City"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-3 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                  Client / Sponsoring Organization *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kangra Central Cooperative Bank, Dharamshala Smart City Ltd, RINL Vizag"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Consultancy Value (INR) *
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    required
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs font-mono text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Academic Session *
                  </label>
                  <input
                    type="text"
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                    placeholder="e.g. 2024-2025"
                    required
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs font-mono text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Status *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs font-semibold text-[#33110e] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Ongoing">Ongoing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                  Faculty Consultants
                </label>
                <input
                  type="text"
                  placeholder={`e.g. ${faculty.full_name}, Dr. Co-Consultant`}
                  value={consultants}
                  onChange={(e) => setConsultants(e.target.value)}
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
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
                  Save Consultancy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
