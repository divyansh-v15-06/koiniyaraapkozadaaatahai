import { Download, FileText, Calendar } from "lucide-react";

const syllabusItems = [
  { programme: "B.Tech Computer Science & Engineering", version: "2024-2028 Scheme", updated: "June 2024", size: "2.4 MB" },
  { programme: "M.Tech Computer Science & Engineering", version: "2024 Scheme", updated: "July 2024", size: "1.8 MB" },
  { programme: "M.Tech Artificial Intelligence & Data Science", version: "2025 Scheme", updated: "December 2024", size: "2.1 MB" },
  { programme: "Dual Degree B.Tech & M.Tech CSE", version: "2024-2029 Scheme", updated: "July 2024", size: "3.0 MB" },
  { programme: "Ph.D. Coursework Syllabus & Guidelines", version: "2024 Guidelines", updated: "January 2024", size: "1.2 MB" },
];

export default function SyllabusPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">Academic Curriculum</span>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Syllabus &amp; Ordinances
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Official programme schemes, course structures, and evaluation guidelines.
        </p>
      </div>

      <div className="space-y-4">
        {syllabusItems.map((item, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between transition hover:border-primary/40"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-base">{item.programme}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.version} • Last updated: {item.updated} ({item.size})
                </p>
              </div>
            </div>

            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-2.5 text-xs font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
            >
              <Download className="h-4 w-4" /> Download PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
