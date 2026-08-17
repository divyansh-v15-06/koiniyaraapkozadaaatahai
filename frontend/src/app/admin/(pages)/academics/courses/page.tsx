"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { MOCK_COURSES } from "@/lib/mock-data";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState(MOCK_COURSES);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Course Offerings &amp; Curriculum</h1>
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Credits</th>
              <th className="px-6 py-4">Level</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {courses.map((c) => (
              <tr key={c.code} className="hover:bg-accent/30">
                <td className="px-6 py-4 font-mono font-bold text-primary">{c.code}</td>
                <td className="px-6 py-4 font-semibold text-foreground">{c.name}</td>
                <td className="px-6 py-4">{c.credits}</td>
                <td className="px-6 py-4">{c.level}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => { setCourses(courses.filter((x) => x.code !== c.code)); toast.success("Course deleted"); }} className="p-1 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
