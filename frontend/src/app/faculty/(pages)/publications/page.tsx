"use client";

import { useState } from "react";
import { Plus, Trash2, BookOpen, X, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { MOCK_PUBLICATIONS } from "@/lib/mock-data";
import { Publication } from "@/lib/types";

export default function FacultyPublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>(MOCK_PUBLICATIONS);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [pubType, setPubType] = useState<"JOURNAL" | "CONFERENCE" | "BOOK" | "BOOK_CHAPTER">("JOURNAL");
  const [venue, setVenue] = useState("");
  const [year, setYear] = useState(2025);
  const [doi, setDoi] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !venue) {
      toast.error("Title and Venue are required");
      return;
    }
    const newPub: Publication = {
      id: `p-${Date.now()}`,
      title,
      publication_type: pubType,
      journal_or_conference_name: venue,
      volume: "1",
      issue: "1",
      pages: "1-10",
      year: Number(year),
      month: 1,
      doi,
      issn_isbn: "",
      impact_factor: 0,
      is_sci: false,
      is_scopus: true,
      is_peer_reviewed: true,
      abstract_text: "",
      publisher: "",
      authors: [
        { id: "a-me", publication_id: `p-${Date.now()}`, faculty_id: "f1", author_name: "Dr. Rajesh Sharma", author_order: 1, is_corresponding: true }
      ]
    };
    setPublications([newPub, ...publications]);
    setShowModal(false);
    setTitle("");
    setVenue("");
    setDoi("");
    toast.success("Publication recorded successfully!");
  };

  const handleDelete = (id: string) => {
    setPublications(publications.filter((p) => p.id !== id));
    toast.success("Publication removed");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Publications Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Submit new research papers and manage indexed journal/conference publications.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition"
        >
          <Plus className="h-4 w-4" /> Add Publication
        </button>
      </div>

      <div className="space-y-4">
        {publications.map((pub) => (
          <div key={pub.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:border-primary/40 transition">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                    {pub.publication_type}
                  </span>
                  <span className="text-xs text-muted-foreground">• {pub.year}</span>
                  {pub.is_sci && <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-600">SCI</span>}
                  {pub.is_scopus && <span className="rounded bg-blue-500/10 px-2 py-0.5 text-xs font-bold text-blue-600">Scopus</span>}
                </div>
                <h3 className="mt-2 text-base font-bold text-foreground">{pub.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground italic">{pub.journal_or_conference_name}</p>
                {pub.doi && <p className="mt-1 text-xs font-mono text-primary">DOI: {pub.doi}</p>}
              </div>

              <button
                type="button"
                onClick={() => handleDelete(pub.id)}
                className="p-2 text-muted-foreground hover:text-destructive transition rounded-lg hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Add New Publication</h2>
              <button type="button" onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Publication Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="Paper title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Publication Type
                  </label>
                  <select
                    value={pubType}
                    onChange={(e: any) => setPubType(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="JOURNAL">Journal Article</option>
                    <option value="CONFERENCE">Conference Paper</option>
                    <option value="BOOK">Book</option>
                    <option value="BOOK_CHAPTER">Book Chapter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Publication Year
                  </label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Journal / Conference Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IEEE Transactions on Computers"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  DOI (Digital Object Identifier)
                </label>
                <input
                  type="text"
                  placeholder="10.1109/..."
                  value={doi}
                  onChange={(e) => setDoi(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Save Publication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
