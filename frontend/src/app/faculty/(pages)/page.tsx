/**
 * Faculty dashboard — overview with stats, CV completion, and quick actions.
 */
export default function FacultyDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your academic profile, research output, and recent
          activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Publications", value: "—", color: "text-chart-1" },
          { label: "Patents", value: "—", color: "text-chart-2" },
          { label: "Projects", value: "—", color: "text-chart-3" },
          { label: "Supervisions", value: "—", color: "text-chart-4" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className={`mt-1 text-3xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Add Publication", href: "/faculty/publications" },
            { label: "Update Profile", href: "/faculty/profile" },
            { label: "Export Resume", href: "/faculty/export" },
            { label: "Add Patent", href: "/faculty/patents" },
            { label: "Add Project", href: "/faculty/projects" },
            { label: "View Analytics", href: "/faculty/analytics" },
          ].map((action) => (
            <a
              key={action.label}
              href={action.href}
              className="rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium transition hover:border-primary/30 hover:bg-primary/5"
            >
              {action.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
