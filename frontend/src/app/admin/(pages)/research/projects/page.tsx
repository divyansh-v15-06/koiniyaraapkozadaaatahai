"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { formatINR } from "@/lib/utils";
import { MOCK_PROJECTS } from "@/lib/mock-data";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState(MOCK_PROJECTS);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Department Sponsored Projects</h1>
      <p className="mt-1 text-sm text-muted-foreground">Sanctioned research grants and funding agency oversight.</p>
      <div className="space-y-4">
        {projects.map((p) => (
          <div key={p.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-start justify-between">
            <div>
              <span className="rounded bg-blue-500/10 text-blue-600 px-2 py-0.5 text-xs font-bold">{p.status}</span>
              <h3 className="font-bold text-foreground text-base mt-1.5">{p.title}</h3>
              <p className="text-xs text-muted-foreground">Agency: {p.funding_agency} • Budget: {formatINR(p.total_sanctioned_amount)}</p>
            </div>
            <button onClick={() => { setProjects(projects.filter((x) => x.id !== p.id)); toast.success("Deleted"); }} className="p-2 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
