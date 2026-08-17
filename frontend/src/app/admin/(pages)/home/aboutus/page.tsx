"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";

export default function AdminAboutUsPage() {
  const [about, setAbout] = useState(
    "The Department of Computer Science & Engineering offers undergraduate, postgraduate and doctoral programmes with emphasis on contemporary computing research."
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Department Overview CMS</h1>
      <p className="mt-1 text-sm text-muted-foreground">Edit the department summary and mission statement displayed publicly.</p>
      <form onSubmit={(e) => { e.preventDefault(); toast.success("Department text updated!"); }} className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <textarea rows={6} value={about} onChange={(e) => setAbout(e.target.value)} className="w-full rounded-xl border border-input bg-background p-3 text-sm" />
        <button type="submit" className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground">
          <Save className="h-4 w-4" /> Save CMS Changes
        </button>
      </form>
    </div>
  );
}
