import Link from "next/link";
import { ArrowLeft, Mail, Phone, Quote } from "lucide-react";
import { MOCK_FACULTY } from "@/lib/mock-data";

export default function HodMessagePage() {
  const hod = MOCK_FACULTY[0];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/aboutus"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition"
      >
        <ArrowLeft className="h-4 w-4" /> Back to About Us
      </Link>

      <div className="overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative h-36 w-36 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-primary/20 shadow-md">
            <img src={hod.image_url} alt={hod.full_name} className="h-full w-full object-cover" />
          </div>

          <div className="space-y-1">
            <span className="rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
              Head of Department
            </span>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{hod.full_name}</h1>
            <p className="text-sm font-medium text-muted-foreground">{hod.designation}</p>
            <div className="pt-2 text-xs text-muted-foreground flex gap-4">
              <span>{hod.email}</span>
              <span>{hod.phone}</span>
            </div>
          </div>
        </div>

        <div className="relative mt-8 border-t border-border/60 pt-6">
          <Quote className="absolute -top-3 left-4 h-6 w-6 text-primary/20" />
          <div className="space-y-4 text-sm leading-relaxed text-foreground/90">
            <p>
              Welcome to the Department of Computer Science &amp; Engineering at the National Institute of Technology. Since our inception, we have been committed to fostering an ecosystem of high-impact learning, rigorous scientific inquiry, and technological leadership.
            </p>
            <p>
              Our academic programmes are designed to bridge fundamental theoretical foundations with rapidly advancing technologies including Artificial Intelligence, Cloud &amp; Distributed Systems, Cyber-Physical Security, and High-Performance Computing.
            </p>
            <p>
              Our students consistently achieve top placement packages and secure admissions into prestigious research institutions globally. We encourage you to explore our research output and collaborate with our faculty.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
