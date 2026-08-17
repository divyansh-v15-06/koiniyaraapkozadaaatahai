import { Megaphone, Calendar } from "lucide-react";
import { MOCK_ANNOUNCEMENTS } from "@/lib/mock-data";

export default function AnnouncementsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">Department Circulars</span>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Announcements &amp; Notices
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Official departmental circulars, exam notices, and admission announcements.
        </p>
      </div>

      <div className="space-y-4">
        {MOCK_ANNOUNCEMENTS.map((ann) => (
          <div
            key={ann.id}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-primary/40"
          >
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 text-primary" /> Published: {ann.publish_date}
              {ann.expiry_date && <span>• Valid until: {ann.expiry_date}</span>}
            </div>

            <h3 className="mt-2 text-lg font-bold text-foreground leading-snug">{ann.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{ann.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
