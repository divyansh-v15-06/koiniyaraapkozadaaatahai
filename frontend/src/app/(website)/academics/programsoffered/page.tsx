import Link from "next/link";
import { GraduationCap, Award, BookOpen, Clock, Users, ArrowRight } from "lucide-react";

export const programmes = [
  {
    code: "BTECH_CSE",
    name: "B.Tech in Computer Science & Engineering",
    level: "Undergraduate (UG)",
    duration: "4 Years (8 Semesters)",
    intake: 120,
    description: "Flagship undergraduate degree providing deep grounding in computer science fundamentals, algorithm design, software architecture, and emerging domains like AI and cloud systems.",
  },
  {
    code: "MTECH_CSE",
    name: "M.Tech in Computer Science & Engineering",
    level: "Postgraduate (PG)",
    duration: "2 Years (4 Semesters)",
    intake: 30,
    description: "Advanced coursework and thesis research in distributed systems, high-performance computing, advanced algorithms, and applied machine learning.",
  },
  {
    code: "MTECH_AI",
    name: "M.Tech in Artificial Intelligence & Data Science",
    level: "Postgraduate (PG)",
    duration: "2 Years (4 Semesters)",
    intake: 30,
    description: "Specialized postgraduate programme focusing on deep learning, computer vision, natural language processing, and scalable data analytics.",
  },
  {
    code: "DUAL_CSE",
    name: "Dual Degree B.Tech & M.Tech CSE",
    level: "Integrated Dual Degree",
    duration: "5 Years (10 Semesters)",
    intake: 30,
    description: "Integrated programme enabling students to transition seamlessly from undergraduate coursework into master's research.",
  },
  {
    code: "PHD_CSE",
    name: "Doctor of Philosophy (Ph.D.) in CSE",
    level: "Doctoral (PhD)",
    duration: "3 - 5 Years",
    intake: "Rolling Admission",
    description: "Rigorous doctoral research under the supervision of leading faculty across all modern areas of computing sciences.",
  },
];

export default function ProgrammesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">Academic Degree Options</span>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Programmes Offered
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Comprehensive curriculum spanning undergraduate, postgraduate, and doctoral degrees in computing sciences.
        </p>
      </div>

      <div className="space-y-6">
        {programmes.map((p) => (
          <div
            key={p.code}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-primary/10 px-2.5 py-0.5 font-mono text-xs font-bold text-primary">
                    {p.code}
                  </span>
                  <span className="rounded-md bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                    {p.level}
                  </span>
                </div>
                <h3 className="mt-2 text-xl font-bold text-foreground">{p.name}</h3>
              </div>

              <div className="flex flex-wrap gap-4 text-xs font-medium text-muted-foreground">
                <span className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-3 py-1.5">
                  <Clock className="h-4 w-4 text-primary" /> {p.duration}
                </span>
                <span className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-3 py-1.5">
                  <Users className="h-4 w-4 text-primary" /> Intake: {p.intake}
                </span>
              </div>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.description}</p>

            <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-border/60 pt-4 text-xs font-semibold">
              <Link href="/academics/syllabus" className="flex items-center gap-1 text-primary hover:underline">
                View Syllabus &amp; Curriculum <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/academics/courses" className="text-muted-foreground hover:text-foreground">
                Course List →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
