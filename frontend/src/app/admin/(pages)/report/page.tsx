"use client";

import { Download, FileSpreadsheet, ClipboardList } from "lucide-react";
import { toast } from "sonner";

export default function AdminReportPage() {
  const handleGenerate = (name: string) => {
    toast.success(`Generating ${name}... file will download in a few seconds.`);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Accreditation &amp; Annual Reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate official NIRF, NBA, and NAAC accreditation data exports and annual department reports.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <ClipboardList className="h-8 w-8 text-primary" />
          <div>
            <h2 className="font-bold text-foreground text-base">Annual Departmental Report (DOCX)</h2>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Consolidated report of research publications, sponsored projects, faculty honors, and student placement data for the academic year.
            </p>
          </div>
          <button onClick={() => handleGenerate("Annual Report (DOCX)")} className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground">
            <Download className="h-4 w-4" /> Download Annual Report (.docx)
          </button>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <FileSpreadsheet className="h-8 w-8 text-chart-2" />
          <div>
            <h2 className="font-bold text-foreground text-base">NIRF &amp; NBA Accreditation Data Export (CSV)</h2>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Aggregated faculty publication count, PhD graduations, consultancy funding, and student intake metrics formatted for NIRF criteria.
            </p>
          </div>
          <button onClick={() => handleGenerate("NIRF / NBA Data (CSV)")} className="flex items-center justify-center gap-2 w-full rounded-xl border border-border bg-card py-2.5 text-xs font-semibold text-foreground hover:bg-accent">
            <Download className="h-4 w-4" /> Export NIRF Dataset (.csv)
          </button>
        </div>
      </div>
    </div>
  );
}
