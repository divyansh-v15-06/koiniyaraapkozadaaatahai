"use client";

import { useState } from "react";
import { Plus, Trash2, Lightbulb, X } from "lucide-react";
import { toast } from "sonner";
import { formatINR } from "@/lib/utils";
import { MOCK_PROJECTS } from "@/lib/mock-data";
import { Project } from "@/lib/types";

export default function FacultyProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [agency, setAgency] = useState("");
  const [budget, setBudget] = useState(2500000);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !agency) {
      toast.error("Title and Funding Agency are required");
      return;
    }
    const newPrj: Project = {
      id: `prj-${Date.now()}`,
      title,
      funding_agency: agency,
      status: "Ongoing",
      project_type: "Sponsored R&D",
      start_date: new Date().toISOString().split("T")[0],
      end_date: "2027-03-31",
      total_sanctioned_amount: Number(budget),
      total_amount_received: Number(budget) / 2,
      scheme: "Core Research Grant",
      reference_number: `CRG/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setProjects([newPrj, ...projects]);
    setShowModal(false);
    setTitle("");
    setAgency("");
    toast.success("R&D Project recorded!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Sponsored R&amp;D Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track your sponsored research grants and funding.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition"
        >
          <Plus className="h-4 w-4" /> Add Project Grant
        </button>
      </div>

      <div className="space-y-4">
        {projects.map((p) => (
          <div key={p.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:border-primary/40 transition">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="rounded bg-blue-500/10 px-2.5 py-0.5 text-xs font-bold text-blue-600">
                  {p.status}
                </span>
                <h3 className="mt-2 text-base font-bold text-foreground">{p.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">Agency: {p.funding_agency} • Ref: {p.reference_number}</p>
              </div>
              <div className="text-right sm:self-center">
                <p className="text-base font-bold text-primary font-mono">{formatINR(p.total_sanctioned_amount)}</p>
                <button
                  type="button"
                  onClick={() => {
                    setProjects(projects.filter((x) => x.id !== p.id));
                    toast.success("Project removed");
                  }}
                  className="mt-1 text-xs text-destructive hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-foreground mb-4">Add R&amp;D Project</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Project Title</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Funding Agency</label>
                <input type="text" required placeholder="e.g. DST-SERB, MeitY" value={agency} onChange={(e) => setAgency(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Sanctioned Budget (INR)</label>
                <input type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm font-mono" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-accent">Cancel</button>
                <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90">Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
