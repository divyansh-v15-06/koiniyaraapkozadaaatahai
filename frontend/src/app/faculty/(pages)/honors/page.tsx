"use client";

import { useState } from "react";
import { Plus, Trash2, Award, X } from "lucide-react";
import { toast } from "sonner";

export default function HonorsPage() {
  const [honors, setHonors] = useState([
    { title: "SERB Early Career Research Award", awarding_body: "Department of Science & Technology", year: 2022 },
    { title: "Best Research Paper Award", awarding_body: "IEEE International Conference on Cloud Computing", year: 2023 },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [year, setYear] = useState(2024);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) {
      toast.error("Title and Awarding Body required");
      return;
    }
    setHonors([...honors, { title, awarding_body: body, year: Number(year) }]);
    setShowModal(false);
    setTitle("");
    setBody("");
    toast.success("Award/Honor added!");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Honors &amp; Awards</h1>
          <p className="mt-1 text-sm text-muted-foreground">National &amp; international recognitions, fellowships, and best paper awards.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition"
        >
          <Plus className="h-4 w-4" /> Add Honor
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm divide-y divide-border/60">
        {honors.map((h, i) => (
          <div key={i} className="flex items-center justify-between p-5 hover:bg-accent/20 transition">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-2/10 text-chart-2">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-sm">{h.title}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{h.awarding_body} • {h.year}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setHonors(honors.filter((_, idx) => idx !== i));
                toast.success("Removed");
              }}
              className="p-2 text-muted-foreground hover:text-destructive rounded-lg"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-foreground mb-4">Add Award / Honor</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Award Title</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Awarding Body / Organization</label>
                <input type="text" required value={body} onChange={(e) => setBody(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Year</label>
                <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-xl border border-border px-4 py-2 text-xs font-semibold">Cancel</button>
                <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
