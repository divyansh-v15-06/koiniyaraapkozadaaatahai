"use client";

import { useState } from "react";
import { Mic2, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function ExpertTalksPage() {
  const [items, setItems] = useState([
    { topic: "Zero-Trust Cloud Architectures in Critical Infrastructure", host: "IIT Roorkee", date: "March 2024" },
    { topic: "Decentralized AI & Post-Quantum Cryptography", host: "IEEE Delhi Section", date: "January 2024" },
  ]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Invited Talks &amp; Lectures</h1>
      <p className="mt-1 text-sm text-muted-foreground">Keynote addresses, expert guest lectures, and panel discussions.</p>
      <div className="rounded-2xl border border-border bg-card shadow-sm divide-y divide-border/60">
        {items.map((it, i) => (
          <div key={i} className="flex items-center justify-between p-5">
            <div>
              <h3 className="font-bold text-foreground text-sm">{it.topic}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Invited by: {it.host} • {it.date}</p>
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
