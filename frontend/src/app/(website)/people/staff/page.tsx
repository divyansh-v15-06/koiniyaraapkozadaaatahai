import { Mail, Phone, UserCog } from "lucide-react";
import { MOCK_STAFF } from "@/lib/mock-data";

export default function StaffPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">Support &amp; Infrastructure</span>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Staff Members
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Technical officers, laboratory engineers, and administrative staff of the department.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {MOCK_STAFF.map((staff) => (
          <div
            key={staff.id}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-primary/40"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-secondary text-primary font-bold">
                <UserCog className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-foreground text-base">{staff.name}</h3>
                <p className="text-xs font-medium text-muted-foreground">{staff.designation}</p>
                <div className="pt-2 text-xs text-muted-foreground space-y-1">
                  <p className="flex items-center gap-1.5 hover:text-primary">
                    <Mail className="h-3.5 w-3.5 text-primary" /> {staff.email}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" /> {staff.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
