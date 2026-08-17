"use client";

import { useState } from "react";
import { Search, BookOpen, Copy, Check, Filter, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { MOCK_PUBLICATIONS } from "@/lib/mock-data";

export default function PublicationsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = MOCK_PUBLICATIONS.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.journal_or_conference_name.toLowerCase().includes(search.toLowerCase()) ||
      p.authors?.some((a) => a.author_name.toLowerCase().includes(search.toLowerCase()));

    const matchesType = typeFilter === "ALL" || p.publication_type === typeFilter;

    return matchesSearch && matchesType;
  });

  const handleCopyCitation = (pub: typeof MOCK_PUBLICATIONS[0]) => {
    const authors = pub.authors?.map((a) => a.author_name).join(", ") || "Faculty";
    const citation = `${authors} (${pub.year}). "${pub.title}." ${pub.journal_or_conference_name}, ${pub.volume ? `Vol. ${pub.volume}, ` : ""}${pub.pages ? `pp. ${pub.pages}. ` : ""}${pub.doi ? `https://doi.org/${pub.doi}` : ""}`;
    navigator.clipboard.writeText(citation);
    setCopiedId(pub.id);
    toast.success("Citation copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">Department Research</span>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Publications Catalogue
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Peer-reviewed journal articles, international conference proceedings, books, and book chapters.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author, journal, or keyword..."
            className="w-full rounded-xl border border-input bg-card py-2.5 pl-10 pr-4 text-sm shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {["ALL", "JOURNAL", "CONFERENCE", "BOOK", "BOOK_CHAPTER"].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                typeFilter === type
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {type === "ALL" ? "All Types" : type.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Publications List */}
      <div className="space-y-4">
        {filtered.map((pub) => (
          <div
            key={pub.id}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-primary/10 px-2.5 py-0.5 font-mono text-xs font-bold text-primary">
                  {pub.publication_type}
                </span>
                {pub.is_sci && (
                  <span className="rounded-md bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    SCI / SCIE
                  </span>
                )}
                {pub.is_scopus && (
                  <span className="rounded-md bg-blue-500/10 px-2.5 py-0.5 text-xs font-bold text-blue-600 dark:text-blue-400">
                    Scopus
                  </span>
                )}
                {pub.impact_factor > 0 && (
                  <span className="rounded-md bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                    IF: {pub.impact_factor}
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold text-muted-foreground">{pub.year}</span>
            </div>

            <h3 className="mt-3 text-base font-bold text-foreground leading-snug">
              {pub.title}
            </h3>

            <p className="mt-2 text-xs font-medium text-primary">
              {pub.authors?.map((a) => a.author_name).join(", ")}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              <span className="font-semibold">{pub.journal_or_conference_name}</span>
              {pub.volume && `, Vol. ${pub.volume}`}
              {pub.issue && ` (${pub.issue})`}
              {pub.pages && `, pp. ${pub.pages}`}
              {pub.publisher && ` • ${pub.publisher}`}
            </p>

            {pub.abstract_text && (
              <p className="mt-3 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {pub.abstract_text}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3 text-xs">
              {pub.doi ? (
                <a
                  href={`https://doi.org/${pub.doi}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 font-mono text-primary hover:underline"
                >
                  DOI: {pub.doi} <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <span className="text-muted-foreground">No DOI available</span>
              )}

              <button
                type="button"
                onClick={() => handleCopyCitation(pub)}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-3 py-1 font-medium text-foreground transition hover:bg-secondary"
              >
                {copiedId === pub.id ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" /> Copy Citation
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
