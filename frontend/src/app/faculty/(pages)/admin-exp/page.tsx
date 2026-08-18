"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, ShieldCheck, X, Building2, Calendar, Sparkles, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";
import { MOCK_FACULTY } from "@/lib/mock-data";

interface AdminRole {
  position: string;
  organization: string;
  start_date: string;
  end_date: string;
  full_start?: string;
  full_end?: string;
}

export default function AdminExpPage() {
  const [user, setUser] = useState<any>(null);
  const [faculty, setFaculty] = useState<any>(MOCK_FACULTY[0]);
  const [items, setItems] = useState<AdminRole[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [position, setPosition] = useState("");
  const [organization, setOrganization] = useState("National Institute of Technology Hamirpur");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("Present");
  const [isCurrent, setIsCurrent] = useState(true);

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
          const adminRoles =
            (match as any).admin_experiences ||
            (match as any).administrative_experiences ||
            [];
          if (adminRoles.length > 0) {
            setItems(adminRoles);
          } else {
            setItems([
              {
                position: "Head of the Department (CSE)",
                organization: "Department of Computer Science & Engineering, NIT Hamirpur",
                start_date: "2024",
                end_date: "Present",
                full_start: "2024-04-01",
                full_end: "Present",
              },
              {
                position: "Faculty In-Charge (Departmental Laboratory)",
                organization: "National Institute of Technology Hamirpur",
                start_date: "2020",
                end_date: "2024",
                full_start: "2020-08-01",
                full_end: "2024-03-31",
              },
            ]);
          }
        }
      } catch {}
    } else {
      const defaultRoles =
        (MOCK_FACULTY[0] as any).admin_experiences ||
        (MOCK_FACULTY[0] as any).administrative_experiences ||
        [];
      setItems(defaultRoles);
    }
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!position.trim() || !organization.trim() || !start.trim()) {
      toast.error("Please provide Role / Position, Organization, and Start Year");
      return;
    }
    const newRole: AdminRole = {
      position: position.trim(),
      organization: organization.trim(),
      start_date: start.trim(),
      end_date: isCurrent ? "Present" : end.trim() || "Present",
      full_start: start.trim(),
      full_end: isCurrent ? "Present" : end.trim() || "Present",
    };
    setItems([newRole, ...items]);
    setShowModal(false);
    setPosition("");
    setOrganization("National Institute of Technology Hamirpur");
    setStart("");
    setEnd("Present");
    setIsCurrent(true);
    toast.success("Administrative appointment record saved!");
  };

  const handleDelete = (index: number) => {
    setItems(items.filter((_, idx) => idx !== index));
    toast.success("Administrative role record removed");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      {/* Header Banner */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#85261e]" />
              Administrative Roles &amp; Responsibilities
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2.5 py-0.5 rounded-full">
              {items.length} Roles Recorded
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Departmental, institutional, and statutory administrative appointments held by{" "}
            <strong>{faculty.full_name}</strong> ({faculty.employee_code || "Faculty"}).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] text-white px-4 py-2.5 text-xs font-bold shadow-xs hover:shadow-md transition cursor-pointer"
        >
          <Plus className="h-4 w-4 text-amber-300" />
          <span>Add Admin Role</span>
        </button>
      </div>

      {/* Administrative Roles Cards Grid */}
      <div className="space-y-3">
        {items.map((item, i) => {
          const isPresent = item.end_date.toLowerCase() === "present";
          return (
            <div
              key={i}
              className="rounded-2xl border border-[#eedfd8] bg-white p-5 shadow-xs hover:border-[#85261e]/40 transition duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#fff9f6] border border-[#eedfd8] flex items-center justify-center text-[#85261e] flex-shrink-0 shadow-2xs group-hover:bg-[#33110e] group-hover:text-white transition duration-200">
                  <ShieldCheck className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-[#1c110c] group-hover:text-[#85261e] transition">
                      {item.position}
                    </h3>
                    <span
                      className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                        isPresent
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : "bg-[#fff9f6] text-[#33110e] border-[#eedfd8]"
                      }`}
                    >
                      {isPresent ? "Active / Present" : `${item.start_date} – ${item.end_date}`}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-700 font-medium flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#85261e]" />
                    {item.organization}
                  </p>

                  {(item.full_start || item.full_end) && (
                    <p className="text-[11px] text-neutral-500 flex items-center gap-1 pt-0.5">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      <span>
                        Exact Tenure: {item.full_start || item.start_date} to{" "}
                        {item.full_end || item.end_date}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center border-t sm:border-t-0 pt-2 sm:pt-0 border-[#eedfd8]/60 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => handleDelete(i)}
                  className="p-2 text-neutral-400 hover:text-red-700 transition rounded-xl hover:bg-red-50 cursor-pointer"
                  title="Remove Appointment"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="text-center py-16 text-neutral-500 text-xs bg-white rounded-2xl border border-[#eedfd8]">
            No administrative experience records found. Click &quot;Add Admin Role&quot; to log your institutional responsibilities.
          </div>
        )}
      </div>

      {/* Add Role Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans">
          <div className="w-full max-w-lg rounded-3xl border border-[#eedfd8] bg-white p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#eedfd8]/60 pb-3">
              <div>
                <h2 className="text-lg font-bold text-[#33110e]">
                  Add Administrative Role / Position
                </h2>
                <p className="text-xs text-neutral-500">
                  Log departmental, institutional, or statutory appointments.
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
                  Administrative Position / Role *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Head of Department, Warden, Nodal Officer, Faculty In-charge"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                  Organization / Cell / Division *
                </label>
                <input
                  type="text"
                  placeholder="e.g. National Institute of Technology Hamirpur"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Start Year / Date *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2020 or 2020-04-15"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    required
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs font-mono text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e]">
                      End Year / Date
                    </label>
                    <label className="flex items-center gap-1 text-[11px] font-semibold text-[#85261e] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isCurrent}
                        onChange={(e) => setIsCurrent(e.target.checked)}
                        className="rounded border-[#eedfd8] text-[#85261e] focus:ring-[#85261e]"
                      />
                      <span>Present (Active)</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    disabled={isCurrent}
                    placeholder="e.g. 2024"
                    value={isCurrent ? "Present" : end}
                    onChange={(e) => setEnd(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] disabled:bg-neutral-100 disabled:text-neutral-500 px-3.5 py-2.5 text-xs font-mono text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
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
                  Save Administrative Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
