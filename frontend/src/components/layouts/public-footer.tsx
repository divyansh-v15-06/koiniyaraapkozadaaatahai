import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-[hsl(220,25%,10%)] text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Department Info */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">
              CSE Department
            </h3>
            <p className="text-sm leading-relaxed text-gray-400">
              Department of Computer Science &amp; Engineering, National
              Institute of Technology.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Faculty", href: "/people/faculty" },
                { label: "Publications", href: "/research/publications" },
                { label: "Placements", href: "/placementpage" },
                { label: "Announcements", href: "/news/announcements" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Academics */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Academics
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Programmes", href: "/academics/programsoffered" },
                { label: "Syllabus", href: "/academics/syllabus" },
                { label: "Labs", href: "/academics/labs" },
                { label: "Students", href: "/people/students" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Contact
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                head.cse@nith.ac.in
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                +91-XXXXX XXXXX
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
                NIT Campus, Hamirpur, HP 177005
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Department of Computer Science &amp;
          Engineering. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
