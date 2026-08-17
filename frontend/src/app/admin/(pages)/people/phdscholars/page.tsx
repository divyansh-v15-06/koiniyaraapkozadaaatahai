"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { MOCK_PHD_SCHOLARS } from "@/lib/mock-data";

export default function AdminPhdPage() {
  const [scholars, setScholars] = useState(MOCK_PHD_SCHOLARS);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Ph.D. Scholars Management</h1>
      <p className="mt-1 text-sm text-muted-foreground">Doctoral enrollment and thesis status oversight.</p>
      <div className="rounded-2xl border border-border bg-card shadow-sm divide-y divide-border/60">
        {scholars.map((sch) => (
          <div key={sch.id} className="flex items-center justify-between p-5">
            <div>
              <span className="font-mono text-xs font-bold text-primary">{sch.enrollment_number}</span>
              <p className="font-bold text-foreground text-sm mt-0.5">{sch.name}</p>
              <p className="text-xs text-muted-foreground">Topic: {sch.topic}</p>
            </div>
            <button onClick={() => { setScholars(scholars.filter((x) => x.id !== sch.id)); toast.success("Scholar deleted"); }} className="p-2 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
