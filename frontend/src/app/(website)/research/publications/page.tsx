"use client";

import { useState, useMemo } from "react";
import { Search, BookOpen, Copy, Check, ExternalLink, Calendar, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { toast } from "sonner";
import { MOCK_PUBLICATIONS } from "@/lib/mock-data";

const PUBS_PER_PAGE = 15;

export default function PublicationsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [selectedYear, setSelectedYear] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Available Years
  const availableYears = useMemo(() => {
    const set = new Set<number>();
    MOCK_PUBLICATIONS.forEach((p) => {
      if (p.year) set.add(Number(p.year));
    });
    return Array.from(set).sort((a, b) => b - a);
  }, []);

  const filtered = useMemo(() => {
    return MOCK_PUBLICATIONS.filter((p) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        p.title.toLowerCase().includes(searchLower) ||
        p.journal_or_conference_name.toLowerCase().includes(searchLower) ||
        p.authors?.some((a) => a.author_name.toLowerCase().includes(searchLower));

      const matchesType = typeFilter === "ALL" || p.publication_type === typeFilter;
      const matchesYear = selectedYear === "ALL" || String(p.year) === selectedYear;

      return matchesSearch && matchesType && matchesYear;
    });
  }, [search, typeFilter, selectedYear]);

  const totalPages = Math.ceil(filtered.length / PUBS_PER_PAGE) || 1;
  const paginatedPubs = useMemo(() => {
    const start = (currentPage - 1) * PUBS_PER_PAGE;
    return filtered.slice(start, start + PUBS_PER_PAGE);
  }, [filtered, currentPage]);

  const handleCopyCitation = (pub: typeof MOCK_PUBLICATIONS[0]) => {
    const authors = pub.authors?.map((a) => a.author_name).join(", ") || "Faculty";
    const citation = `${authors} (${pub.year}). "${pub.title}." ${pub.journal_or_conference_name}, ${pub.volume ? `Vol. ${pub.volume}, ` : ""}${pub.pages ? `pp. ${pub.pages}. ` : ""}${pub.doi ? `https://doi.org/${pub.doi}` : ""}`;
    navigator.clipboard.writeText(citation);
    setCopiedId(pub.id);
    toast.success("Citation copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6 bg-white min-h-[85vh]">
      {/* Title Header */}
      <div className="border-b border-[#eedfd8] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#33110e] tracking-tight uppercase flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#85261e]" />
            Department Research Publications ({filtered.length} of {MOCK_PUBLICATIONS.length})
          </h1>
          <p className="text-xs text-neutral-600 mt-0.5">
            Peer-reviewed SCI/Scopus journal articles, international conference proceedings, and book chapters.
          </p>
        </div>

        {/* Type Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#fff9f6] p-1 rounded-lg border border-[#eedfd8]">
          {[
            { id: "ALL", label: "All Types" },
            { id: "JOURNAL", label: "Journals" },
            { id: "CONFERENCE", label: "Conferences" },
            { id: "BOOK_CHAPTER", label: "Book Chapters" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setTypeFilter(item.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                typeFilter === item.id
                  ? "bg-[#33110e] text-white shadow-xs"
                  : "text-[#33110e] hover:bg-[#eedfd8]/50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Year Filters Bar */}
      <div className="bg-[#fff9f6] p-3 rounded-lg border border-[#eedfd8] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by title, author name, or journal..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded border border-[#eedfd8] bg-white focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
          />
        </div>

        {/* Year Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
          <span className="text-xs font-bold text-[#33110e] flex items-center gap-1 mr-1 flex-shrink-0">
            <Calendar className="w-3.5 h-3.5 text-[#85261e]" /> Year:
          </span>
          <button
            onClick={() => {
              setSelectedYear("ALL");
              setCurrentPage(1);
            }}
            className={`px-2.5 py-1 text-xs font-semibold rounded-full transition flex-shrink-0 ${
              selectedYear === "ALL"
                ? "bg-[#85261e] text-white font-bold"
                : "bg-white border border-[#eedfd8] text-neutral-700 hover:bg-neutral-100"
            }`}
          >
            All ({MOCK_PUBLICATIONS.length})
          </button>
          {availableYears.map((yr) => {
            const count = MOCK_PUBLICATIONS.filter((p) => p.year === yr).length;
            return (
              <button
                key={yr}
                onClick={() => {
                  setSelectedYear(yr.toString());
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-full transition flex-shrink-0 ${
                  selectedYear === yr.toString()
                    ? "bg-[#85261e] text-white font-bold"
                    : "bg-white border border-[#eedfd8] text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                {yr} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Publications Cards */}
      <div className="space-y-3">
        {paginatedPubs.map((pub, idx) => {
          const itemNum = (currentPage - 1) * PUBS_PER_PAGE + idx + 1;

          return (
            <div
              key={pub.id}
              className="bg-white border border-[#eedfd8] rounded-lg p-4 hover:border-[#85261e]/40 transition shadow-xs hover:shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1 space-y-1.5">
                  {/* Badges & Year */}
                  <div className="flex flex-wrap items-center gap-2 text-[10px]">
                    <span className="font-mono font-bold text-neutral-500">
                      #{itemNum}
                    </span>
                    <span className="bg-[#33110e] text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      {pub.publication_type}
                    </span>
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded">
                      {pub.year}
                    </span>
                    {pub.is_sci && (
                      <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-1.5 py-0.5 rounded">
                        SCI Indexed
                      </span>
                    )}
                    {pub.is_scopus && !pub.is_sci && (
                      <span className="bg-sky-100 text-sky-900 border border-sky-300 font-bold px-1.5 py-0.5 rounded">
                        Scopus
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-[#1c110c] leading-snug hover:text-[#85261e] transition cursor-pointer">
                    {pub.title}
                  </h3>

                  {/* Authors */}
                  <p className="text-xs text-neutral-600">
                    <strong className="text-neutral-800">Authors:</strong>{" "}
                    {pub.authors?.map((a) => a.author_name).join(", ") || "Faculty"}
                  </p>

                  {/* Venue */}
                  <p className="text-xs italic text-[#85261e] font-medium">
                    {pub.journal_or_conference_name}
                    {pub.volume && `, Vol. ${pub.volume}`}
                    {pub.issue && `(${pub.issue})`}
                    {pub.pages && `, pp. ${pub.pages}`}
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center sm:flex-col gap-1.5 flex-shrink-0 pt-2 sm:pt-0">
                  {pub.doi && (
                    <a
                      href={pub.doi.startsWith("http") ? pub.doi : `https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 bg-[#33110e] text-white rounded text-[11px] font-semibold hover:bg-[#85261e] transition flex items-center gap-1"
                    >
                      DOI Link <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                  <button
                    onClick={() => handleCopyCitation(pub)}
                    className="px-2.5 py-1 border border-[#eedfd8] text-neutral-700 bg-[#fff9f6] rounded text-[11px] font-semibold hover:bg-[#eedfd8] transition flex items-center gap-1"
                  >
                    {copiedId === pub.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-neutral-500" /> Cite
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-neutral-500 text-xs bg-[#fff9f6] rounded-lg border border-[#eedfd8]">
            No publications found matching your filters.
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 text-xs text-neutral-600 border-t border-[#eedfd8]">
          <p>
            Showing {(currentPage - 1) * PUBS_PER_PAGE + 1} to{" "}
            {Math.min(currentPage * PUBS_PER_PAGE, filtered.length)} of {filtered.length} publications
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded border border-[#eedfd8] bg-white disabled:opacity-40 hover:bg-[#fff9f6]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-semibold text-[#33110e]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded border border-[#eedfd8] bg-white disabled:opacity-40 hover:bg-[#fff9f6]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
