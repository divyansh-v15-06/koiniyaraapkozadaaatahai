"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, GraduationCap, X, Building2, Calendar, BookOpen, CheckCircle2, Award, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { MOCK_FACULTY } from "@/lib/mock-data";
import { getStoredData, setStoredData } from "@/lib/faculty-storage";

interface Qualification {
  degree: string;
  institute: string;
  year: number | string;
  specialization?: string;
}

export default function QualificationsPage() {
  const [user, setUser] = useState<any>(null);
  const [faculty, setFaculty] = useState<any>(MOCK_FACULTY[0]);
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [degree, setDegree] = useState("");
  const [institute, setInstitute] = useState("");
  const [year, setYear] = useState<number | string>(new Date().getFullYear());
  const [specialization, setSpecialization] = useState("");

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

    const defaultQuals =
      activeFaculty.qualifications && activeFaculty.qualifications.length > 0
        ? activeFaculty.qualifications
        : [
            {
              degree: "Ph.D. in Computer Science & Engineering",
              institute: "IIT Roorkee",
              year: 2012,
              specialization: "Wireless Networks & Distributed Systems",
            },
            {
              degree: "M.Tech in Computer Science & Engineering",
              institute: "National Institute of Technology Hamirpur",
              year: 2006,
              specialization: "Computer Systems",
            },
            {
              degree: "B.Tech in Computer Science & Engineering",
              institute: "Himachal Pradesh University",
              year: 2002,
              specialization: "Information Technology",
            },
          ];

    const stored = getStoredData<Qualification>(activeFaculty, "qualifications", defaultQuals);
    setQualifications(stored);
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!degree.trim() || !institute.trim()) {
      toast.error("Please provide both Degree Title and Awarding Institute");
      return;
    }
    const newQual: Qualification = {
      degree: degree.trim(),
      institute: institute.trim(),
      year: year || new Date().getFullYear(),
      specialization: specialization.trim() || undefined,
    };
    const updated = [newQual, ...qualifications];
    setQualifications(updated);
    setStoredData(faculty, "qualifications", updated);
    setShowModal(false);
    setDegree("");
    setInstitute("");
    setSpecialization("");
    setYear(new Date().getFullYear());
    toast.success("Degree qualification added and saved permanently!");
  };

  const handleDelete = (index: number) => {
    const updated = qualifications.filter((_, i) => i !== index);
    setQualifications(updated);
    setStoredData(faculty, "qualifications", updated);
    toast.success("Qualification record removed and storage updated");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      {/* Header Banner */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-[#85261e]" />
              Educational Qualifications
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2.5 py-0.5 rounded-full">
              {qualifications.length} Degrees Recorded
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Academic degrees, awarding universities, and specializations for{" "}
            <strong>{faculty.full_name}</strong> ({faculty.employee_code || "Faculty"}).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] text-white px-4 py-2.5 text-xs font-bold shadow-xs hover:shadow-md transition cursor-pointer"
        >
          <Plus className="h-4 w-4 text-amber-300" />
          <span>Add Qualification</span>
        </button>
      </div>

      {/* Qualifications List */}
      <div className="space-y-3">
        {qualifications.map((q, i) => (
          <div
            key={i}
            className="rounded-2xl border border-[#eedfd8] bg-white p-5 shadow-xs hover:border-[#85261e]/40 transition duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#fff9f6] border border-[#eedfd8] flex items-center justify-center text-[#85261e] flex-shrink-0 shadow-2xs group-hover:bg-[#33110e] group-hover:text-white transition duration-200">
                <GraduationCap className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-sm sm:text-base text-[#1c110c] group-hover:text-[#85261e] transition">
                    {q.degree}
                  </h3>
                  <span className="bg-[#fff9f6] text-[#33110e] border border-[#eedfd8] text-[11px] font-mono font-bold px-2 py-0.5 rounded">
                    Year: {q.year}
                  </span>
                </div>

                <p className="text-xs text-neutral-600 flex items-center gap-1.5 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-[#85261e]" />
                  {q.institute}
                </p>

                {q.specialization && (
                  <p className="text-[11px] text-neutral-500 pt-0.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Specialization: <strong className="text-neutral-700">{q.specialization}</strong></span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center border-t sm:border-t-0 pt-2 sm:pt-0 border-[#eedfd8]/60 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => handleDelete(i)}
                className="p-2 text-neutral-400 hover:text-red-700 transition rounded-xl hover:bg-red-50 cursor-pointer"
                title="Remove Qualification"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {qualifications.length === 0 && (
          <div className="text-center py-16 text-neutral-500 text-xs bg-white rounded-2xl border border-[#eedfd8]">
            No qualifications added yet. Click &quot;Add Qualification&quot; to add your academic degrees.
          </div>
        )}
      </div>

      {/* Add Qualification Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans">
          <div className="w-full max-w-lg rounded-3xl border border-[#eedfd8] bg-white p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#eedfd8]/60 pb-3">
              <div>
                <h2 className="text-lg font-bold text-[#33110e]">
                  Add Degree / Academic Qualification
                </h2>
                <p className="text-xs text-neutral-500">
                  Record undergraduate, postgraduate, or doctoral qualifications.
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
                  Degree Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ph.D. in Computer Science & Engineering"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                  Awarding University / Institute *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Indian Institute of Technology Roorkee"
                  value={institute}
                  onChange={(e) => setInstitute(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Year of Award / Passing
                  </label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs font-mono text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Major / Specialization
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Distributed Computing"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
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
                  Save Qualification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
