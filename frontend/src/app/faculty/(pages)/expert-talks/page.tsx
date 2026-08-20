"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Mic2, X, Building2, Calendar, Sparkles, BookOpen, Clock, Presentation } from "lucide-react";
import { toast } from "sonner";
import { MOCK_FACULTY } from "@/lib/mock-data";
import { getStoredData, setStoredData } from "@/lib/faculty-storage";

interface ExpertTalk {
  title: string;
  venue: string;
  date?: string;
  description?: string;
}

export default function ExpertTalksPage() {
  const [user, setUser] = useState<any>(null);
  const [faculty, setFaculty] = useState<any>(MOCK_FACULTY[0]);
  const [items, setItems] = useState<ExpertTalk[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

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

    const facultyTalks = (activeFaculty as any).expert_talks || [];
    const fallback =
      facultyTalks.length > 0
        ? facultyTalks
        : [
            {
              title: "Emerging Trends in Artificial Intelligence and Cloud Systems",
              venue: "National Institute of Technology Hamirpur",
              date: "2024-04-12",
              description: "Keynote lecture in One-Week Faculty Development Programme.",
            },
            {
              title: "Wireless Sensor Networks & Distributed Security",
              venue: "IEEE Delhi Section & IIT Roorkee",
              date: "2023-11-20",
              description: "Invited expert session for postgraduate researchers.",
            },
          ];

    const stored = getStoredData<ExpertTalk>(activeFaculty, "expert_talks", fallback);
    setItems(stored);
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !venue.trim()) {
      toast.error("Please provide Talk Title and Host Institution / Venue");
      return;
    }
    const newTalk: ExpertTalk = {
      title: title.trim(),
      venue: venue.trim(),
      date: date.trim() || undefined,
      description: description.trim() || undefined,
    };
    const updated = [newTalk, ...items];
    setItems(updated);
    setStoredData(faculty, "expert_talks", updated);
    setShowModal(false);
    setTitle("");
    setVenue("");
    setDate("");
    setDescription("");
    toast.success("Expert talk & keynote lecture saved and persisted!");
  };

  const handleDelete = (index: number) => {
    const updated = items.filter((_, idx) => idx !== index);
    setItems(updated);
    setStoredData(faculty, "expert_talks", updated);
    toast.success("Talk record removed and storage updated");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      {/* Header Banner */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <Mic2 className="w-6 h-6 text-[#85261e]" />
              Invited Talks, Keynotes &amp; Guest Lectures
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2.5 py-0.5 rounded-full">
              {items.length} Talks Recorded
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Keynote addresses, FDP/STC sessions, and invited expert lectures delivered by{" "}
            <strong>{faculty.full_name}</strong> ({faculty.employee_code || "Faculty"}).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] text-white px-4 py-2.5 text-xs font-bold shadow-xs hover:shadow-md transition cursor-pointer"
        >
          <Plus className="h-4 w-4 text-amber-300" />
          <span>Add Invited Talk</span>
        </button>
      </div>

      {/* Talks Cards Grid */}
      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="rounded-2xl border border-[#eedfd8] bg-white p-5 shadow-xs hover:border-[#85261e]/40 transition duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#fff9f6] border border-[#eedfd8] flex items-center justify-center text-[#85261e] flex-shrink-0 shadow-2xs group-hover:bg-[#33110e] group-hover:text-amber-300 transition duration-200">
                <Presentation className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-sm sm:text-base text-[#1c110c] group-hover:text-[#85261e] transition leading-snug">
                    {item.title}
                  </h3>
                  {item.date && (
                    <span className="bg-[#fff9f6] text-[#33110e] border border-[#eedfd8] text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                      {item.date}
                    </span>
                  )}
                </div>

                <p className="text-xs text-neutral-700 font-medium flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#85261e] flex-shrink-0" />
                  <span>Hosted at: <strong>{item.venue}</strong></span>
                </p>

                {item.description && (
                  <p className="text-xs text-neutral-600 leading-relaxed bg-[#fff9f6] border border-[#eedfd8]/60 rounded-xl p-2.5 italic">
                    &quot;{item.description}&quot;
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center border-t sm:border-t-0 pt-2 sm:pt-0 border-[#eedfd8]/60 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => handleDelete(i)}
                className="p-2 text-neutral-400 hover:text-red-700 transition rounded-xl hover:bg-red-50 cursor-pointer"
                title="Remove Talk"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-16 text-neutral-500 text-xs bg-white rounded-2xl border border-[#eedfd8]">
            No invited talks or keynote addresses recorded yet. Click &quot;Add Invited Talk&quot; to log your sessions.
          </div>
        )}
      </div>

      {/* Add Talk Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans">
          <div className="w-full max-w-lg rounded-3xl border border-[#eedfd8] bg-white p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#eedfd8]/60 pb-3">
              <div>
                <h2 className="text-lg font-bold text-[#33110e]">
                  Add Invited Talk / Keynote Address
                </h2>
                <p className="text-xs text-neutral-500">
                  Log guest lectures, FDP sessions, and conference keynote addresses.
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
                  Talk / Keynote Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Artificial Intelligence & Cyber Threat Intelligence (Keynote)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                  Host Institution / Venue / Department *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Guru Jambheshwar University of Science and Technology, Hisar"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                  Date / Session (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2024-03-18 or 2024"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs font-mono text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                  Event / FDP / STC Description
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. One-Week Faculty Development Programme on Artificial Intelligence & Data Analytics"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  Save Talk Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
