"use client";

import { useState } from "react";
import { Plus, Trash2, Building, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function AdminExpPage() {
  const [items, setItems] = useState([
    { role: "Head of Department (CSE)", duration: "2023 - Present", remarks: "Administrative oversight of academic and research activities" },
    { role: "Faculty In-Charge, Cloud Computing Lab", duration: "2018 - 2023", remarks: "Lab setup and procurement" },
  ]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Administrative Experience</h1>
      <p className="mt-1 text-sm text-muted-foreground">Departmental and institute-level administrative appointments.</p>
      <div className="rounded-2xl border border-border bg-card shadow-sm divide-y divide-border/60">
        {items.map((it, i) => (
          <div key={i} className="flex items-center justify-between p-5">
            <div>
              <h3 className="font-bold text-foreground text-sm">{it.role}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{it.duration} • {it.remarks}</p>
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
