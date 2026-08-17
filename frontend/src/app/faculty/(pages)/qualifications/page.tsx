"use client";

import { useState } from "react";
import { Plus, Trash2, GraduationCap, X } from "lucide-react";
import { toast } from "sonner";
import { MOCK_FACULTY } from "@/lib/mock-data";

export default function QualificationsPage() {
  const [qualifications, setQualifications] = useState(MOCK_FACULTY[0].qualifications);
  const [showModal, setShowModal] = useState(false);
  const [degree, setDegree] = useState("");
  const [institute, setInstitute] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!degree || !institute) {
      toast.error("Degree and Institute are required");
      return;
    }
    setQualifications([...qualifications, { degree, institute, year: Number(year) }]);
    setShowModal(false);
    setDegree("");
    setInstitute("");
    toast.success("Qualification added successfully!");
  };

  const handleDelete = (index: number) => {
    setQualifications(qualifications.filter((_: any, i: number) => i !== index));
    toast.success("Qualification removed");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Educational Qualifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your degrees, passing years, and awarding institutes for your CV.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition"
        >
          <Plus className="h-4 w-4" /> Add Qualification
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm divide-y divide-border/60">
        {qualifications.map((q: any, i: number) => (
          <div key={i} className="flex items-center justify-between p-5 hover:bg-accent/20 transition">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-sm">{q.degree}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{q.institute} • Awarded {q.year}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleDelete(i)}
              className="p-2 text-muted-foreground hover:text-destructive transition rounded-lg hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Add Degree / Qualification</h2>
              <button type="button" onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Degree Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ph.D. in Computer Science"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  University / Institute
                </label>
                <input
                  type="text"
                  placeholder="e.g. IIT Roorkee"
                  value={institute}
                  onChange={(e) => setInstitute(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Passing Year
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
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
