import { Building2, Cpu, UserCheck } from "lucide-react";
import { MOCK_LABS } from "@/lib/mock-data";

export default function LabsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">Infrastructure &amp; Research</span>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Laboratories &amp; Facilities
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          State-of-the-art specialized computing facilities, GPU clusters, and research labs.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {MOCK_LABS.map((lab) => (
          <div
            key={lab.id}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                <Building2 className="h-3.5 w-3.5 text-primary" /> {lab.location}
              </span>
              <span className="rounded-md bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                {lab.equipment_count} Workstations/Racks
              </span>
            </div>

            <h3 className="mt-3 text-lg font-bold text-foreground">{lab.name}</h3>

            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{lab.description}</p>

            <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
              <span className="flex items-center gap-1 text-muted-foreground">
                <UserCheck className="h-3.5 w-3.5 text-primary" /> Lab In-Charge: <strong className="text-foreground">{lab.head}</strong>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
