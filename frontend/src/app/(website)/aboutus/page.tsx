import Link from "next/link";
import { Building2, Target, Eye, Award, Users, BookOpen } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 text-center sm:text-left">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">About Us</span>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Department of Computer Science &amp; Engineering
        </h1>
        <p className="mt-2 max-w-3xl text-base text-muted-foreground">
          Established to impart high-quality education and conduct groundbreaking research in computer science, software systems, AI, and information security.
        </p>
      </div>

      {/* Vision & Mission Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Eye className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Vision</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            To become a center of excellence in computer science and engineering education and research, producing globally competent professionals with strong ethical values.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-chart-2/10 text-chart-2">
            <Target className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Mission</h2>
          <ul className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground list-disc pl-5">
            <li>Provide rigorous academic curricula aligned with global technological advancements.</li>
            <li>Foster innovative research addressing societal and industrial challenges.</li>
            <li>Promote entrepreneurship, leadership, and lifelong learning among students.</li>
          </ul>
        </div>
      </div>

      {/* Quick Navigation Sections */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "HOD Message", href: "/aboutus/hod", desc: "Read message from the Head of Department", icon: Users },
          { title: "Labs & Facilities", href: "/aboutus/labs", desc: "Explore our specialized research laboratories", icon: Building2 },
          { title: "Frequently Asked Questions", href: "/aboutus/faq", desc: "Common queries about admissions and academics", icon: BookOpen },
          { title: "Academic Programmes", href: "/academics/programsoffered", desc: "B.Tech, M.Tech, and Ph.D. curriculum", icon: Award },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md"
          >
            <item.icon className="h-6 w-6 text-primary group-hover:scale-110 transition duration-200" />
            <h3 className="mt-3 text-base font-bold text-foreground group-hover:text-primary transition">
              {item.title}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
