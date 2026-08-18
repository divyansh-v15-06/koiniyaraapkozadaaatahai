"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Globe, X, MapPin, Plane, Building2, Sparkles, Calendar, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { MOCK_FACULTY } from "@/lib/mock-data";

interface Exposure {
  title: string;
  description: string;
}

export default function ExposuresPage() {
  const [user, setUser] = useState<any>(null);
  const [faculty, setFaculty] = useState<any>(MOCK_FACULTY[0]);
  const [items, setItems] = useState<Exposure[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

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
          const facultyExposures = (match as any).exposures || [];
          if (facultyExposures.length > 0) {
            setItems(facultyExposures);
          } else {
            setItems([
              {
                title: "International Conference on Information Technology & Distributed Systems",
                description: "Paper presentation and international collaborative research visit.",
              },
            ]);
          }
        }
      } catch {}
    } else {
      const defaultExposures = (MOCK_FACULTY[0] as any).exposures || [];
      setItems(defaultExposures);
    }
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Please provide Visit Title and Description");
      return;
    }
    const newExposure: Exposure = {
      title: title.trim(),
      description: description.trim(),
    };
    setItems([newExposure, ...items]);
    setShowModal(false);
    setTitle("");
    setDescription("");
    toast.success("Foreign visit & exposure record saved!");
  };

  const handleDelete = (index: number) => {
    setItems(items.filter((_, idx) => idx !== index));
    toast.success("Exposure record removed");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      {/* Header Banner */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <Globe className="w-6 h-6 text-[#85261e]" />
              Foreign Visits &amp; International Exposure
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2.5 py-0.5 rounded-full">
              {items.length} Visits Recorded
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            International conferences, foreign university visits, and cross-border research collaborations of{" "}
            <strong>{faculty.full_name}</strong> ({faculty.employee_code || "Faculty"}).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] text-white px-4 py-2.5 text-xs font-bold shadow-xs hover:shadow-md transition cursor-pointer"
        >
          <Plus className="h-4 w-4 text-amber-300" />
          <span>Add Visit / Exposure</span>
        </button>
      </div>

      {/* Exposures Cards Grid */}
      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="rounded-2xl border border-[#eedfd8] bg-white p-5 shadow-xs hover:border-[#85261e]/40 transition duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#fff9f6] border border-[#eedfd8] flex items-center justify-center text-[#85261e] flex-shrink-0 shadow-2xs group-hover:bg-[#33110e] group-hover:text-white transition duration-200">
                <Plane className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <h3 className="font-bold text-sm sm:text-base text-[#1c110c] group-hover:text-[#85261e] transition leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-neutral-600 leading-relaxed bg-[#fff9f6] border border-[#eedfd8]/60 rounded-xl p-2.5 italic">
                  &quot;{item.description}&quot;
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center border-t sm:border-t-0 pt-2 sm:pt-0 border-[#eedfd8]/60 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => handleDelete(i)}
                className="p-2 text-neutral-400 hover:text-red-700 transition rounded-xl hover:bg-red-50 cursor-pointer"
                title="Remove Visit"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-16 text-neutral-500 text-xs bg-white rounded-2xl border border-[#eedfd8]">
            No foreign visits or exposure records added yet. Click &quot;Add Visit / Exposure&quot; to log your international activities.
          </div>
        )}
      </div>

      {/* Add Exposure Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans">
          <div className="w-full max-w-lg rounded-3xl border border-[#eedfd8] bg-white p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#eedfd8]/60 pb-3">
              <div>
                <h2 className="text-lg font-bold text-[#33110e]">
                  Add Foreign Visit &amp; Exposure
                </h2>
                <p className="text-xs text-neutral-500">
                  Log international conferences, keynote visits, and foreign university collaborations.
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
                  Visit Destination &amp; Event Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. London, UK • Visited Oxford University for ICCIT 2014"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                  Nature of Exposure / Funding / Details *
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g. Paper presentation, Session Chair, Supported by Cisco Networking Academy & UNDP"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-3 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e] leading-relaxed"
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
                  Save Exposure Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
