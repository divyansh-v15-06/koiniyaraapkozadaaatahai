import Link from "next/link";
import { BookOpen, Shield, Lightbulb, FlaskConical, Calendar, ArrowRight } from "lucide-react";

export default function ResearchOverviewPage() {
  const researchTracks = [
    { title: "Publications Catalogue", href: "/research/publications", count: "340+ Papers", desc: "Peer-reviewed journal articles in IEEE, ACM, Elsevier, and top conferences.", icon: BookOpen },
    { title: "Patents & Innovations", href: "/research/patents", count: "28+ Patents", desc: "Granted and published Indian and international patents.", icon: Shield },
    { title: "Sponsored R&D Projects", href: "/research/projects", count: "₹3.85 Cr+ Grants", desc: "Research grants funded by MeitY, DST-SERB, and DRDO.", icon: Lightbulb },
    { title: "Industrial Consultancy", href: "/research/consultancy", count: "15+ Projects", desc: "Technical consulting and applied development for industry partners.", icon: FlaskConical },
    { title: "Events & Conferences", href: "/research/events", count: "45+ Events", desc: "National and international conferences, workshops, and FDPs.", icon: Calendar },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">Discovery &amp; Innovation</span>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Department Research
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Pioneering discoveries, intellectual property, and high-impact sponsored research.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {researchTracks.map((tr) => (
          <Link
            key={tr.href}
            href={tr.href}
            className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-primary/40 hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition duration-200">
                  <tr.icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold text-primary font-mono bg-primary/10 px-2.5 py-1 rounded-md">
                  {tr.count}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-foreground group-hover:text-primary transition">
                {tr.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{tr.desc}</p>
            </div>

            <div className="mt-5 flex items-center gap-1 border-t border-border/60 pt-3 text-xs font-semibold text-primary">
              Explore Track <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
