/**
 * Public homepage — hero carousel, department stats, research highlights,
 * announcements, HOD message, and quick links.
 *
 * This is a placeholder that will be built out with real components.
 */
export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section Placeholder */}
      <section className="relative flex min-h-[65vh] items-center justify-center overflow-hidden bg-gradient-to-br from-[hsl(217,72%,42%)] via-[hsl(220,60%,30%)] to-[hsl(224,40%,15%)] text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-200">
            National Institute of Technology
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Department of Computer Science{" "}
            <span className="text-blue-300">&amp; Engineering</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100/80">
            Pioneering excellence in computing research, education, and
            innovation since establishment.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="/people/faculty"
              className="rounded-lg bg-white/10 px-6 py-3 text-sm font-medium backdrop-blur-sm transition hover:bg-white/20"
            >
              Meet Our Faculty
            </a>
            <a
              href="/research/publications"
              className="rounded-lg bg-white px-6 py-3 text-sm font-medium text-[hsl(217,72%,42%)] transition hover:bg-blue-50"
            >
              Explore Research
            </a>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Faculty Members", value: "—" },
            { label: "Publications", value: "—" },
            { label: "Sponsored Projects", value: "—" },
            { label: "Patents", value: "—" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-6 text-center shadow-sm"
            >
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Announcements & News Placeholder */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Latest Announcements</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Announcements will be loaded from the API.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold">News & Achievements</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              News posts will be loaded from the API.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
