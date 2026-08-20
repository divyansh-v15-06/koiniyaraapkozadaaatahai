"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Award, X, Building2, Calendar, Sparkles, Trophy, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { MOCK_FACULTY } from "@/lib/mock-data";
import { getStoredData, setStoredData } from "@/lib/faculty-storage";

interface Honor {
  title: string;
  organization: string;
  year: number | string;
}

export default function HonorsPage() {
  const [user, setUser] = useState<any>(null);
  const [faculty, setFaculty] = useState<any>(MOCK_FACULTY[0]);
  const [honors, setHonors] = useState<Honor[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [year, setYear] = useState<number | string>(new Date().getFullYear());

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

    const facultyHonors = (activeFaculty as any).honors || [];
    const fallback =
      facultyHonors.length > 0
        ? facultyHonors
        : [
            {
              title: "Best Research Paper Award",
              organization: "IEEE International Conference on Advanced Networks",
              year: 2022,
            },
            {
              title: "Excellence in Teaching & Research Citation",
              organization: "National Institute of Technology Hamirpur",
              year: 2020,
            },
          ];

    const stored = getStoredData<Honor>(activeFaculty, "honors", fallback);
    setHonors(stored);
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !organization.trim()) {
      toast.error("Please provide Award Title and Awarding Body");
      return;
    }
    const newHonor: Honor = {
      title: title.trim(),
      organization: organization.trim(),
      year: year || new Date().getFullYear(),
    };
    const updated = [newHonor, ...honors];
    setHonors(updated);
    setStoredData(faculty, "honors", updated);
    setShowModal(false);
    setTitle("");
    setOrganization("");
    setYear(new Date().getFullYear());
    toast.success("Award / Honor record saved and persisted!");
  };

  const handleDelete = (index: number) => {
    const updated = honors.filter((_, idx) => idx !== index);
    setHonors(updated);
    setStoredData(faculty, "honors", updated);
    toast.success("Award record removed and storage updated");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      {/* Header Banner */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <Award className="w-6 h-6 text-[#85261e]" />
              Honors, Awards &amp; Recognitions
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2.5 py-0.5 rounded-full">
              {honors.length} Recognitions Recorded
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            National, international, and institutional awards conferred to{" "}
            <strong>{faculty.full_name}</strong> ({faculty.employee_code || "Faculty"}).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] text-white px-4 py-2.5 text-xs font-bold shadow-xs hover:shadow-md transition cursor-pointer"
        >
          <Plus className="h-4 w-4 text-amber-300" />
          <span>Add Award / Honor</span>
        </button>
      </div>

      {/* Honors Cards Grid */}
      <div className="space-y-3">
        {honors.map((item, i) => (
          <div
            key={i}
            className="rounded-2xl border border-[#eedfd8] bg-white p-5 shadow-xs hover:border-[#85261e]/40 transition duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#fff9f6] border border-[#eedfd8] flex items-center justify-center text-amber-600 flex-shrink-0 shadow-2xs group-hover:bg-[#33110e] group-hover:text-amber-300 transition duration-200">
                <Trophy className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-sm sm:text-base text-[#1c110c] group-hover:text-[#85261e] transition">
                    {item.title}
                  </h3>
                  <span className="bg-[#fff9f6] text-[#33110e] border border-[#eedfd8] text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                    Year: {item.year}
                  </span>
                </div>

                <p className="text-xs text-neutral-700 font-medium flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#85261e]" />
                  <span>Awarded by: <strong>{item.organization}</strong></span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center border-t sm:border-t-0 pt-2 sm:pt-0 border-[#eedfd8]/60 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => handleDelete(i)}
                className="p-2 text-neutral-400 hover:text-red-700 transition rounded-xl hover:bg-red-50 cursor-pointer"
                title="Remove Honor"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {honors.length === 0 && (
          <div className="text-center py-16 text-neutral-500 text-xs bg-white rounded-2xl border border-[#eedfd8]">
            No honors or awards recorded yet. Click &quot;Add Award / Honor&quot; to log your recognitions.
          </div>
        )}
      </div>

      {/* Add Honor Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans">
          <div className="w-full max-w-lg rounded-3xl border border-[#eedfd8] bg-white p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#eedfd8]/60 pb-3">
              <div>
                <h2 className="text-lg font-bold text-[#33110e]">
                  Add Award / Honor
                </h2>
                <p className="text-xs text-neutral-500">
                  Log fellowships, best paper awards, and state/national recognitions.
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
                  Award / Honor Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Best Paper Award, TCS Research Fellowship, University Gold Medal"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                  Awarding Body / Organization *
                </label>
                <input
                  type="text"
                  placeholder="e.g. IEEE, Department of Science & Technology, Cisco, Wiley"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                  Year of Award *
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  required
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs font-mono text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
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
                  Save Honor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
