import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Department of Computer Science & Engineering",
    template: "%s | CSE Department",
  },
  description:
    "Department of Computer Science & Engineering — Faculty, Research, Academics, and Placements at the National Institute of Technology.",
  keywords: [
    "CSE",
    "Computer Science",
    "NIT",
    "Faculty",
    "Research",
    "Publications",
    "Patents",
    "Projects",
  ],
  authors: [{ name: "CSE Department" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
