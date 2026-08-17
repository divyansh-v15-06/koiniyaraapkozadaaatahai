"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { GraduationCap, Lock, User, Loader2, ArrowRight } from "lucide-react";
import apiClient from "@/lib/api-client";
import { MOCK_FACULTY } from "@/lib/mock-data";

const facultyLoginSchema = z.object({
  identifier: z.string().min(2, "Enter your faculty code (e.g., CS01) or institute email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FacultyLoginInput = z.infer<typeof facultyLoginSchema>;

export default function FacultyLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FacultyLoginInput>({
    resolver: zodResolver(facultyLoginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: FacultyLoginInput) => {
    setLoading(true);
    try {
      // Try real backend API
      try {
        const res = await apiClient.post("/auth/login", {
          identifier: data.identifier,
          password: data.password,
        });
        if (res.data?.data?.access_token) {
          localStorage.setItem("auth_token", res.data.data.access_token);
          localStorage.setItem("auth_user", JSON.stringify(res.data.data.user || { role: "FACULTY", email: data.identifier }));
          toast.success("Welcome to the Faculty Portal!");
          router.push("/faculty");
          return;
        }
      } catch (err) {
        console.warn("Backend API unavailable, using client-side auth fallback:", err);
      }

      // Check against mock faculty
      const match = MOCK_FACULTY.find(
        (f) =>
          f.employee_code.toLowerCase() === data.identifier.toLowerCase() ||
          f.email.toLowerCase() === data.identifier.toLowerCase()
      );

      if (match || data.identifier.toLowerCase().startsWith("cs") || data.identifier.includes("@")) {
        const facultyUser = match || MOCK_FACULTY[0];
        localStorage.setItem("auth_token", `mock-faculty-jwt-${facultyUser.id}`);
        localStorage.setItem(
          "auth_user",
          JSON.stringify({
            id: facultyUser.user_id,
            faculty_id: facultyUser.id,
            email: facultyUser.email,
            full_name: facultyUser.full_name,
            employee_code: facultyUser.employee_code,
            roles: ["FACULTY"],
          })
        );
        toast.success(`Welcome back, ${facultyUser.full_name}!`);
        router.push("/faculty");
      } else {
        toast.error("Faculty member not found. Try CS01 or rajesh@nith.ac.in with password Faculty@123");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (code: string, email: string) => {
    setValue("identifier", code);
    setValue("password", "Faculty@123456");
    toast.info(`Filled credentials for ${code} (${email})`);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[hsl(224,30%,8%)] via-[hsl(217,35%,14%)] to-[hsl(220,40%,20%)] px-4 py-12 text-white">
      <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md space-y-6 rounded-2xl border border-white/10 bg-card/95 p-8 text-card-foreground shadow-2xl backdrop-blur-xl">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Faculty Academic Portal</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your research CV, publications, patents &amp; portfolios
          </p>
        </div>

        {/* Demo Fast Login Options */}
        <div className="space-y-2 rounded-lg border border-border/60 bg-muted/40 p-3 text-xs">
          <p className="font-semibold text-foreground">Quick Demo Faculty Logins:</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill("CS01", "rajesh@nith.ac.in")}
              className="rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-primary transition hover:bg-primary/20"
            >
              Dr. Rajesh (CS01 - HOD)
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill("CS02", "priya@nith.ac.in")}
              className="rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-primary transition hover:bg-primary/20"
            >
              Dr. Priya (CS02 - AI)
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Faculty Code or Email
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                {...register("identifier")}
                type="text"
                placeholder="CS01 or name@nith.ac.in"
                className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            {errors.identifier && (
              <p className="mt-1 text-xs text-destructive">{errors.identifier.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Authenticating...
              </>
            ) : (
              <>
                Sign In to Faculty Portal <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-muted-foreground">
          <a href="/" className="text-primary hover:underline">
            ← Back to Public Website
          </a>
        </div>
      </div>
    </div>
  );
}
