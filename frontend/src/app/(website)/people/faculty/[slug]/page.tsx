"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Award,
  FileText,
  Lightbulb,
  Globe,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import { MOCK_FACULTY, MOCK_PUBLICATIONS, MOCK_PATENTS, MOCK_PROJECTS } from "@/lib/mock-data";

export default function FacultyPortfolioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const code = resolvedParams.slug.toUpperCase();

  const faculty = MOCK_FACULTY.find(
    (f) => f.employee_code.toUpperCase() === code || f.id.toLowerCase() === resolvedParams.slug.toLowerCase()
  );

  if (!faculty) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Faculty Member Not Found</h2>
        <p className="mt-2 text-muted-foreground">The faculty profile you are looking for does not exist.</p>
        <Link href="/people/faculty" className="mt-6 inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Faculty Directory
        </Link>
      </div>
    );
  }

  const publications = MOCK_PUBLICATIONS.filter((p) =>
    p.authors?.some((a) => a.faculty_id === faculty.id || a.author_name.includes(faculty.full_name))
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/people/faculty"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Faculty Directory
      </Link>

      {/* Hero Profile Card */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
          <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-primary/20 shadow-md">
            <img
              src={faculty.image_url}
              alt={faculty.full_name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-primary/10 px-2.5 py-0.5 font-mono text-xs font-bold text-primary">
                {faculty.employee_code}
              </span>
              <span className="rounded-md bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                {faculty.designation}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              {faculty.full_name}
            </h1>

            <p className="text-sm leading-relaxed text-muted-foreground">
              {faculty.profile?.bio}
            </p>

            <div className="flex flex-wrap gap-4 pt-2 text-xs text-muted-foreground">
              <a
                href={`mailto:${faculty.email}`}
                className="flex items-center gap-1.5 font-medium hover:text-primary transition"
              >
                <Mail className="h-3.5 w-3.5 text-primary" /> {faculty.email}
              </a>
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" /> {faculty.phone}
              </span>
              {faculty.profile?.personal_website && (
                <a
                  href={faculty.profile.personal_website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-primary hover:underline"
                >
                  <Globe className="h-3.5 w-3.5" /> Personal Website
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Academic Indices / IDs */}
        <div className="mt-6 flex flex-wrap gap-3 border-t border-border/60 pt-4 text-xs">
          {faculty.profile?.orcid && (
            <div className="rounded-lg border border-border bg-secondary/40 px-3 py-1.5">
              <span className="text-muted-foreground">ORCID: </span>
              <span className="font-mono font-medium text-foreground">{faculty.profile.orcid}</span>
            </div>
          )}
          {faculty.profile?.scopus_id && (
            <div className="rounded-lg border border-border bg-secondary/40 px-3 py-1.5">
              <span className="text-muted-foreground">Scopus ID: </span>
              <span className="font-mono font-medium text-foreground">{faculty.profile.scopus_id}</span>
            </div>
          )}
          {faculty.profile?.google_scholar_id && (
            <div className="rounded-lg border border-border bg-secondary/40 px-3 py-1.5">
              <span className="text-muted-foreground">Scholar ID: </span>
              <span className="font-mono font-medium text-foreground">{faculty.profile.google_scholar_id}</span>
            </div>
          )}
        </div>
      </div>

      {/* Grid: Qualifications & Research Areas */}
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {/* Education & Qualifications */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <GraduationCap className="h-5 w-5 text-primary" /> Educational Qualifications
          </h2>
          <div className="mt-4 space-y-3">
            {faculty.qualifications.map((q, i) => (
              <div key={i} className="rounded-xl border border-border/70 bg-secondary/20 p-3.5">
                <p className="font-semibold text-foreground text-sm">{q.degree}</p>
                <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{q.institute}</span>
                  <span className="font-medium text-primary">{q.year}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Specializations & Research Focus */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <Lightbulb className="h-5 w-5 text-chart-3" /> Specializations &amp; Areas of Interest
          </h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            {faculty.profile?.specializations}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {faculty.research_interests.map((interest) => (
              <span
                key={interest}
                className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Publications Section */}
      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <BookOpen className="h-5 w-5 text-primary" /> Publications ({publications.length})
          </h2>
          <Link
            href="/research/publications"
            className="text-xs font-semibold text-primary hover:underline"
          >
            View Department Catalogue →
          </Link>
        </div>

        <div className="mt-4 space-y-3">
          {publications.length > 0 ? (
            publications.map((pub) => (
              <div
                key={pub.id}
                className="rounded-xl border border-border/80 bg-background p-4 transition hover:border-primary/40"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                    {pub.publication_type}
                  </span>
                  {pub.is_sci && (
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      SCI Indexed
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">• {pub.year}</span>
                </div>
                <h3 className="mt-2 text-sm font-bold text-foreground">{pub.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  <span className="italic">{pub.journal_or_conference_name}</span>, Vol. {pub.volume || "—"}, pp. {pub.pages || "—"}
                </p>
                {pub.doi && (
                  <p className="mt-1.5 text-xs text-primary font-mono">
                    DOI: {pub.doi}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground italic">No publications listed yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
