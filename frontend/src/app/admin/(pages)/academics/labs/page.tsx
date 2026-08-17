"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { MOCK_LABS } from "@/lib/mock-data";

export default function AdminLabsPage() {
  const [labs, setLabs] = useState(MOCK_LABS);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Department Laboratories</h1>
      <div className="space-y-4">
        {labs.map((l) => (
          <div key={l.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-start justify-between">
            <div>
              <h3 className="font-bold text-foreground text-base">{l.name}</h3>
              <p className="text-xs text-muted-foreground">{l.location} • In-Charge: {l.head} • {l.equipment_count} Equipment units</p>
            </div>
            <button onClick={() => { setLabs(labs.filter((x) => x.id !== l.id)); toast.success("Lab removed"); }} className="p-2 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
