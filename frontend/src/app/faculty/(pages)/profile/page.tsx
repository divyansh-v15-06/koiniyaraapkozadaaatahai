"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save, User, Mail, Phone, Globe, BookOpen, FileText } from "lucide-react";
import { MOCK_FACULTY } from "@/lib/mock-data";

export default function FacultyProfilePage() {
  const [faculty, setFaculty] = useState(MOCK_FACULTY[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile changes saved successfully!");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Faculty Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your public profile, research bio, and academic identifier links.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Full Name
            </label>
            <input
              type="text"
              value={faculty.full_name}
              onChange={(e) => setFaculty({ ...faculty, full_name: e.target.value })}
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Employee Code (Read-Only)
            </label>
            <input
              type="text"
              disabled
              value={faculty.employee_code}
              className="w-full rounded-xl border border-input bg-muted/50 px-3.5 py-2.5 text-sm text-muted-foreground cursor-not-allowed font-mono"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Institute Email
            </label>
            <input
              type="email"
              value={faculty.email}
              onChange={(e) => setFaculty({ ...faculty, email: e.target.value })}
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Contact Phone
            </label>
            <input
              type="text"
              value={faculty.phone}
              onChange={(e) => setFaculty({ ...faculty, phone: e.target.value })}
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Research Bio &amp; Summary
          </label>
          <textarea
            rows={4}
            value={faculty.profile?.bio}
            onChange={(e) =>
              setFaculty({
                ...faculty,
                profile: { ...faculty.profile!, bio: e.target.value },
              })
            }
            className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 leading-relaxed"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Specializations (Comma Separated)
          </label>
          <input
            type="text"
            value={faculty.profile?.specializations}
            onChange={(e) =>
              setFaculty({
                ...faculty,
                profile: { ...faculty.profile!, specializations: e.target.value },
              })
            }
            className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Academic Identifiers */}
        <div className="border-t border-border/60 pt-6">
          <h2 className="text-sm font-bold text-foreground mb-4">Academic &amp; Research Identifiers</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">ORCID ID</label>
              <input
                type="text"
                placeholder="0000-0002-XXXX-XXXX"
                value={faculty.profile?.orcid || ""}
                onChange={(e) =>
                  setFaculty({
                    ...faculty,
                    profile: { ...faculty.profile!, orcid: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-mono"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">Scopus Author ID</label>
              <input
                type="text"
                placeholder="571938XXXXX"
                value={faculty.profile?.scopus_id || ""}
                onChange={(e) =>
                  setFaculty({
                    ...faculty,
                    profile: { ...faculty.profile!, scopus_id: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-mono"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">Google Scholar User ID</label>
              <input
                type="text"
                placeholder="scholar_user_id"
                value={faculty.profile?.google_scholar_id || ""}
                onChange={(e) =>
                  setFaculty({
                    ...faculty,
                    profile: { ...faculty.profile!, google_scholar_id: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-border/60">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition"
          >
            <Save className="h-4 w-4" /> Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
}
