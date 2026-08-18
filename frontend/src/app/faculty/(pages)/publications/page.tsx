"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Trash2,
  BookOpen,
  X,
  Copy,
  ExternalLink,
  Search,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
  FileText,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { MOCK_FACULTY, MOCK_PUBLICATIONS } from "@/lib/mock-data";

export default function FacultyPublicationsPage() {
  const [user, setUser] = useState<any>(null);
  const [faculty, setFaculty] = useState<any>(MOCK_FACULTY[0]);
  const [publications, setPublications] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [pubType, setPubType] = useState("Journal");
  const [venue, setVenue] = useState("");
  const [indexing, setIndexing] = useState("Scopus");
  const [quartile, setQuartile] = useState("Q1");
  const [year, setYear] = useState(new Date().getFullYear());
  const [doi, setDoi] = useState("");
  const [authors, setAuthors] = useState("");
  const [volume, setVolume] = useState("");
  const [issue, setIssue] = useState("");
  const [pages, setPages] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("auth_user");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setUser(parsed);
        const match = MOCK_FACULTY.find(
          (f) =>
            f.employee_code?.toLowerCase() === parsed.employee_code?.toLowerCase() ||
            f.email?.toLowerCase() === parsed.email?.toLowerCase() ||
            f.id === parsed.faculty_id
        );
        if (match) {
          setFaculty(match);
          const legacyId = match.legacy_id;
          const lastName = match.full_name.toLowerCase().split(" ").pop() || "";

          const userPapers = MOCK_PUBLICATIONS.filter((p: any) => {
            if (legacyId && p.faculty_legacy_ids?.includes(legacyId)) return true;
            if (p.author_text && typeof p.author_text === "string" && p.author_text.toLowerCase().includes(lastName)) return true;
            if (Array.isArray(p.authors) && p.authors.some((a: any) => typeof a === "string" && a.toLowerCase().includes(lastName))) return true;
            return false;
          });

          setPublications(userPapers.length > 0 ? userPapers : MOCK_PUBLICATIONS.slice(0, 15));
        }
      } catch {}
    } else {
      setPublications(MOCK_PUBLICATIONS.slice(0, 15));
    }
  }, []);

  const filteredPublications = useMemo(() => {
    return publications.filter((p) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        p.title.toLowerCase().includes(q) ||
        (p.journal_or_conference_name && p.journal_or_conference_name.toLowerCase().includes(q)) ||
        (p.venue_name && p.venue_name.toLowerCase().includes(q)) ||
        (p.author_text && p.author_text.toLowerCase().includes(q)) ||
        (p.doi && p.doi.toLowerCase().includes(q));

      const matchesType =
        typeFilter === "ALL" ||
        p.publication_type?.toLowerCase() === typeFilter.toLowerCase();

      return matchesSearch && matchesType;
    });
  }, [publications, search, typeFilter]);

  const handleCopyCitation = (pub: any) => {
    const authors = pub.author_text || faculty.full_name;
    const citation = `${authors} (${pub.year}). "${pub.title}". ${pub.journal_or_conference_name || pub.venue_name}${pub.volume ? `, vol. ${pub.volume}` : ""}${pub.issue ? `, no. ${pub.issue}` : ""}${pub.page_range || pub.pages ? `, pp. ${pub.page_range || pub.pages}` : ""}.${pub.doi ? ` DOI: ${pub.doi}` : ""}`;
    navigator.clipboard.writeText(citation);
    setCopiedId(pub.id);
    toast.success("Citation copied in standard format!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !venue.trim()) {
      toast.error("Please provide Publication Title and Journal/Conference Venue");
      return;
    }
    const newPub = {
      id: `pub-${Date.now()}`,
      title: title.trim(),
      publication_type: pubType,
      journal_or_conference_name: venue.trim(),
      venue_name: venue.trim(),
      year: Number(year) || new Date().getFullYear(),
      indexing: indexing,
      journal_quartile: quartile !== "N/A" ? quartile : undefined,
      doi: doi.trim() || undefined,
      author_text: authors.trim() || faculty.full_name,
      volume: volume.trim() || undefined,
      issue: issue.trim() || undefined,
      pages: pages.trim() || undefined,
      page_range: pages.trim() || undefined,
      faculty_legacy_ids: [faculty.legacy_id],
    };
    setPublications([newPub, ...publications]);
    setShowModal(false);
    setTitle("");
    setVenue("");
    setDoi("");
    setAuthors("");
    setVolume("");
    setIssue("");
    setPages("");
    toast.success("Publication recorded successfully in portfolio!");
  };

  const handleDelete = (id: string) => {
    setPublications(publications.filter((p) => p.id !== id));
    toast.success("Publication removed from portfolio");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      {/* Header Banner */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-[#85261e]" />
              Publications &amp; Scholarly Output
            </h1>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-xs font-bold px-2.5 py-0.5 rounded-full">
              {publications.length} Papers Linked
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Manage your peer-reviewed journal papers, conference proceedings, and book chapters for{" "}
            <strong>{faculty.full_name}</strong> ({faculty.employee_code || "Faculty"}).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] text-white px-4 py-2.5 text-xs font-bold shadow-xs hover:shadow-md transition cursor-pointer"
        >
          <Plus className="h-4 w-4 text-amber-300" />
          <span>Add Publication</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#eedfd8] rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Keyword Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search paper title, journal, DOI, co-authors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#eedfd8] bg-[#fff9f6] text-[#33110e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
            />
          </div>

          {/* Type Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#fff9f6] p-1 rounded-xl border border-[#eedfd8]">
            {[
              { id: "ALL", label: "All Papers" },
              { id: "Journal", label: "Journals" },
              { id: "Conference", label: "Conferences" },
              { id: "Book Chapter", label: "Book Chapters" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTypeFilter(tab.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  typeFilter === tab.id
                    ? "bg-[#33110e] text-white shadow-xs"
                    : "text-[#33110e] hover:bg-[#eedfd8]/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Publications Cards Grid */}
      <div className="space-y-3.5">
        {filteredPublications.map((pub) => (
          <div
            key={pub.id}
            className="rounded-2xl border border-[#eedfd8] bg-white p-5 shadow-xs hover:border-[#85261e]/40 transition duration-150 flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-2">
              {/* Badges Header */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="bg-[#33110e] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  {pub.publication_type}
                </span>

                {pub.indexing && (
                  <span className="bg-[#85261e] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    {pub.indexing}
                  </span>
                )}

                {pub.journal_quartile && pub.journal_quartile !== "N/A" && (
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">
                    {pub.journal_quartile}
                  </span>
                )}

                <span className="bg-[#fff9f6] text-[#33110e] border border-[#eedfd8] text-[11px] font-mono font-bold px-2 py-0.5 rounded ml-auto">
                  {pub.year}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-sm sm:text-base font-bold text-[#1c110c] group-hover:text-[#85261e] transition leading-snug">
                {pub.title}
              </h2>

              {/* Authors */}
              {pub.author_text && (
                <p className="text-xs text-neutral-600">
                  <span className="font-semibold text-[#85261e]">Authors: </span>
                  {pub.author_text}
                </p>
              )}

              {/* Venue & Volume/Issue */}
              <p className="text-xs text-neutral-700 italic font-medium">
                {pub.journal_or_conference_name || pub.venue_name}
                {pub.volume && <span> • Vol. {pub.volume}</span>}
                {pub.issue && <span>, Issue {pub.issue}</span>}
                {(pub.page_range || pub.pages) && <span>, pp. {pub.page_range || pub.pages}</span>}
              </p>

              {/* DOI */}
              {pub.doi && (
                <div className="flex items-center gap-2 pt-0.5">
                  <a
                    href={pub.doi.startsWith("http") ? pub.doi : `https://doi.org/${pub.doi}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[11px] text-[#85261e] hover:underline"
                  >
                    <span>DOI: {pub.doi}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Actions Strip */}
            <div className="flex items-center justify-between pt-3 border-t border-[#eedfd8]/60 text-xs">
              <button
                type="button"
                onClick={() => handleCopyCitation(pub)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#eedfd8] bg-[#fff9f6] text-[#33110e] hover:bg-[#33110e] hover:text-white transition font-medium cursor-pointer shadow-2xs"
              >
                {copiedId === pub.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#85261e]" />
                    <span>Copy Citation</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleDelete(pub.id)}
                className="p-1.5 text-neutral-400 hover:text-red-700 transition rounded-lg hover:bg-red-50 cursor-pointer"
                title="Remove Publication"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredPublications.length === 0 && (
          <div className="text-center py-16 text-neutral-500 text-xs bg-white rounded-2xl border border-[#eedfd8]">
            No publications found matching your search.
          </div>
        )}
      </div>

      {/* Add Publication Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-[#eedfd8] bg-white p-6 sm:p-8 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-[#eedfd8]/60 pb-3">
              <div>
                <h2 className="text-lg font-bold text-[#33110e]">
                  Add Research Publication
                </h2>
                <p className="text-xs text-neutral-500">
                  Log a peer-reviewed journal paper, conference article, or book chapter.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-[#33110e] hover:bg-[#fff9f6] transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                  Paper / Publication Title *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. An Optimal Deep Learning Architecture for Edge Cloud Computing"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-3 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Publication Type *
                  </label>
                  <select
                    value={pubType}
                    onChange={(e) => setPubType(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs font-semibold text-[#33110e] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  >
                    <option value="Journal">Journal Article</option>
                    <option value="Conference">Conference Proceeding</option>
                    <option value="Book Chapter">Book Chapter</option>
                    <option value="Book">Authored Book</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Indexing Authority
                  </label>
                  <select
                    value={indexing}
                    onChange={(e) => setIndexing(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs font-semibold text-[#33110e] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  >
                    <option value="SCI(E)">SCI(E) / Web of Science</option>
                    <option value="Scopus">Scopus</option>
                    <option value="ESCI">ESCI</option>
                    <option value="Peer-Reviewed">Peer-Reviewed / Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Journal Quartile
                  </label>
                  <select
                    value={quartile}
                    onChange={(e) => setQuartile(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs font-semibold text-[#33110e] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  >
                    <option value="Q1">Q1 (Top 25%)</option>
                    <option value="Q2">Q2</option>
                    <option value="Q3">Q3</option>
                    <option value="Q4">Q4</option>
                    <option value="N/A">Not Applicable</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                  Journal / Conference / Publisher Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IEEE Transactions on Computers / ACM Computing Surveys"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                  Author(s) in Order
                </label>
                <input
                  type="text"
                  placeholder={`e.g. ${faculty.full_name}, Co-Author 1, Co-Author 2`}
                  value={authors}
                  onChange={(e) => setAuthors(e.target.value)}
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Year *
                  </label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    required
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs font-mono text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Volume
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 52"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs font-mono text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Issue
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 4"
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs font-mono text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                    Pages
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 100-115"
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                    className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3 py-2 text-xs font-mono text-[#1c110c] focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#33110e] mb-1.5">
                  DOI (Digital Object Identifier)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10.1109/TC.2024.1234567"
                  value={doi}
                  onChange={(e) => setDoi(e.target.value)}
                  className="w-full rounded-xl border border-[#eedfd8] bg-[#fff9f6] px-3.5 py-2.5 text-xs font-mono text-[#1c110c] placeholder:text-neutral-400 focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-[#eedfd8]/60">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-[#eedfd8] bg-white px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-[#fff9f6] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#33110e] hover:bg-[#85261e] text-white px-5 py-2 text-xs font-bold shadow-xs hover:shadow-md transition cursor-pointer"
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
