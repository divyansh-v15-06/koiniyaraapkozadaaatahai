"use client";

import type { ReactNode } from "react";
import { FacultySidebar } from "@/components/layouts/faculty-sidebar";

/**
 * Authenticated faculty pages layout — sidebar + content area.
 * All routes under /faculty/(pages)/* render inside this layout.
 */
export default function FacultyPagesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <FacultySidebar />
      <div className="flex flex-1 flex-col">
        {/* Top header bar */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-sm">
          <h2 className="text-sm font-medium text-muted-foreground">
            Faculty Dashboard
          </h2>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
              F
            </div>
          </div>
        </header>
        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
