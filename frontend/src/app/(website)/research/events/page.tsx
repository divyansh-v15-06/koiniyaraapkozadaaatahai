import { Calendar, Users, MapPin } from "lucide-react";

const events = [
  {
    title: "IEEE International Conference on Advanced Computing & Intelligent Communication (ICACIC 2026)",
    dates: "November 14-16, 2026",
    type: "International Conference",
    venue: "Auditorium, NIT Campus",
    coordinator: "Dr. Rajesh Sharma & Dr. Priya Verma",
  },
  {
    title: "One-Week National Workshop on Post-Quantum Cryptography and Blockchain",
    dates: "July 20-25, 2026",
    type: "National Workshop",
    venue: "Lab 3 & Virtual",
    coordinator: "Dr. Amit Kumar Gupta",
  },
  {
    title: "Hands-on Winter School on Deep Generative Models & PyTorch",
    dates: "December 18-22, 2025",
    type: "Faculty Development Programme",
    venue: "AI Research Lab",
    coordinator: "Dr. Sunita Kapoor",
  },
];

export default function EventsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">Academic Gatherings</span>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Events &amp; Conferences
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Conferences, short-term courses, and faculty development programmes organized by the department.
        </p>
      </div>

      <div className="space-y-4">
        {events.map((ev, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-primary/40">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                {ev.type}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-primary" /> {ev.dates}
              </span>
            </div>

            <h3 className="mt-3 text-base font-bold text-foreground leading-snug">{ev.title}</h3>

            <div className="mt-4 flex flex-wrap gap-4 border-t border-border/60 pt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" /> Venue: <strong className="text-foreground">{ev.venue}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-primary" /> Coordinators: <strong className="text-foreground">{ev.coordinator}</strong>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
