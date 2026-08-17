"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "How can I apply for Ph.D. admissions in the CSE Department?",
    a: "Ph.D. admissions are conducted bi-annually (Autumn and Spring sessions) through the institute admission portal. Candidates with valid GATE/NET scores or eligible master's degrees must apply online and appear for a departmental written test and interview.",
  },
  {
    q: "What are the core research groups active in the department?",
    a: "The department has active research groups in Cloud & Distributed Systems, Artificial Intelligence & Biomedical Image Processing, Cybersecurity & Cryptography, Natural Language Processing, and Internet of Things (IoT).",
  },
  {
    q: "How can students apply for internships with department faculty?",
    a: "Undergraduate and postgraduate students can reach out directly to faculty members via their institutional email with a resume and statement of interest, or apply through the institute summer internship programme announced every March.",
  },
  {
    q: "What computing resources are available for student projects?",
    a: "Students have access to dedicated NVIDIA GPU clusters, OpenStack cloud testbeds, isolated cybersecurity simulation networks, and high-speed campus internet across all department labs.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">Support &amp; Inquiries</span>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Find quick answers regarding admissions, research, internships, and department facilities.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-border bg-card transition shadow-sm"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between p-5 text-left font-semibold text-foreground transition hover:bg-accent/50"
              >
                <span className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  {faq.q}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition duration-200 ${
                    isOpen ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="border-t border-border/60 bg-muted/20 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
