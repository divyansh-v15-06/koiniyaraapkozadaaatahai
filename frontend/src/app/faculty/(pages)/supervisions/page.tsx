"use client";

import { useState } from "react";
import { Plus, Trash2, Users } from "lucide-react";
import { toast } from "sonner";

export default function FacultySupervisionsPage() {
  const [items, setItems] = useState([
    { scholar: "Vikas Malhotra", type: "Ph.D. Thesis", topic: "Energy-Efficient Resource Allocation in Edge-Fog Clusters", status: "Ongoing", year: 2021 },
    { scholar: "Divya Nambiar", type: "M.Tech Thesis", topic: "Transformer Architectures for Medical CT", status: "Completed", year: 2024 },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Research Supervisions</h1>
          <p className="mt-1 text-sm text-muted-foreground">Ph.D., M.Tech, and undergraduate major project guidance.</p>
        </div>
      </div>
      <div className="space-y-4">
        {items.map((it, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">{it.type}</span>
                <span className="text-xs text-muted-foreground">• Enrolled {it.year}</span>
              </div>
              <h3 className="mt-2 text-base font-bold text-foreground">{it.scholar}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Topic: {it.topic}</p>
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
