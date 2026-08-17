import type { ReactNode } from "react";

export const metadata = {
  title: "Admin Portal",
  description: "Department administration and content management portal.",
};

/**
 * Admin portal root layout — wraps login and authenticated pages.
 */
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
