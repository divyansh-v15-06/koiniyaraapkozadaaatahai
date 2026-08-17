import { z } from "zod";

// ─── Auth ─────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email or faculty code is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(6),
    new_password: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Must contain uppercase, lowercase, and a number"
      ),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// ─── Faculty Profile ──────────────────────────────────────────────────────
export const facultyProfileSchema = z.object({
  full_name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  designation: z.string().min(1, "Designation required"),
  specializations: z.string().optional(),
  google_scholar_id: z.string().optional(),
  scopus_id: z.string().optional(),
  orcid: z.string().optional(),
  personal_website: z.string().url().optional().or(z.literal("")),
  bio: z.string().optional(),
});

export type FacultyProfileInput = z.infer<typeof facultyProfileSchema>;

// ─── Publication ──────────────────────────────────────────────────────────
export const publicationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  publication_type: z.enum(["JOURNAL", "CONFERENCE", "BOOK", "BOOK_CHAPTER"]),
  journal_or_conference_name: z.string().min(1, "Journal/Conference name required"),
  volume: z.string().optional(),
  issue: z.string().optional(),
  pages: z.string().optional(),
  year: z.coerce.number().int().min(1950).max(new Date().getFullYear() + 1),
  month: z.coerce.number().int().min(1).max(12).optional(),
  doi: z.string().optional(),
  issn_isbn: z.string().optional(),
  impact_factor: z.coerce.number().optional(),
  is_sci: z.boolean().default(false),
  is_scopus: z.boolean().default(false),
  is_peer_reviewed: z.boolean().default(true),
  abstract_text: z.string().optional(),
  publisher: z.string().optional(),
});

export type PublicationInput = z.infer<typeof publicationSchema>;

// ─── Patent ───────────────────────────────────────────────────────────────
export const patentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  application_number: z.string().optional(),
  patent_number: z.string().optional(),
  status: z.enum(["Filed", "Published", "Granted", "Abandoned"]),
  filing_date: z.string().optional(),
  grant_date: z.string().optional(),
  country: z.string().default("India"),
  patent_office: z.string().optional(),
  abstract_text: z.string().optional(),
});

export type PatentInput = z.infer<typeof patentSchema>;

// ─── Project ──────────────────────────────────────────────────────────────
export const projectSchema = z.object({
  title: z.string().min(1, "Title required"),
  funding_agency: z.string().min(1, "Funding agency required"),
  status: z.enum(["Ongoing", "Completed", "Submitted"]),
  project_type: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  total_sanctioned_amount: z.coerce.number().min(0).optional(),
  total_amount_received: z.coerce.number().min(0).optional(),
  scheme: z.string().optional(),
  reference_number: z.string().optional(),
});

export type ProjectInput = z.infer<typeof projectSchema>;

// ─── Announcement ─────────────────────────────────────────────────────────
export const announcementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().optional(),
  publish_date: z.string().optional(),
  expiry_date: z.string().optional(),
  is_private: z.boolean().default(false),
});

export type AnnouncementInput = z.infer<typeof announcementSchema>;

// ─── Student ──────────────────────────────────────────────────────────────
export const studentSchema = z.object({
  name: z.string().min(1, "Name required"),
  roll_number: z.string().min(1, "Roll number required"),
  email: z.string().email().optional().or(z.literal("")),
  programme_id: z.string().uuid().optional(),
  batch_year: z.coerce.number().int().min(2000).max(new Date().getFullYear() + 1),
  cgpa: z.coerce.number().min(0).max(10).optional(),
});

export type StudentInput = z.infer<typeof studentSchema>;
