import { Calendar, Download, Clock } from "lucide-react";

export default function AcademicCalendarPage() {
  const events = [
    { title: "Commencement of Classes (Autumn Semester)", date: "July 22, 2026", type: "Academic" },
    { title: "First Mid-Term Examinations", date: "September 15 - 20, 2026", type: "Examination" },
    { title: "Institute Annual Technical Festival (Nimbus)", date: "October 10 - 12, 2026", type: "Co-Curricular" },
    { title: "Second Mid-Term Examinations", date: "November 03 - 08, 2026", type: "Examination" },
    { title: "End-Semester Practical & Theory Exams", date: "December 01 - 15, 2026", type: "Examination" },
    { title: "Winter Vacation", date: "December 18, 2026 - January 10, 2027", type: "Vacation" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Schedules &amp; Dates</span>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Academic Calendar 2026-2027
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Schedule of academic activities, examinations, and holidays.
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition"
        >
          <Download className="h-4 w-4" /> Download Official Calendar
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm divide-y divide-border/60">
        {events.map((ev, i) => (
          <div key={i} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between hover:bg-accent/30 transition">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <p className="font-semibold text-foreground text-sm">{ev.title}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Clock className="h-3 w-3" /> {ev.date}
                </p>
              </div>
            </div>

            <span className="self-start sm:self-center rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
              {ev.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
