"use client";

import { useState } from "react";
import { FolderOpen, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

export default function AdminDocsPage() {
  const [docs, setDocs] = useState([
    { title: "B.Tech CSE 2024-2028 Ordinance & Syllabus", size: "2.4 MB", uploaded: "2024-07-15" },
    { title: "Department Academic Calendar Autumn 2026", size: "840 KB", uploaded: "2026-06-01" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Syllabus &amp; Document Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage PDF curriculum and institute calendars.</p>
        </div>
        <button onClick={() => toast.info("Document upload ready")} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground">
          <Upload className="h-4 w-4" /> Upload Document
        </button>
      </div>
      <div className="rounded-2xl border border-border bg-card shadow-sm divide-y divide-border/60">
        {docs.map((d, i) => (
          <div key={i} className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <FolderOpen className="h-5 w-5 text-primary" />
              <div>
                <p className="font-bold text-foreground text-sm">{d.title}</p>
                <p className="text-xs text-muted-foreground">{d.size} • Uploaded {d.uploaded}</p>
              </div>
            </div>
            <button onClick={() => { setDocs(docs.filter((_, idx) => idx !== i)); toast.success("Document deleted"); }} className="p-2 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
