"use client";

import { useState } from "react";
import { Plus, Trash2, FlaskConical } from "lucide-react";
import { toast } from "sonner";
import { formatINR } from "@/lib/utils";

export default function FacultyConsultanciesPage() {
  const [items, setItems] = useState([
    { title: "Smart Grid Cyber Vulnerability Assessment", client: "HPSEBL", amount: 1800000, year: 2024 },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Consultancy Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">Industrial testing, audits, and corporate technology advisory.</p>
        </div>
      </div>
      <div className="space-y-4">
        {items.map((it, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-bold text-foreground text-base">{it.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Client: {it.client} • {it.year}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono font-bold text-primary">{formatINR(it.amount)}</span>
              <button onClick={() => { setItems(items.filter((_, idx) => idx !== i)); toast.success("Deleted"); }} className="p-2 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
