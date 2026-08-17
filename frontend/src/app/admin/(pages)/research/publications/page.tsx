"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { MOCK_PUBLICATIONS } from "@/lib/mock-data";

export default function AdminPubsPage() {
  const [pubs, setPubs] = useState(MOCK_PUBLICATIONS);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Department Research Publications</h1>
      <p className="mt-1 text-sm text-muted-foreground">Oversight and review of all department research output.</p>
      <div className="space-y-4">
        {pubs.map((p) => (
          <div key={p.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-start justify-between">
            <div>
              <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">{p.publication_type}</span>
              <h3 className="font-bold text-foreground text-base mt-1.5">{p.title}</h3>
              <p className="text-xs text-muted-foreground">{p.journal_or_conference_name} • {p.year}</p>
            </div>
            <button onClick={() => { setPubs(pubs.filter((x) => x.id !== p.id)); toast.success("Publication record removed"); }} className="p-2 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
