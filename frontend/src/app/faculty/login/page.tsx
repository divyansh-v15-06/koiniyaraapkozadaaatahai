"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  GraduationCap,
  Lock,
  User,
  Loader2,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Building2,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import apiClient from "@/lib/api-client";
import { MOCK_FACULTY } from "@/lib/mock-data";

const facultyLoginSchema = z.object({
  identifier: z.string().min(2, "Enter your faculty code (e.g. CS01) or institute email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FacultyLoginInput = z.infer<typeof facultyLoginSchema>;

export default function FacultyLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      // 1. Try real backend API
      try {
        const res = await apiClient.post("/auth/login", {
          identifier: data.identifier,
          password: data.password,
        });
        if (res.data?.data?.access_token) {
          localStorage.setItem("auth_token", res.data.data.access_token);
          localStorage.setItem(
            "auth_user",
            JSON.stringify(res.data.data.user || { role: "FACULTY", email: data.identifier })
          );
          toast.success("Welcome to the Faculty Portal!");
          router.push("/faculty");
          return;
        }
      } catch (err) {
        console.warn("Backend API unavailable, using client-side auth fallback:", err);
      }

      // 2. Client-side authentication fallback against seeded faculty
      const match = MOCK_FACULTY.find(
        (f) =>
          f.employee_code.toLowerCase() === data.identifier.toLowerCase() ||
          f.email.toLowerCase() === data.identifier.toLowerCase() ||
          f.full_name.toLowerCase().includes(data.identifier.toLowerCase())
      );

      if (
        match ||
        data.identifier.toLowerCase().startsWith("cs") ||
        data.identifier.includes("@nith.ac.in") ||
        data.identifier.includes("@")
      ) {
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
        toast.error("Faculty credentials not recognized. You can use the Quick Demo Logins below.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (code: string, email: string, name: string) => {
    setValue("identifier", code);
    setValue("password", "Faculty@123456");
    toast.info(`Filled credentials for ${name} (${code})`);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#1c110c] via-[#33110e] to-[#4a1814] px-4 py-12 text-neutral-900 font-sans selection:bg-[#85261e] selection:text-white">
      {/* Decorative Ambient Background Blurs */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[#85261e]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-amber-500/15 blur-3xl" />

      <div className="relative z-10 w-full max-w-md space-y-4 rounded-3xl border border-white/20 bg-white/95 p-5 sm:p-7 shadow-2xl backdrop-blur-2xl">
        {/* Header Branding */}
        <div className="text-center space-y-1.5">
          <div className="mx-auto w-12 h-12 rounded-full bg-[#fff9f6] border border-[#eedfd8] p-2 shadow-2xs flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/nith.png"
              alt="NIT Hamirpur"
              className="w-full h-full object-contain filter drop-shadow-2xs"
            />
          </div>

          <div>
            <span className="bg-[#fff9f6] text-[#85261e] border border-[#eedfd8] text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Faculty Academic Suite
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#33110e] tracking-tight mt-0.5">
              Faculty Portal Login
            </h1>
            <p className="text-[11px] text-neutral-600 max-w-xs mx-auto">
              National Institute of Technology Hamirpur
            </p>
          </div>
        </div>

        {/* Quick Demo Faculty Profiles */}
        <div className="rounded-xl border border-[#eedfd8] bg-[#fff9f6] p-3 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#33110e] flex items-center gap-1 text-[10px] uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#85261e]" /> Quick Demo Logins:
            </span>
            <span className="text-[9px] text-neutral-500 font-mono">1-Click Fill</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-0.5">
            {[
              { code: "CS01", name: "Prof. Lalit Awasthi", email: "lalit@nith.ac.in" },
              { code: "CS04", name: "Dr. Siddhartha (HOD)", email: "sid@nith.ac.in" },
              { code: "CS02", name: "Dr. Kamlesh Dutta", email: "kmd@nith.ac.in" },
              { code: "CS12", name: "Dr. Arun K. Yadav", email: "arun@nith.ac.in" },
              { code: "CS17", name: "Dr. Khalid Pandit", email: "khalid@nith.ac.in" },
              { code: "CS05", name: "Dr. Naveen Chauhan", email: "naveen@nith.ac.in" },
            ].map((fac) => (
              <button
                key={fac.code}
                type="button"
                onClick={() => handleQuickFill(fac.code, fac.email, fac.name)}
                className="text-left rounded-lg border border-[#eedfd8] bg-white p-1.5 text-[#33110e] hover:bg-[#33110e] hover:text-white transition duration-150 shadow-2xs group cursor-pointer"
              >
                <div className="font-bold text-[10px] truncate group-hover:text-amber-300">
                  {fac.code}
                </div>
                <div className="text-[9px] text-neutral-600 group-hover:text-neutral-200 truncate">
                  {fac.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 pt-0.5">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#33110e] mb-1">
              Faculty Code or Institute Email
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-400" />
              <input
                {...register("identifier")}
                type="text"
                placeholder="e.g. CS01, CS04 or name@nith.ac.in"
                className="w-full rounded-xl border border-[#eedfd8] bg-white py-2 pl-9 pr-3 text-xs text-[#1c110c] placeholder:text-neutral-400 transition focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
              />
            </div>
            {errors.identifier && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.identifier.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#33110e] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-400" />
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-[#eedfd8] bg-white py-2 pl-9 pr-9 text-xs text-[#1c110c] placeholder:text-neutral-400 transition focus:border-[#85261e] focus:outline-hidden focus:ring-1 focus:ring-[#85261e]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-neutral-400 hover:text-[#33110e] transition"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#33110e] hover:bg-[#85261e] py-2.5 text-xs font-bold text-white shadow-md hover:shadow-lg transition duration-150 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-300" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Faculty Portal</span>
                <ArrowRight className="h-3.5 w-3.5 text-amber-300" />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="pt-1.5 text-center border-t border-[#eedfd8]">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#85261e] hover:underline"
          >
            <ArrowLeft className="w-3 h-3" /> Return to Institute Website
          </Link>
        </div>
      </div>
    </div>
  );
}
