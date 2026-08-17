"use client";

import { useState } from "react";
import { Plus, Trash2, HelpCircle } from "lucide-react";
import { toast } from "sonner";

export default function AdminQnaPage() {
  const [faqs, setFaqs] = useState([
    { q: "How to apply for Ph.D. admissions?", a: "Ph.D. admissions are held bi-annually via the central portal." },
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Frequently Asked Questions (FAQ) CMS</h1>
      <div className="space-y-4">
        {faqs.map((f, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-start justify-between">
            <div>
              <p className="font-bold text-foreground text-sm">{f.q}</p>
              <p className="text-xs text-muted-foreground mt-1">{f.a}</p>
            </div>
            <button onClick={() => { setFaqs(faqs.filter((_, idx) => idx !== i)); toast.success("FAQ deleted"); }} className="p-2 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
