/**
 * Faculty login page — identifier (code/email) + password.
 */
export default function FacultyLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[hsl(220,25%,8%)] to-[hsl(217,40%,18%)]">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-8 shadow-xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Faculty Portal</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to manage your academic profile
          </p>
        </div>
        {/* Login form will be implemented with React Hook Form + Zod */}
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Faculty Code or Email
            </label>
            <input
              type="text"
              placeholder="CS01 or name@nith.ac.in"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm transition focus:border-primary focus:ring-2 focus:ring-ring/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm transition focus:border-primary focus:ring-2 focus:ring-ring/20"
            />
          </div>
          <button
            type="button"
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            Sign In
          </button>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          <a href="/forgotpassword" className="text-primary hover:underline">
            Forgot password?
          </a>
        </p>
      </div>
    </div>
  );
}
