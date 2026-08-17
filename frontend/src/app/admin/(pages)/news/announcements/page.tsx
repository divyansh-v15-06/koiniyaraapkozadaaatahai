"use client";

import { useState } from "react";
import { Plus, Trash2, Megaphone, X } from "lucide-react";
import { toast } from "sonner";
import { MOCK_ANNOUNCEMENTS } from "@/lib/mock-data";
import { Announcement } from "@/lib/types";

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error("Announcement title is required");
      return;
    }
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      department_id: "22222222-2222-2222-2222-222222222222",
      title,
      body,
      publish_date: new Date().toISOString().split("T")[0],
      expiry_date: "2026-12-31",
      is_private: false,
    };
    setAnnouncements([newAnn, ...announcements]);
    setShowModal(false);
    setTitle("");
    setBody("");
    toast.success("Announcement published successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Announcements &amp; Circulars</h1>
          <p className="mt-1 text-sm text-muted-foreground">Publish public notices and academic circulars.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-sm"
        >
          <Plus className="h-4 w-4" /> New Announcement
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((ann) => (
          <div key={ann.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-muted-foreground">Published: {ann.publish_date}</span>
              <h3 className="mt-1 text-base font-bold text-foreground">{ann.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{ann.body}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setAnnouncements(announcements.filter((x) => x.id !== ann.id));
                toast.success("Announcement deleted");
              }}
              className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-foreground mb-4">Publish Announcement</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Title</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Notice Body</label>
                <textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-xl border border-border px-4 py-2 text-xs font-semibold">Cancel</button>
                <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Publish</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
