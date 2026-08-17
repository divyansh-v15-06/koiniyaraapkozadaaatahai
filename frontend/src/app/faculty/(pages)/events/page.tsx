"use client";

import { useState } from "react";
import { Plus, Trash2, Calendar } from "lucide-react";
import { toast } from "sonner";

export default function FacultyEventsPage() {
  const [items, setItems] = useState([
    { title: "IEEE International Conference on Advanced Computing (ICACIC 2026)", role: "General Co-Chair", dates: "November 2026" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Events Organized</h1>
          <p className="mt-1 text-sm text-muted-foreground">Conferences, STCs, FDPs, and workshops coordinated.</p>
        </div>
      </div>
      <div className="space-y-4">
        {items.map((it, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center justify-between">
            <div>
              <span className="rounded bg-secondary px-2.5 py-0.5 text-xs font-semibold">{it.role}</span>
              <h3 className="mt-2 text-base font-bold text-foreground">{it.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{it.dates}</p>
            </div>
            <button onClick={() => { setItems(items.filter((_, idx) => idx !== i)); toast.success("Deleted"); }} className="p-2 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
