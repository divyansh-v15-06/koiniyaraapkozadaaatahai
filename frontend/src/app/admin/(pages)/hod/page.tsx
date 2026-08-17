"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";

export default function AdminHodPage() {
  const [name, setName] = useState("Dr. Rajesh Sharma");
  const [msg, setMsg] = useState("Welcome to the Department of Computer Science & Engineering at NIT Hamirpur...");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">HOD Message CMS</h1>
      <form onSubmit={(e) => { e.preventDefault(); toast.success("HOD message saved!"); }} className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">HOD Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Message Content</label>
          <textarea rows={6} value={msg} onChange={(e) => setMsg(e.target.value)} className="w-full rounded-xl border border-input bg-background p-3 text-sm" />
        </div>
        <button type="submit" className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground">
          <Save className="h-4 w-4" /> Save Message
        </button>
      </form>
    </div>
  );
}
