"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Trash2,
  GraduationCap,
  X,
  Search,
  CheckCircle2,
  BookOpen,
  Calendar,
  Sparkles,
  Users,
  Award,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { MOCK_FACULTY } from "@/lib/mock-data";

interface Supervision {
  id?: number | string;
  level: string;
  student_name: string;
  roll_number?: string | number;
  thesis_title: string;
  status: string;
  year?: number | string;
  co_supervisor?: string | null;
}

export default function FacultySupervisionsPage() {
  const [user, setUser] = useState<any>(null);
  const [faculty, setFaculty] = useState<any>(MOCK_FACULTY[0]);
  const [items, setItems] = useState<Supervision[]>([]);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [level, setLevel] = useState("Ph.D.");
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [topic, setTopic] = useState("");
  const [status, setStatus] = useState("Ongoing");
  const [year, setYear] = useState(new Date().getFullYear());
  const [coSupervisor, setCoSupervisor] = useState("");

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
          const facultySupervisions = (match as any).supervisions || [];
          if (facultySupervisions.length > 0) {
            setItems(facultySupervisions);
          } else {
            setItems([
              {
                level: "Ph.D.",
                student_name: "Praveen Prakash",
                roll_number: "23RCS004",
                thesis_title: "Lightweight Security Model of Internet of Things Systems",
                status: "Ongoing",
                year: 2023,
                co_supervisor: null,
              },
            ]);
          }
        }
      } catch {}
    } else {
      const defaultSups = (MOCK_FACULTY[0] as any).supervisions || [];
      setItems(defaultSups);
    }
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((it) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        it.student_name.toLowerCase().includes(q) ||
        (it.roll_number && String(it.roll_number).toLowerCase().includes(q)) ||
        it.thesis_title.toLowerCase().includes(q) ||
        (it.co_supervisor && it.co_supervisor.toLowerCase().includes(q));

      const matchesLevel =
        levelFilter === "ALL" ||
        (levelFilter === "PHD" && it.level.toLowerCase().includes("ph")) ||
        (levelFilter === "PG" && (it.level.toLowerCase().includes("m.tech") || it.level.toLowerCase().includes("pg")));

      const matchesStatus =
        statusFilter === "ALL" || it.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesLevel && matchesStatus;
    });
  }, [items, search, levelFilter, statusFilter]);

  const phdCount = useMemo(
    () => items.filter((it) => it.level.toLowerCase().includes("ph")).length,
    [items]
  );
  const pgCount = useMemo(
    () => items.filter((it) => it.level.toLowerCase().includes("m.tech") || it.level.toLowerCase().includes("pg")).length,
    [items]
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !topic.trim()) {
      toast.error("Please provide Scholar Name and Thesis Title");
      return;
    }
    const newEntry: Supervision = {
      id: `sup-${Date.now()}`,
      level: level,
      student_name: name.trim(),
      roll_number: rollNo.trim() || undefined,
      thesis_title: topic.trim(),
      status: status,
      year: year,
      co_supervisor: coSupervisor.trim() || null,
    };
    setItems([newEntry, ...items]);
    setShowModal(false);
    setName("");
    setRollNo("");
    setTopic("");
    setCoSupervisor("");
    setStatus("Ongoing");
    setLevel("Ph.D.");
    toast.success("Research supervision record saved!");
  };

  const handleDelete = (index: number) => {
    setItems(items.filter((_, idx) => idx !== index));
    toast.success("Supervision record removed");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      {/* Header Banner */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-[#85261e]" />
              Research Supervisions (Ph.D. &amp; PG / M.Tech)
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2.5 py-0.5 rounded-full">
              {items.length} Scholars Guided
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Doctoral dissertations, Master of Technology theses, and research guidance of{" "}
            <strong>{faculty.full_name}</strong> ({faculty.employee_code || "Faculty"}).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] text-white px-4 py-2.5 text-xs font-bold shadow-xs hover:shadow-md transition cursor-pointer"
        >
          <Plus className="h-4 w-4 text-amber-300" />
          <span>Add Research Scholar</span>
        </button>
      </div>

      {/* Search & Level/Status Filters */}
      <div className="bg-white border border-[#eedfd8] rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search scholar name, roll no, topic, co-supervisor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#eedfd8] bg-[#fff9f6] text-[#33110e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Level Filter */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#fff9f6] p-1 rounded-xl border border-[#eedfd8]">
              {[
                { id: "ALL", label: `All (${items.length})` },
                { id: "PHD", label: `Ph.D. (${phdCount})` },
                { id: "PG", label: `M.Tech / PG (${pgCount})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setLevelFilter(tab.id)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                    levelFilter === tab.id
                      ? "bg-[#33110e] text-white shadow-xs"
                      : "text-[#33110e] hover:bg-[#eedfd8]/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#fff9f6] p-1 rounded-xl border border-[#eedfd8]">
              {[
                { id: "ALL", label: "All Status" },
                { id: "Ongoing", label: "Ongoing" },
                { id: "Completed", label: "Completed" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                    statusFilter === tab.id
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

      {/* Supervisions Cards Grid */}
      <div className="space-y-3.5">
        {filteredItems.map((it, i) => {
          const isOngoing = it.status.toLowerCase() === "ongoing";
          const isPhd = it.level.toLowerCase().includes("ph");
          return (
            <div
              key={i}
              className="rounded-2xl border border-[#eedfd8] bg-white p-5 shadow-xs hover:border-[#85261e]/40 transition duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#fff9f6] border border-[#eedfd8] flex items-center justify-center text-[#85261e] flex-shrink-0 shadow-2xs group-hover:bg-[#33110e] group-hover:text-amber-300 transition duration-200">
                  <GraduationCap className="w-6 h-6" />
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-[#1c110c] group-hover:text-[#85261e] transition">
                      {it.student_name}
                    </h3>

                    {it.roll_number && (
                      <span className="bg-[#fff9f6] text-[#33110e] border border-[#eedfd8] text-[11px] font-mono font-bold px-2 py-0.5 rounded">
                        Roll: {it.roll_number}
                      </span>
                    )}

                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        isPhd
                          ? "bg-[#33110e] text-white"
                          : "bg-neutral-800 text-white"
                      }`}
                    >
                      {it.level}
                    </span>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        isOngoing
                          ? "bg-amber-50 text-amber-800 border-amber-300"
                          : "bg-emerald-50 text-emerald-800 border-emerald-300"
                      }`}
                    >
                      {it.status} {it.year ? `(${it.year})` : ""}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-700 leading-relaxed font-medium bg-[#fff9f6] border border-[#eedfd8]/60 rounded-xl p-2.5 italic">
                    &quot;{it.thesis_title}&quot;
                  </p>

                  {it.co_supervisor && (
                    <p className="text-[11px] text-neutral-500 flex items-center gap-1 pt-0.5">
                      <Users className="w-3 h-3 text-[#85261e]" />
                      <span>Co-Supervisor: <strong>{it.co_supervisor}</strong></span>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center border-t sm:border-t-0 pt-2 sm:pt-0 border-[#eedfd8]/60 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => handleDelete(i)}
                  className="p-2 text-neutral-400 hover:text-red-700 transition rounded-xl hover:bg-red-50 cursor-pointer"
                  title="Remove Supervision Record"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="text-center py-16 text-neutral-500 text-xs bg-white rounded-2xl border border-[#eedfd8]">
            No research supervision records found matching your filters.
          </div>
        )}
      </div>

      {/* Add Supervision Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl border border-[#eedfd8] bg-white p-6 sm:p-8 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-[#eedfd8]/60 pb-3">
              <div>
                <h2 className="text-lg font-bold text-[#33110e]">
                  Add Research Scholar Guidance
                </h2>
                <p className="text-xs text-neutral-500">
                  Log Ph.D. doctoral dissertations or M.Tech postgraduate theses.
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Degree Level *
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs font-semibold text-[#33110e] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  >
                    <option value="Ph.D.">Ph.D. Doctoral Dissertation</option>
                    <option value="M.Tech / PG">M.Tech / Postgraduate Thesis</option>
                  </select>
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
                    <option value="Ongoing">Ongoing / Pursuing</option>
                    <option value="Completed">Completed / Awarded</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Scholar Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Akash Verma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 22RCS006 or 19M520"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs font-mono text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                  Research Topic / Dissertation Title *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Deep Learning based Brain Tumor Segmentation and Classification from MRI Images"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-3 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Enrolment / Completion Year *
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
                    Co-Supervisor (If Any)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Co-Supervisor Name"
                    value={coSupervisor}
                    onChange={(e) => setCoSupervisor(e.target.value)}
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
                  Save Scholar Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
