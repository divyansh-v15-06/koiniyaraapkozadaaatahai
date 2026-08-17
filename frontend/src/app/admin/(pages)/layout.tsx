"use client";

import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/layouts/admin-sidebar";

/**
 * Authenticated admin pages layout — sidebar + content area.
 */
export default function AdminPagesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-sm">
          <h2 className="text-sm font-medium text-muted-foreground">
            Admin Dashboard
          </h2>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center text-xs font-semibold">
              A
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
