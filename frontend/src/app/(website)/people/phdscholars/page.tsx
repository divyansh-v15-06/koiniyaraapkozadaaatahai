import Link from "next/link";
import { BookOpen, UserCheck } from "lucide-react";
import { MOCK_PHD_SCHOLARS, MOCK_FACULTY } from "@/lib/mock-data";

export default function PhdScholarsPage() {
  const getSupervisorName = (id: string) => {
    const f = MOCK_FACULTY.find((fac) => fac.id === id);
    return f ? f.full_name : "Faculty Member";
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">Doctoral Researchers</span>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Ph.D. Scholars
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Doctoral candidates conducting advanced research across foundational and emerging computer science domains.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_PHD_SCHOLARS.map((sch) => (
          <div
            key={sch.id}
            className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-primary/40 hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-primary">
                  {sch.enrollment_number}
                </span>
                <span
                  className={`rounded-md px-2.5 py-0.5 text-xs font-semibold ${
                    sch.status === "passed"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {sch.status === "passed" ? "Graduated" : "Pursuing"}
                </span>
              </div>

              <h3 className="mt-3 text-lg font-bold text-foreground">{sch.name}</h3>

              <div className="mt-3 rounded-xl border border-border/70 bg-secondary/30 p-3 text-xs leading-relaxed">
                <span className="font-semibold text-muted-foreground block mb-1">Research Topic:</span>
                <span className="font-medium text-foreground italic">"{sch.topic}"</span>
              </div>
            </div>

            <div className="mt-4 border-t border-border/60 pt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                Supervisor: <strong className="text-foreground">{getSupervisorName(sch.supervisor_faculty_id)}</strong>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
