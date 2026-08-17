"use client";

import { Download, FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { MOCK_FACULTY } from "@/lib/mock-data";

export default function ExportResumePage() {
  const faculty = MOCK_FACULTY[0];

  const handleDownload = (format: string) => {
    toast.success(`Generating official ${format} format... download will begin shortly!`);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Export Academic CV &amp; Reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate official institute-standard Word (DOCX) and PDF resumes and annual assessment reports.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Standard Academic Resume (DOCX)</h2>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Full curriculum vitae formatted according to the Institute template with qualifications, publications list, project grants, and teaching experience.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleDownload("DOCX Resume")}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition"
          >
            <Download className="h-4 w-4" /> Download Resume (.docx)
          </button>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-2/10 text-chart-2">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Annual Performance Appraisal Report (APAR)</h2>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Self-appraisal summary of publications, student guidance, and research grants for academic year review.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleDownload("Annual APAR Report")}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-2.5 text-xs font-semibold text-foreground hover:bg-accent transition"
          >
            <Download className="h-4 w-4" /> Download APAR Report (.docx)
          </button>
        </div>
      </div>
    </div>
  );
}
