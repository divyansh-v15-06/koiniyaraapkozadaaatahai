"use client";

import { useState } from "react";
import { Plus, Trash2, Shield, X } from "lucide-react";
import { toast } from "sonner";
import { MOCK_PATENTS } from "@/lib/mock-data";
import { Patent } from "@/lib/types";

export default function FacultyPatentsPage() {
  const [patents, setPatents] = useState<Patent[]>(MOCK_PATENTS);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [appNo, setAppNo] = useState("");
  const [status, setStatus] = useState<"Filed" | "Published" | "Granted" | "Abandoned">("Filed");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error("Patent title is required");
      return;
    }
    const newPatent: Patent = {
      id: `pat-${Date.now()}`,
      title,
      application_number: appNo,
      patent_number: status === "Granted" ? `IN ${Math.floor(100000 + Math.random() * 900000)}` : "",
      status,
      filing_date: new Date().toISOString().split("T")[0],
      grant_date: "",
      country: "India",
      patent_office: "Indian Patent Office (New Delhi)",
      abstract_text: "",
    };
    setPatents([newPatent, ...patents]);
    setShowModal(false);
    setTitle("");
    setAppNo("");
    toast.success("Patent entry created!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Patents &amp; Intellectual Property</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your granted and filed patents.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition"
        >
          <Plus className="h-4 w-4" /> Add Patent
        </button>
      </div>

      <div className="space-y-4">
        {patents.map((p) => (
          <div key={p.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:border-primary/40 transition">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className={`rounded px-2.5 py-0.5 text-xs font-bold ${p.status === "Granted" ? "bg-emerald-500/10 text-emerald-600" : "bg-blue-500/10 text-blue-600"}`}>
                  {p.status}
                </span>
                <h3 className="mt-2 text-base font-bold text-foreground">{p.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground font-mono">App No: {p.application_number} {p.patent_number && `• Patent No: ${p.patent_number}`}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPatents(patents.filter((x) => x.id !== p.id));
                  toast.success("Patent deleted");
                }}
                className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-foreground mb-4">Add Patent Entry</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Patent Title</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Application Number</label>
                <input type="text" value={appNo} onChange={(e) => setAppNo(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm font-mono" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Status</label>
                <select value={status} onChange={(e: any) => setStatus(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">
                  <option value="Filed">Filed</option>
                  <option value="Published">Published</option>
                  <option value="Granted">Granted</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-accent">Cancel</button>
                <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90">Save Patent</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
