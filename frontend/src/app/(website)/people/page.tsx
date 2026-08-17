import Link from "next/link";
import { Users, GraduationCap, UserCog, BookOpen } from "lucide-react";

export default function PeopleOverviewPage() {
  const sections = [
    { title: "Faculty Members", count: "24+", href: "/people/faculty", desc: "Professors, Associate & Assistant Professors driving teaching and research.", icon: Users },
    { title: "PhD Research Scholars", count: "35+", href: "/people/phdscholars", desc: "Full-time & sponsored doctoral researchers.", icon: BookOpen },
    { title: "Students", count: "580+", href: "/people/students", desc: "Undergraduate (B.Tech) and Postgraduate (M.Tech) students.", icon: GraduationCap },
    { title: "Technical & Admin Staff", count: "8+", href: "/people/staff", desc: "System administrators, lab engineers, and administrative staff.", icon: UserCog },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">Department Community</span>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          People
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Faculty, doctoral scholars, students, and staff forming our vibrant academic community.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {sections.map((sec) => (
          <Link
            key={sec.href}
            href={sec.href}
            className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition duration-200">
                <sec.icon className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold text-primary font-mono">{sec.count}</span>
            </div>
            <h3 className="mt-4 text-xl font-bold text-foreground group-hover:text-primary transition">
              {sec.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{sec.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
