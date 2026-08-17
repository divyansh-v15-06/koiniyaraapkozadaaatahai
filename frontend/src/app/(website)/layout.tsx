import type { ReactNode } from "react";
import { PublicHeader } from "@/components/layouts/public-header";
import { PublicFooter } from "@/components/layouts/public-footer";

/**
 * Public website layout — shared header/nav/footer across all public pages.
 * This wraps: home, about, academics, people, research, news, placements.
 */
export default function WebsiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
