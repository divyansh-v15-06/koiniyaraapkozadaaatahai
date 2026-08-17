import type { ReactNode } from "react";

export const metadata = {
  title: "Faculty Portal",
  description: "Faculty academic management portal for CV, research, and publications.",
};

/**
 * Faculty portal root layout — handles the login page (no sidebar)
 * and authenticated pages (with sidebar via nested layout).
 */
export default function FacultyRootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
