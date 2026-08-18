"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Trash2,
  Shield,
  X,
  Search,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  FileText,
  Building2,
  Calendar,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import { MOCK_FACULTY, MOCK_PATENTS } from "@/lib/mock-data";

export default function FacultyPatentsPage() {
  const [user, setUser] = useState<any>(null);
  const [faculty, setFaculty] = useState<any>(MOCK_FACULTY[0]);
  const [patents, setPatents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [appNo, setAppNo] = useState("");
  const [patentNo, setPatentNo] = useState("");
  const [status, setStatus] = useState("Filed");
  const [office, setOffice] = useState("Indian Patent Office (New Delhi)");
  const [country, setCountry] = useState("India");
  const [filingDate, setFilingDate] = useState(new Date().toISOString().split("T")[0]);
  const [grantDate, setGrantDate] = useState("");
  const [inventors, setInventors] = useState("");

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
          const userPatents = MOCK_PATENTS.filter((p: any) => {
            if (p.faculty_ids && p.faculty_ids.includes(match.id)) return true;
            if (p.raw_inventors && p.raw_inventors.toLowerCase().includes(lastName)) return true;
            return false;
          });
          setPatents(userPatents.length > 0 ? userPatents : MOCK_PATENTS);
        }
      } catch {}
    } else {
      setPatents(MOCK_PATENTS);
    }
  }, []);

  const filteredPatents = useMemo(() => {
    return patents.filter((p) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        p.title.toLowerCase().includes(q) ||
        (p.application_number && String(p.application_number).toLowerCase().includes(q)) ||
        (p.patent_number && String(p.patent_number).toLowerCase().includes(q)) ||
        (p.raw_inventors && p.raw_inventors.toLowerCase().includes(q));

      const matchesStatus =
        statusFilter === "ALL" || p.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [patents, search, statusFilter]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !appNo.trim()) {
      toast.error("Please provide Patent Title and Application Number");
      return;
    }
    const newPatent = {
      id: `pat-${Date.now()}`,
      title: title.trim(),
      application_number: appNo.trim(),
      patent_number: status === "Granted" ? patentNo.trim() || `IN ${Math.floor(100000 + Math.random() * 900000)}` : "",
      status: status,
      filing_date: filingDate,
      grant_date: status === "Granted" ? grantDate || new Date().toISOString().split("T")[0] : "",
      country: country,
      patent_office: office,
      raw_inventors: inventors.trim() || faculty.full_name,
      abstract_text: `Patented technology developed by ${inventors || faculty.full_name}.`,
      faculty_ids: [faculty.id],
    };
    setPatents([newPatent, ...patents]);
    setShowModal(false);
    setTitle("");
    setAppNo("");
    setPatentNo("");
    setInventors("");
    setStatus("Filed");
    toast.success("Intellectual property patent record saved!");
  };

  const handleDelete = (id: string) => {
    setPatents(patents.filter((x) => x.id !== id));
    toast.success("Patent entry removed");
  };

  const getStatusBadge = (st: string) => {
    const s = st.toLowerCase();
    if (s.includes("grant")) {
      return "bg-emerald-50 text-emerald-800 border-emerald-300";
    }
    if (s.includes("publish")) {
      return "bg-sky-50 text-sky-800 border-sky-300";
    }
    return "bg-amber-50 text-amber-800 border-amber-300";
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      {/* Header Banner */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <Shield className="w-6 h-6 text-[#85261e]" />
              Patents &amp; Intellectual Property
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2.5 py-0.5 rounded-full">
              {patents.length} Patents Tracked
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Granted, published, and filed intellectual property patents for{" "}
            <strong>{faculty.full_name}</strong> ({faculty.employee_code || "Faculty"}).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] text-white px-4 py-2.5 text-xs font-bold shadow-xs hover:shadow-md transition cursor-pointer"
        >
          <Plus className="h-4 w-4 text-amber-300" />
          <span>Add Patent Entry</span>
        </button>
      </div>

      {/* Search & Status Filters */}
      <div className="bg-white border border-[#eedfd8] rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search patent title, app no, inventors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#eedfd8] bg-[#fff9f6] text-[#33110e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-[#fff9f6] p-1 rounded-xl border border-[#eedfd8]">
            {[
              { id: "ALL", label: "All Patents" },
              { id: "Granted", label: "Granted" },
              { id: "Published", label: "Published" },
              { id: "Filed", label: "Filed / Pending" },
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
        </div>
      </div>

      {/* Patent Cards Grid */}
      <div className="space-y-3.5">
        {filteredPatents.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border border-[#eedfd8] bg-white p-5 shadow-xs hover:border-[#85261e]/40 transition duration-150 flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(p.status)}`}>
                  {p.status}
                </span>

                <span className="bg-[#fff9f6] text-[#33110e] border border-[#eedfd8] text-[11px] font-mono font-bold px-2 py-0.5 rounded">
                  App No: {p.application_number}
                </span>

                {p.patent_number && (
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-mono font-bold px-2 py-0.5 rounded">
                    Patent No: {p.patent_number}
                  </span>
                )}

                <span className="text-xs text-neutral-500 font-medium ml-auto">
                  {p.patent_office || p.country}
                </span>
              </div>

              <h2 className="text-sm sm:text-base font-bold text-[#1c110c] group-hover:text-[#85261e] transition leading-snug">
                {p.title}
              </h2>

              {p.raw_inventors && (
                <p className="text-xs text-neutral-600">
                  <span className="font-semibold text-[#85261e]">Inventors: </span>
                  {p.raw_inventors}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-neutral-500 pt-1">
                {p.filing_date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#85261e]" />
                    <span>Filing Date: {p.filing_date}</span>
                  </span>
                )}
                {p.grant_date && (
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <Award className="w-3 h-3" />
                    <span>Grant Date: {p.grant_date}</span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-[#eedfd8]/60">
              <button
                type="button"
                onClick={() => handleDelete(p.id)}
                className="p-1.5 text-neutral-400 hover:text-red-700 transition rounded-lg hover:bg-red-50 cursor-pointer"
                title="Remove Patent"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredPatents.length === 0 && (
          <div className="text-center py-16 text-neutral-500 text-xs bg-white rounded-2xl border border-[#eedfd8]">
            No patents found matching your search criteria.
          </div>
        )}
      </div>

      {/* Add Patent Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl border border-[#eedfd8] bg-white p-6 sm:p-8 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-[#eedfd8]/60 pb-3">
              <div>
                <h2 className="text-lg font-bold text-[#33110e]">
                  Add Patent &amp; Intellectual Property
                </h2>
                <p className="text-xs text-neutral-500">
                  Log granted patents, published specifications, or new patent applications.
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
                  Patent Title *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Method and System for Autonomous Traffic Routing using Edge AI"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-3 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Application Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 202311027129 A"
                    value={appNo}
                    onChange={(e) => setAppNo(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs font-mono text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Patent Status *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs font-semibold text-[#33110e] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  >
                    <option value="Filed">Filed / Pending</option>
                    <option value="Published">Published</option>
                    <option value="Granted">Granted</option>
                  </select>
                </div>
              </div>

              {status === "Granted" && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Granted Patent Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. IN 428901"
                    value={patentNo}
                    onChange={(e) => setPatentNo(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs font-mono text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                  Inventors (in Order)
                </label>
                <input
                  type="text"
                  placeholder={`e.g. ${faculty.full_name}, Dr. Co-Inventor`}
                  value={inventors}
                  onChange={(e) => setInventors(e.target.value)}
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Patent Office / Authority
                  </label>
                  <input
                    type="text"
                    value={office}
                    onChange={(e) => setOffice(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Filing Date
                  </label>
                  <input
                    type="date"
                    value={filingDate}
                    onChange={(e) => setFilingDate(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs font-mono text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
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
                  Save Patent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
