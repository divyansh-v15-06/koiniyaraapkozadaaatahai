import { FlaskConical, Building2 } from "lucide-react";
import { formatINR } from "@/lib/utils";

const consultancies = [
  {
    title: "AI-Powered Quality Inspection System for Industrial Assembly Lines",
    client: "BHEL Haridwar",
    amount: 1450000,
    duration: "2023 - 2024",
    lead_faculty: "Dr. Priya Verma",
  },
  {
    title: "Security Audit and Penetration Testing of Smart Grid SCADA Network",
    client: "Himachal Pradesh State Electricity Board (HPSEBL)",
    amount: 1800000,
    duration: "2024",
    lead_faculty: "Dr. Amit Kumar Gupta",
  },
];

export default function ConsultancyPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">Industry Collaboration</span>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Industrial Consultancies
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Expert technical advisory, algorithm design, and system auditing for state corporations and private enterprises.
        </p>
      </div>

      <div className="space-y-4">
        {consultancies.map((c, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-primary/40">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-bold text-foreground text-base leading-snug">{c.title}</h3>
              <span className="font-mono font-bold text-primary text-lg">{formatINR(c.amount)}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground border-t border-border/60 pt-3">
              <span>Client: <strong className="text-foreground">{c.client}</strong></span>
              <span>Lead Faculty: <strong className="text-foreground">{c.lead_faculty}</strong></span>
              <span>Duration: <strong className="text-foreground">{c.duration}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
