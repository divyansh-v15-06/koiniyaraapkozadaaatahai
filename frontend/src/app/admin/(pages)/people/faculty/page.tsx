"use client";

import { useState } from "react";
import { UserPlus, Search, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { MOCK_FACULTY } from "@/lib/mock-data";

export default function AdminFacultyPage() {
  const [facultyList, setFacultyList] = useState(MOCK_FACULTY);
  const [search, setSearch] = useState("");

  const filtered = facultyList.filter(
    (f) =>
      f.full_name.toLowerCase().includes(search.toLowerCase()) ||
      f.employee_code.toLowerCase().includes(search.toLowerCase()) ||
      f.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Faculty Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage faculty accounts, profiles, and scopes.</p>
        </div>
        <button
          type="button"
          onClick={() => toast.info("Faculty creation modal ready")}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-sm"
        >
          <UserPlus className="h-4 w-4" /> Add New Faculty
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search faculty..."
              className="w-full rounded-xl border border-input bg-background py-2 pl-10 pr-4 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Faculty Member</th>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Designation</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((f) => (
                <tr key={f.id} className="hover:bg-accent/30 transition">
                  <td className="px-6 py-4 font-bold text-foreground">{f.full_name}</td>
                  <td className="px-6 py-4 font-mono font-semibold text-primary">{f.employee_code}</td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">{f.designation}</td>
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{f.email}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        setFacultyList(facultyList.filter((x) => x.id !== f.id));
                        toast.success("Faculty member deleted");
                      }}
                      className="p-1.5 text-muted-foreground hover:text-destructive transition rounded-lg hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
