"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Trash2,
  Lightbulb,
  X,
  Search,
  CheckCircle2,
  Building2,
  Calendar,
  IndianRupee,
  Sparkles,
  Award,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { formatINR } from "@/lib/utils";
import { MOCK_FACULTY, MOCK_PROJECTS } from "@/lib/mock-data";
import { getStoredData, setStoredData } from "@/lib/faculty-storage";

export default function FacultyProjectsPage() {
  const [user, setUser] = useState<any>(null);
  const [faculty, setFaculty] = useState<any>(MOCK_FACULTY[0]);
  const [projects, setProjects] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [agency, setAgency] = useState("");
  const [refNo, setRefNo] = useState("");
  const [budget, setBudget] = useState(2500000);
  const [status, setStatus] = useState("Ongoing");
  const [year, setYear] = useState(new Date().getFullYear());
  const [investigators, setInvestigators] = useState("");

  useEffect(() => {
    let activeFaculty = MOCK_FACULTY[0];
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
          activeFaculty = match;
          setFaculty(match);
        }
      } catch {}
    }

    const lastName = activeFaculty.full_name.toLowerCase().split(" ").pop() || "";
    const userProjects = MOCK_PROJECTS.filter((p: any) => {
      if (p.faculty_ids && p.faculty_ids.includes(activeFaculty.id)) return true;
      if (p.raw_investigators && p.raw_investigators.toLowerCase().includes(lastName)) return true;
      return false;
    });

    const fallback = userProjects.length > 0 ? userProjects : MOCK_PROJECTS;
    const stored = getStoredData(activeFaculty, "projects", fallback);
    setProjects(stored);
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        p.title.toLowerCase().includes(q) ||
        (p.funding_agency && p.funding_agency.toLowerCase().includes(q)) ||
        (p.reference_number && p.reference_number.toLowerCase().includes(q)) ||
        (p.raw_investigators && p.raw_investigators.toLowerCase().includes(q));

      const matchesStatus =
        statusFilter === "ALL" || p.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, statusFilter]);

  const totalFunding = useMemo(() => {
    return filteredProjects.reduce(
      (sum, p) => sum + (Number(p.total_sanctioned_amount) || 0),
      0
    );
  }, [filteredProjects]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !agency.trim()) {
      toast.error("Please provide Project Title and Funding Agency");
      return;
    }
    const newPrj = {
      id: `prj-${Date.now()}`,
      title: title.trim(),
      funding_agency: agency.trim(),
      status: status,
      project_type: "Sponsored R&D",
      start_date: `${year}-04-01`,
      end_date: `${Number(year) + 3}-03-31`,
      year: Number(year) || new Date().getFullYear(),
      total_sanctioned_amount: Number(budget),
      total_amount_received: Number(budget),
      scheme: "Core Research Grant",
      reference_number: refNo.trim() || `CRG/${year}/${Math.floor(1000 + Math.random() * 9000)}`,
      raw_investigators: investigators.trim() || faculty.full_name,
      faculty_ids: [faculty.id],
    };
    const updated = [newPrj, ...projects];
    setProjects(updated);
    setStoredData(faculty, "projects", updated);
    setShowModal(false);
    setTitle("");
    setAgency("");
    setRefNo("");
    setInvestigators("");
    setBudget(2500000);
    setStatus("Ongoing");
    toast.success("R&D Sponsored Project grant saved and persisted!");
  };

  const handleDelete = (id: string) => {
    const updated = projects.filter((x) => x.id !== id);
    setProjects(updated);
    setStoredData(faculty, "projects", updated);
    toast.success("Project record removed and storage updated");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      {/* Header Banner */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-[#85261e]" />
              Sponsored R&amp;D Projects &amp; Grants
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2.5 py-0.5 rounded-full">
              {projects.length} Grants Tracked
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Externally sponsored research grants from DST, SERB, MeitY, and industry for{" "}
            <strong>{faculty.full_name}</strong> ({faculty.employee_code || "Faculty"}).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] text-white px-4 py-2.5 text-xs font-bold shadow-xs hover:shadow-md transition cursor-pointer"
        >
          <Plus className="h-4 w-4 text-amber-300" />
          <span>Add Project Grant</span>
        </button>
      </div>

      {/* Search, Status & Funding KPI */}
      <div className="bg-white border border-[#eedfd8] rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search project title, agency, ref no, investigators..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#eedfd8] bg-[#fff9f6] text-[#33110e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap items-center gap-1.5 bg-[#fff9f6] p-1 rounded-xl border border-[#eedfd8]">
              {[
                { id: "ALL", label: "All Projects" },
                { id: "Ongoing", label: "Ongoing" },
                { id: "Completed", label: "Completed" },
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
              <span>Total Grants: </span>
              <span className="text-amber-300 font-mono">{formatINR(totalFunding)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="space-y-3.5">
        {filteredProjects.map((p) => {
          const isOngoing = p.status.toLowerCase() === "ongoing";
          return (
            <div
              key={p.id}
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
                    {p.status}
                  </span>

                  <span className="bg-[#fff9f6] text-[#33110e] border border-[#eedfd8] text-[11px] font-mono font-bold px-2 py-0.5 rounded">
                    {p.funding_agency}
                  </span>

                  {p.reference_number && (
                    <span className="text-[11px] font-mono text-neutral-500">
                      Ref: {p.reference_number}
                    </span>
                  )}

                  <span className="text-sm font-extrabold font-mono text-[#85261e] ml-auto">
                    {formatINR(p.total_sanctioned_amount)}
                  </span>
                </div>

                <h2 className="text-sm sm:text-base font-bold text-[#1c110c] group-hover:text-[#85261e] transition leading-snug">
                  {p.title}
                </h2>

                {p.raw_investigators && (
                  <p className="text-xs text-neutral-600">
                    <span className="font-semibold text-[#85261e]">Investigators: </span>
                    {p.raw_investigators}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-neutral-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#85261e]" />
                    <span>Duration: {p.year || 2023} – {Number(p.year || 2023) + 3}</span>
                  </span>
                  {p.total_amount_received && (
                    <span className="text-neutral-600">
                      Received: <strong className="text-neutral-800">{formatINR(p.total_amount_received)}</strong>
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end pt-3 border-t border-[#eedfd8]/60">
                <button
                  type="button"
                  onClick={() => handleDelete(p.id)}
                  className="p-1.5 text-neutral-400 hover:text-red-700 transition rounded-lg hover:bg-red-50 cursor-pointer"
                  title="Remove Project"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 text-neutral-500 text-xs bg-white rounded-2xl border border-[#eedfd8]">
            No R&amp;D project grants found matching your search.
          </div>
        )}
      </div>

      {/* Add Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl border border-[#eedfd8] bg-white p-6 sm:p-8 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-[#eedfd8]/60 pb-3">
              <div>
                <h2 className="text-lg font-bold text-[#33110e]">
                  Add Sponsored R&amp;D Project
                </h2>
                <p className="text-xs text-neutral-500">
                  Log government, institutional, or industry research grants.
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
                  Project Title *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Design and Implementation of Post-Disaster Ad-Hoc Mesh Communication System"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-3 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Funding Agency *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SERB, MeitY, DST, UP-CST, DRDO"
                    value={agency}
                    onChange={(e) => setAgency(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Sanction Reference Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CRG/2024/001928"
                    value={refNo}
                    onChange={(e) => setRefNo(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs font-mono text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Sanctioned Grant (INR) *
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    required
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs font-mono text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Sanction Year *
                  </label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
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
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                  Principal &amp; Co-Principal Investigators
                </label>
                <input
                  type="text"
                  placeholder={`e.g. ${faculty.full_name} (PI), Dr. Co-PI Name`}
                  value={investigators}
                  onChange={(e) => setInvestigators(e.target.value)}
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
                  Save Project Grant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
