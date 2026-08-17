import { formatINR } from "@/lib/utils";
import { Lightbulb, Building, Calendar, CheckCircle2 } from "lucide-react";
import { MOCK_PROJECTS } from "@/lib/mock-data";

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">Grants &amp; Funding</span>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Sponsored R&amp;D Projects
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Externally funded research initiatives supported by national ministries and industry partners.
        </p>
      </div>

      <div className="space-y-6">
        {MOCK_PROJECTS.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-primary/40"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-md px-2.5 py-0.5 text-xs font-bold ${
                      p.status === "Ongoing"
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {p.status}
                  </span>
                  <span className="rounded-md bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                    {p.project_type}
                  </span>
                  {p.scheme && (
                    <span className="text-xs font-medium text-muted-foreground">
                      • {p.scheme}
                    </span>
                  )}
                </div>

                <h3 className="mt-2 text-lg font-bold text-foreground leading-snug">
                  {p.title}
                </h3>
              </div>

              <div className="flex-shrink-0 text-right sm:self-center">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Sanctioned Budget</p>
                <p className="text-xl font-bold text-primary font-mono">
                  {formatINR(p.total_sanctioned_amount)}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3 border-t border-border/60 pt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-primary flex-shrink-0" />
                <span>Agency: <strong className="text-foreground">{p.funding_agency}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                <span>Duration: <strong className="text-foreground">{p.start_date} → {p.end_date}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span>Received: <strong className="text-foreground">{formatINR(p.total_amount_received)}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
