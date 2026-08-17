/**
 * Admin dashboard — system health, quick counters, and audit overview.
 */
export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          System health, department statistics, and pending actions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active Faculty", value: "—" },
          { label: "Total Students", value: "—" },
          { label: "Pending Reviews", value: "—" },
          { label: "Announcements", value: "—" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-1 text-3xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
