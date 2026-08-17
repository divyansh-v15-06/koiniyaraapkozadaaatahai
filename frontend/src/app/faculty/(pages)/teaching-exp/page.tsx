"use client";

import { useState } from "react";
import { Plus, Trash2, Briefcase, X } from "lucide-react";
import { toast } from "sonner";

export default function TeachingExperiencePage() {
  const [items, setItems] = useState([
    { position: "Professor", organization: "NIT Hamirpur", start_date: "2020", end_date: "Present" },
    { position: "Associate Professor", organization: "NIT Hamirpur", start_date: "2015", end_date: "2020" },
    { position: "Assistant Professor", organization: "NIT Jalandhar", start_date: "2010", end_date: "2015" },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [position, setPosition] = useState("");
  const [organization, setOrganization] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("Present");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!position || !organization) {
      toast.error("Position and Organization are required");
      return;
    }
    setItems([...items, { position, organization, start_date: start, end_date: end }]);
    setShowModal(false);
    setPosition("");
    setOrganization("");
    toast.success("Teaching experience recorded!");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Teaching Experience</h1>
          <p className="mt-1 text-sm text-muted-foreground">Academic appointments and instructional tenures.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition"
        >
          <Plus className="h-4 w-4" /> Add Experience
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm divide-y divide-border/60">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-5 hover:bg-accent/20 transition">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-sm">{item.position}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.organization} • {item.start_date} – {item.end_date}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setItems(items.filter((_, idx) => idx !== i));
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
            <h2 className="text-lg font-bold text-foreground mb-4">Add Teaching Experience</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Designation / Role</label>
                <input type="text" required value={position} onChange={(e) => setPosition(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Institution / Organization</label>
                <input type="text" required value={organization} onChange={(e) => setOrganization(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Start Year</label>
                  <input type="text" value={start} onChange={(e) => setStart(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">End Year</label>
                  <input type="text" value={end} onChange={(e) => setEnd(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
                </div>
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
