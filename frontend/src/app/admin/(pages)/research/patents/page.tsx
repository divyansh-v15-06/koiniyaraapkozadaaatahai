"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { MOCK_PATENTS } from "@/lib/mock-data";

export default function AdminPatentsPage() {
  const [patents, setPatents] = useState(MOCK_PATENTS);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Department Patents &amp; IP</h1>
      <p className="mt-1 text-sm text-muted-foreground">Review and manage department intellectual property filings.</p>
      <div className="space-y-4">
        {patents.map((p) => (
          <div key={p.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-start justify-between">
            <div>
              <span className="rounded bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-xs font-bold">{p.status}</span>
              <h3 className="font-bold text-foreground text-base mt-1.5">{p.title}</h3>
              <p className="text-xs text-muted-foreground font-mono">App No: {p.application_number}</p>
            </div>
            <button onClick={() => { setPatents(patents.filter((x) => x.id !== p.id)); toast.success("Deleted"); }} className="p-2 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
