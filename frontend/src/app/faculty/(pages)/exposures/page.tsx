"use client";

import { useState } from "react";
import { Globe, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function ExposuresPage() {
  const [items, setItems] = useState([
    { title: "Visiting Researcher at National University of Singapore (NUS)", period: "June - July 2023", nature: "International Academic Exchange" },
  ]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">National &amp; International Exposure</h1>
      <p className="mt-1 text-sm text-muted-foreground">Academic visits, keynote visits, and international research collaborations.</p>
      <div className="rounded-2xl border border-border bg-card shadow-sm divide-y divide-border/60">
        {items.map((it, i) => (
          <div key={i} className="flex items-center justify-between p-5">
            <div>
              <h3 className="font-bold text-foreground text-sm">{it.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{it.period} • {it.nature}</p>
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
